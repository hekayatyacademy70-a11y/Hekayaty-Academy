import { Router } from "express";
import { authenticate, requireAdmin, AuthUser } from "../middlewares/authenticate";
import { AdminService } from "../services/admin.service";
import { InstructorService } from "../services/instructor.service";
import { PathsService } from "../services/paths.service";
import { ArticlesService } from "../services/articles.service";

export const adminRouter = Router();
const adminService = new AdminService();
const instructorService = new InstructorService();
const pathsService = new PathsService();
const articlesService = new ArticlesService();

// All admin routes require auth + admin role
adminRouter.use(authenticate, requireAdmin);

// ─────────────────────────────────────────────
// ANALYTICS
// ─────────────────────────────────────────────

/**
 * GET /api/admin/stats
 */
adminRouter.get("/stats", async (req, res, next) => {
  try {
    const stats = await adminService.getPlatformStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

// ─────────────────────────────────────────────
// USER MANAGEMENT
// ─────────────────────────────────────────────

/**
 * GET /api/admin/users
 */
adminRouter.get("/users", async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const offset = Number(req.query.offset) || 0;
    const result = await adminService.listUsers({ limit, offset });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/admin/users/:id/role
 */
adminRouter.put("/users/:id/role", async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!role) {
      res.status(400).json({ error: "Role is required" });
      return;
    }
    const user = await adminService.updateUserRole(req.params.id, role);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/admin/users/:id/suspend
 */
adminRouter.put("/users/:id/suspend", async (req, res, next) => {
  try {
    const { suspend } = req.body;
    const user = await adminService.suspendUser(req.params.id, !!suspend);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
});

// ─────────────────────────────────────────────
// COURSE MANAGEMENT
// ─────────────────────────────────────────────

/**
 * GET /api/admin/courses
 */
adminRouter.get("/courses", async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const offset = Number(req.query.offset) || 0;
    const result = await adminService.listAllCourses({ limit, offset });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/courses/pending
 */
adminRouter.get("/courses/pending", async (req, res, next) => {
  try {
    const courses = await adminService.getPendingCourses();
    res.json({ courses, total: courses.length });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/admin/courses/:id/approve
 */
adminRouter.put("/courses/:id/approve", async (req, res, next) => {
  try {
    const course = await adminService.approveCourse(req.params.id);
    res.json({ success: true, course });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/admin/courses/:id/reject
 */
adminRouter.put("/courses/:id/reject", async (req, res, next) => {
  try {
    const { reason } = req.body;
    const course = await adminService.rejectCourse(req.params.id);
    res.json({ success: true, course });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/admin/courses/:id
 * Admin-only: Force-delete any course including those with enrolled students.
 * All related data (enrollments, payments, completions, etc.) is cleaned up properly.
 */
adminRouter.delete("/courses/:id", async (req, res, next) => {
  try {
    const result = await instructorService.adminForceDeleteCourse(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// ─────────────────────────────────────────────
// LEARNING PATHS MANAGEMENT
// ─────────────────────────────────────────────

/** GET /api/admin/paths */
adminRouter.get("/paths", async (req, res, next) => {
  try {
    const paths = await pathsService.getAdminPaths();
    res.json(paths);
  } catch (error) {
    next(error);
  }
});

/** POST /api/admin/paths */
adminRouter.post("/paths", async (req, res, next) => {
  try {
    const path = await pathsService.createPath(req.body);
    res.status(201).json(path);
  } catch (error) {
    next(error);
  }
});

/** GET /api/admin/paths/:id */
adminRouter.get("/paths/:id", async (req, res, next) => {
  try {
    const path = await pathsService.getAdminPathDetails(req.params.id);
    res.json(path);
  } catch (error) {
    next(error);
  }
});

/** PUT /api/admin/paths/:id */
adminRouter.put("/paths/:id", async (req, res, next) => {
  try {
    const path = await pathsService.updatePath(req.params.id, req.body);
    res.json(path);
  } catch (error) {
    next(error);
  }
});

/** DELETE /api/admin/paths/:id */
adminRouter.delete("/paths/:id", async (req, res, next) => {
  try {
    await pathsService.deletePath(req.params.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

/** PUT /api/admin/paths/:id/courses – replace all courses in path */
adminRouter.put("/paths/:id/courses", async (req, res, next) => {
  try {
    const result = await pathsService.updatePathCourses(req.params.id, req.body.courses);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// ─────────────────────────────────────────────
// ARTICLES MANAGEMENT
// ─────────────────────────────────────────────

/** GET /api/admin/articles */
adminRouter.get("/articles", async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const offset = Number(req.query.offset) || 0;
    const result = await articlesService.getAllArticles(limit, offset);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/** POST /api/admin/articles */
adminRouter.post("/articles", async (req, res, next) => {
  try {
    const user = req.user as AuthUser;
    const article = await articlesService.createArticle({
      ...req.body,
      author_id: user.userId,
      author_type: "admin"
    });
    res.status(201).json(article);
  } catch (error) {
    next(error);
  }
});

/** GET /api/admin/articles/:id */
adminRouter.get("/articles/:id", async (req, res, next) => {
  try {
    const article = await articlesService.getArticleById(req.params.id as string);
    res.json(article);
  } catch (error) {
    next(error);
  }
});

/** PUT /api/admin/articles/:id */
adminRouter.put("/articles/:id", async (req, res, next) => {
  try {
    const user = req.user as AuthUser;
    const article = await articlesService.updateArticle(req.params.id as string, user.userId, user.role, req.body);
    res.json(article);
  } catch (error) {
    next(error);
  }
});

/** PUT /api/admin/articles/:id/status */
adminRouter.put("/articles/:id/status", async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) {
      res.status(400).json({ error: "Status is required" });
      return;
    }
    const article = await articlesService.updateArticleStatus(req.params.id as string, status);
    res.json(article);
  } catch (error) {
    next(error);
  }
});

/** DELETE /api/admin/articles/:id */
adminRouter.delete("/articles/:id", async (req, res, next) => {
  try {
    await articlesService.deleteArticle(req.params.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});
