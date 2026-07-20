import { Router } from "express";
import { ArticlesService } from "../services/articles.service";
import { cacheMiddleware } from "../lib/cache";

export const articlesRouter = Router();
const articlesService = new ArticlesService();

/**
 * GET /api/articles/categories
 * Get all article categories
 */
articlesRouter.get("/categories", cacheMiddleware(10), async (req, res, next) => {
  try {
    const categories = await articlesService.getCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/articles
 * List published articles (paginated, searchable, filterable)
 */
articlesRouter.get("/", cacheMiddleware(5), async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 10, 50);
    const offset = Number(req.query.offset) || 0;
    const categorySlug = req.query.category as string;
    const search = req.query.search as string;

    const result = await articlesService.getPublishedArticles({ limit, offset, categorySlug, search });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/articles/:slug
 * Get a single published article by its slug
 */
articlesRouter.get("/:slug", cacheMiddleware(5), async (req, res, next) => {
  try {
    const slug = req.params.slug;
    if (!slug || typeof slug !== "string") {
      res.status(400).json({ error: "Invalid slug" });
      return;
    }
    const article = await articlesService.getArticleBySlug(slug);
    
    if (!article || article.status !== "published") {
      res.status(404).json({ error: "Article not found" });
      return;
    }

    res.json(article);
  } catch (error) {
    next(error);
  }
});
