import { Router } from "express";
import { AuthService } from "../services/auth.service";
import { authenticate, AuthUser } from "../middlewares/authenticate";
import { zodSchemas } from "@workspace/api-zod";
import rateLimit from "express-rate-limit";

const router = Router();

// Strict rate limiter for auth routes to prevent brute force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login/register requests per windowMs
  message: { error: "Too many authentication attempts, please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", authLimiter, async (req, res) => {
  try {
    // Validate request body
    const body = zodSchemas.RegisterBody.parse(req.body);
    
    const result = await AuthService.register(body);
    res.json(result);
  } catch (error: any) {
    // Handle Zod validation errors
    if (error.issues) {
      res.status(400).json({ error: "Validation failed", details: error.issues });
      return;
    }
    // Log DB / unexpected errors for debugging
    if (error.cause || error.query) {
      console.error("[Register DB Error]", error.cause || error.message);
      res.status(500).json({ error: "Database error. Please try again.", detail: String(error.cause || error.message) });
      return;
    }
    // Handle expected business logic errors (duplicate user, etc.)
    res.status(400).json({ error: error.message || "Failed to register" });
  }
});

router.post("/login", authLimiter, async (req, res) => {
  try {
    // Validate request body
    const body = zodSchemas.LoginBody.parse(req.body);
    
    const result = await AuthService.login(body);
    res.json(result);
  } catch (error: any) {
    if (error.issues) {
      res.status(400).json({ error: "Validation failed", details: error.issues });
      return;
    }
    res.status(401).json({ error: error.message || "Failed to login" });
  }
});

router.get("/me", authenticate, async (req, res) => {
  try {
    const user = req.user as AuthUser;
    const userData = await AuthService.getAuthMe(user.userId);
    res.json(userData);
  } catch (error: any) {
    res.status(401).json({ error: error.message || "Failed to fetch user" });
  }
});

router.patch("/me", authenticate, async (req, res) => {
  try {
    const user = req.user as AuthUser;
    // We should ideally use Zod validation here, but we can extract directly for now
    // based on our OpenAPI spec: name, avatarUrl, bio
    const updates = {
      name: req.body.name,
      avatarUrl: req.body.avatarUrl,
      bio: req.body.bio,
    };
    
    const userData = await AuthService.updateProfile(user.userId, updates);
    res.json(userData);
  } catch (error: any) {
    console.error("[PATCH /me] Error:", error);
    res.status(400).json({ error: error.message || "Failed to update profile" });
  }
});

export default router;
