import { supabase } from "../lib/supabase";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { zodSchemas } from "@workspace/api-zod";
import { z } from "zod";

type RegisterInput = z.infer<typeof zodSchemas.RegisterBody>;
type LoginInput = z.infer<typeof zodSchemas.LoginBody>;

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_jwt_key_for_dev";
const JWT_EXPIRES_IN = "1d";
const REFRESH_EXPIRES_IN_DAYS = 7;
const RESET_TOKEN_EXPIRES_MINUTES = 60; // 1 hour

// Base URL for reset password link (frontend URL)
const SITE_URL = process.env.SITE_URL || "https://hekayaty-academy.vercel.app";

export class AuthService {
  static async register(data: RegisterInput) {
    // Check if user already exists
    const { data: existing, error: findError } = await supabase
      .from("users")
      .select("id")
      .eq("email", data.email)
      .limit(1);

    if (findError) {
      console.error("[AuthService.register] find error:", findError);
      throw new Error("Database error while checking email");
    }

    if (existing && existing.length > 0) {
      throw new Error("User with this email already exists");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10);

    // Insert user
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert({
        email: data.email,
        password_hash: passwordHash,
        name: data.name,
        role: "student",
        subscription_tier: "free",
        is_verified: "false",
        is_suspended: false,
      })
      .select()
      .single();

    if (insertError || !newUser) {
      console.error("[AuthService.register] insert error:", insertError);
      throw new Error(`Failed to create user: ${insertError?.message}`);
    }

    // Generate tokens
    const { accessToken, refreshToken } = await this.generateTokens(newUser);

    return {
      accessToken,
      refreshToken,
      user: this.sanitizeUser(newUser),
    };
  }

  static async login(data: LoginInput) {
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", data.email)
      .limit(1);

    if (error) {
      console.error("[AuthService.login] error:", error);
      throw new Error("Database error during login");
    }

    const user = users?.[0];
    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (user.is_suspended) {
      throw new Error("Account is suspended");
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password_hash);
    if (!isValidPassword) {
      throw new Error("Invalid email or password");
    }

    const { accessToken, refreshToken } = await this.generateTokens(user);

    return {
      accessToken,
      refreshToken,
      user: this.sanitizeUser(user),
    };
  }

  static async getAuthMe(userId: string) {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !user) {
      throw new Error("User not found");
    }

