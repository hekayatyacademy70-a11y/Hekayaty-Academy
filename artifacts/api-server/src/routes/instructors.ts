import { Router } from "express";
import { supabase } from "../lib/supabase";
import { cacheMiddleware } from "../lib/cache";
import { authenticate, requireInstructor, AuthUser } from "../middlewares/authenticate";
import { ArticlesService } from "../services/articles.service";

const instructorsRouter = Router();
const articlesService = new ArticlesService();

// GET /api/instructors?limit=8&offset=0
instructorsRouter.get("/", cacheMiddleware(5), async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 8, 50);
    const offset = Number(req.query.offset) || 0;

    const { data: users, error } = await supabase
      .from("users")
      .select("id, name, avatar_url, role")
      .eq("role", "instructor")
      .range(offset, offset + limit - 1);

    if (error) throw error;
    
    // We fetch the number of courses per instructor to map to the API response
    const enriched = await Promise.all(
      (users || []).map(async (user) => {
        // get courses count
        const { count: coursesCount } = await supabase
          .from("courses")
          .select("*", { count: "exact", head: true })
          .eq("instructor_id", user.id);
          
        return {
          id: user.id,
          name: user.name,
          avatar: user.avatar_url,
          specialty: "مدرب معتمد",
          rating: 4.8,
          students: (coursesCount || 0) * 120,
          courses: coursesCount || 0,
          bio: "مدرب معتمد في الأكاديمية"
        };
      })
    );

    res.json(enriched);
  } catch (error) {
    next(error);
  }
});

// ─────────────────────────────────────────────
// INSTRUCTOR ARTICLES
// ─────────────────────────────────────────────

/** GET /api/instructors/me/articles */
instructorsRouter.get("/me/articles", authenticate, requireInstructor, async (req, res, next) => {
  try {
    const user = req.user as AuthUser;
    const articles = await articlesService.getInstructorArticles(user.userId);
    res.json(articles);
  } catch (error) {
    next(error);
  }
});

/** POST /api/instructors/me/articles */
instructorsRouter.post("/me/articles", authenticate, requireInstructor, async (req, res, next) => {
  try {
    const user = req.user as AuthUser;
    const article = await articlesService.createArticle({
      ...req.body,
      author_id: user.userId,
      author_type: "instructor",
      status: "draft" // instructors can only create drafts initially
    });
    res.status(201).json(article);
  } catch (error) {
    next(error);
  }
});

/** GET /api/instructors/me/articles/:id */
instructorsRouter.get("/me/articles/:id", authenticate, requireInstructor, async (req, res, next) => {
  try {
    const user = req.user as AuthUser;
    const article = await articlesService.getArticleById(req.params.id as string);
    if (!article || article.author_id !== user.userId) {
      res.status(403).json({ error: "Forbidden or not found" });
      return;
    }
    res.json(article);
  } catch (error) {
    next(error);
  }
});

/** PUT /api/instructors/me/articles/:id */
instructorsRouter.put("/me/articles/:id", authenticate, requireInstructor, async (req, res, next) => {
  try {
    const user = req.user as AuthUser;
    
    // prevent changing status directly via generic update
    const updateData = { ...req.body };
    delete updateData.status;

    const article = await articlesService.updateArticle(req.params.id as string, user.userId, user.role, updateData);
    res.json(article);
  } catch (error) {
    next(error);
  }
});

/** PUT /api/instructors/me/articles/:id/submit */
instructorsRouter.put("/me/articles/:id/submit", authenticate, requireInstructor, async (req, res, next) => {
  try {
    const user = req.user as AuthUser;
    // We must verify ownership first before updating status
    const articleInfo = await articlesService.getInstructorArticles(user.userId);
    const ownsArticle = articleInfo.some((a: any) => a.id === req.params.id);
    
    if (!ownsArticle) {
      res.status(403).json({ error: "Forbidden or not found" });
      return;
    }

    const article = await articlesService.updateArticleStatus(req.params.id as string, "pending_review");
    res.json(article);
  } catch (error) {
    next(error);
  }
});

export default instructorsRouter;

