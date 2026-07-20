import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { PathsService } from "../services/paths.service";
import { cacheMiddleware } from "../lib/cache";

export const pathsRouter = Router();
const pathsService = new PathsService();

/**
 * GET /api/paths
 * List all published learning paths
 */
pathsRouter.get("/", cacheMiddleware(5), async (req, res, next) => {
  try {
    const paths = await pathsService.getPublishedPaths();
    res.json(paths);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/paths/:slug
 * Get full path details by slug
 */
pathsRouter.get("/:slug", cacheMiddleware(5), async (req, res, next) => {
  try {
    const path = await pathsService.getPathBySlug(req.params.slug as string);
    res.json(path);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/paths/:id/enroll
 * Enroll student in a path and its courses
 */
pathsRouter.post("/:id/enroll", authenticate, async (req, res, next) => {
  try {
    const result = await pathsService.enrollUserInPath(req.user!.userId, req.params.id as string);
    res.json(result);
  } catch (error) {
    next(error);
  }
});