    return this.sanitizeUser(user);
  }

  /**
   * Initiates the forgot password flow.
   * Generates a secure token, stores it in DB, and sends a reset email via Supabase.
   */
  static async forgotPassword(email: string) {
    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Find user - always return success to prevent email enumeration
    const { data: users } = await supabase
      .from("users")
      .select("id, email, name")
      .eq("email", normalizedEmail)
      .limit(1);

    const user = users?.[0];

    // Security: always respond with success even if user not found
    if (!user) {
      return { message: "If this email is registered, you will receive a reset link shortly." };
    }

    // Generate secure random token
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = await bcrypt.hash(token, 10);
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + RESET_TOKEN_EXPIRES_MINUTES);

    // Delete any existing reset tokens for this user
    await supabase
      .from("password_resets")
      .delete()
      .eq("user_id", user.id);

    // Store new token in password_resets table
    const { error: insertError } = await supabase
      .from("password_resets")
      .insert({
        user_id: user.id,
        token_hash: tokenHash,
        expires_at: expiresAt.toISOString(),
      });

    if (insertError) {
      console.error("[AuthService.forgotPassword] insert error:", insertError);
      throw new Error("Failed to create reset token");
    }

    const resetUrl = `${SITE_URL}/auth/reset-password?token=${token}`;
    console.log(`[AuthService.forgotPassword] Reset URL for ${normalizedEmail}: ${resetUrl}`);

    // Try to send email via Supabase auth admin
    try {
      const { error: emailError } = await (supabase.auth as any).admin?.inviteUserByEmail?.(normalizedEmail, {
        redirectTo: resetUrl,
        data: { resetToken: token, userName: user.name }
      });

      if (emailError) {
        console.warn("[AuthService.forgotPassword] inviteUserByEmail failed:", emailError.message);
      }
    } catch (emailErr) {
      // Silently log - don't fail the request since token is stored
      console.error("[AuthService.forgotPassword] email send error:", emailErr);
    }

    // Also try resetPasswordForEmail as a fallback
    try {
      await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: resetUrl,
      });
    } catch (fallbackErr) {
      console.error("[AuthService.forgotPassword] resetPasswordForEmail error:", fallbackErr);
    }

    return { message: "If this email is registered, you will receive a reset link shortly." };
  }

  /**
   * Validates the reset token and updates the user's password.
   */
  static async resetPassword(token: string, newPassword: string) {
    if (!token || !newPassword) {
      throw new Error("Invalid request");
    }

    if (newPassword.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }

    // Fetch all non-expired reset tokens
    const { data: resets, error: fetchError } = await supabase
      .from("password_resets")
      .select("*")
      .gt("expires_at", new Date().toISOString());

    if (fetchError) {
      console.error("[AuthService.resetPassword] fetch error:", fetchError);
      throw new Error("Database error");
    }

    // Find the matching token (bcrypt compare each)
    let matchedReset: any = null;
    for (const reset of (resets || [])) {
      const isMatch = await bcrypt.compare(token, reset.token_hash);
      if (isMatch) {
        matchedReset = reset;
        break;
      }
    }

    if (!matchedReset) {
      throw new Error("Invalid or expired reset token");
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update user password
    const { error: updateError } = await supabase
      .from("users")
      .update({
        password_hash: newPasswordHash,
        updated_at: new Date().toISOString(),
      })
      .eq("id", matchedReset.user_id);

    if (updateError) {
      console.error("[AuthService.resetPassword] update error:", updateError);
      throw new Error("Failed to update password");
    }

    // Delete used token & invalidate all sessions for security
    await supabase.from("password_resets").delete().eq("id", matchedReset.id);
    await supabase.from("sessions").delete().eq("user_id", matchedReset.user_id);

    return { message: "Password reset successfully" };
  }

  private static async generateTokens(user: any) {
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role, tier: user.subscription_tier },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Generate refresh token
    const plainRefreshToken = bcrypt.genSaltSync(16);
    const refreshTokenHash = await bcrypt.hash(plainRefreshToken, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_EXPIRES_IN_DAYS);

    await supabase.from("sessions").insert({
      user_id: user.id,
      refresh_token_hash: refreshTokenHash,
      expires_at: expiresAt.toISOString(),
    });

    return { accessToken, refreshToken: plainRefreshToken };
  }

  static async updateProfile(userId: string, updates: { name?: string; avatarUrl?: string; bio?: string }) {
    const payload: any = { updated_at: new Date().toISOString() };
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.avatarUrl !== undefined) payload.avatar_url = updates.avatarUrl;
    if (updates.bio !== undefined) payload.bio = updates.bio;

    const { data: updatedUser, error } = await supabase
      .from("users")
      .update(payload)
      .eq("id", userId)
      .select()
      .single();

    if (error || !updatedUser) {
      console.error("[AuthService.updateProfile] error:", error);
      throw new Error("Failed to update profile");
    }

    return this.sanitizeUser(updatedUser);
  }

  private static sanitizeUser(user: any) {
    const { password_hash, ...safeUser } = user;
    // Normalize snake_case to camelCase for API response
    return {
      id: safeUser.id,
      email: safeUser.email,
      name: safeUser.name,
      avatarUrl: safeUser.avatar_url,
      bio: safeUser.bio,
      role: safeUser.role,
      subscriptionTier: safeUser.subscription_tier,
      isVerified: safeUser.is_verified,
      isSuspended: safeUser.is_suspended,
      createdAt: safeUser.created_at,
      updatedAt: safeUser.updated_at,
    };
  }
}
