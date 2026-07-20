import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthUser {
  userId: string;
  role: string;
  tier: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid authorization header" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "super_secret_jwt_key_for_dev") as AuthUser;
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  
  if (req.user.role !== "admin" && req.user.role !== "superadmin") {
    res.status(403).json({ error: "Forbidden: Admins only" });
    return;
  }
  
  next();
}

export function requireInstructor(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const allowedRoles = ["instructor", "admin", "superadmin"];
  if (!allowedRoles.includes(req.user.role)) {
    res.status(403).json({ error: "Forbidden: Instructors only" });
    return;
  }

  next();
}
