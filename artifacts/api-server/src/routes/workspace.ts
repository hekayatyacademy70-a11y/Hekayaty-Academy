import { Router } from "express";
import { authenticate, AuthUser } from "../middlewares/authenticate";
import { WorkspaceService } from "../services/workspace.service";
import { AiService } from "../services/ai.service";

export const workspaceRouter = Router();
const workspaceService = new WorkspaceService();
const aiService = new AiService();

// All workspace routes require authentication
workspaceRouter.use(authenticate);

/**
 * POST /api/workspaces/ai/generate
 */
workspaceRouter.post("/ai/generate", async (req, res, next) => {
  try {
    const { prompt, context } = req.body;
    const text = await aiService.generateText(prompt, context);
    res.json({ text });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/workspaces/manuscripts
 */
workspaceRouter.get("/manuscripts", async (req, res, next) => {
  try {
    const user = req.user as AuthUser;
    const manuscripts = await workspaceService.getMyManuscripts(user.userId);
    res.json(manuscripts);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/workspaces/manuscripts
 */
workspaceRouter.post("/manuscripts", async (req, res, next) => {
  try {
    const user = req.user as AuthUser;
    const { title, genre } = req.body;
    const manuscript = await workspaceService.createManuscript(user.userId, title, genre);
    res.status(201).json(manuscript);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/workspaces/manuscripts/:id
 */
workspaceRouter.get("/manuscripts/:id", async (req, res, next) => {
  try {
    const user = req.user as AuthUser;
    const manuscriptId = req.params.id;
    const details = await workspaceService.getManuscriptDetails(manuscriptId, user.userId);
    res.json(details);
  } catch (error: any) {
    if (error.message === "Manuscript not found") {
      res.status(404).json({ message: "Manuscript not found" });
    } else {
      next(error);
    }
  }
});

/**
 * PUT /api/workspaces/manuscripts/:id
 */
workspaceRouter.put("/manuscripts/:id", async (req, res, next) => {
  try {
    const user = req.user as AuthUser;
    const manuscriptId = req.params.id;
    const updated = await workspaceService.updateManuscript(manuscriptId, user.userId, req.body);
    res.json(updated);
  } catch (error: any) {
    if (error.message === "Manuscript not found") {
      res.status(404).json({ message: "Manuscript not found" });
    } else {
      next(error);
    }
  }
});

/**
 * POST /api/workspaces/manuscripts/:id/chapters
 */
workspaceRouter.post("/manuscripts/:id/chapters", async (req, res, next) => {
  try {
    const user = req.user as AuthUser;
    const manuscriptId = req.params.id;
    const { title } = req.body;
    const chapter = await workspaceService.createChapter(manuscriptId, user.userId, title);
    res.status(201).json(chapter);
  } catch (error: any) {
    if (error.message === "Manuscript not found") {
      res.status(404).json({ message: "Manuscript not found" });
    } else {
      next(error);
    }
  }
});

/**
 * PUT /api/workspaces/chapters/:chapterId
 */
workspaceRouter.put("/chapters/:chapterId", async (req, res, next) => {
  try {
    const user = req.user as AuthUser;
    const chapterId = req.params.chapterId;
    const updated = await workspaceService.updateChapterContent(chapterId, user.userId, req.body);
    res.json(updated);
  } catch (error: any) {
    if (error.message === "Chapter not found") {
      res.status(404).json({ message: "Chapter not found" });
    } else {
      next(error);
    }
  }
});
