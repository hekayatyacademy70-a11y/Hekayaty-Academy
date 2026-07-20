import { Router } from "express";
import { CoursesService } from "../services/courses.service";
import { authenticate, AuthUser } from "../middlewares/authenticate";
import { cacheMiddleware } from "../lib/cache";

const router = Router();
const coursesService = new CoursesService();

/**
 * GET /api/courses
 * List all published courses
 */
router.get("/", cacheMiddleware(5), async (req, res, next) => {
  try {
    const courses = await coursesService.getCourses();
    res.json(courses);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/courses
 * Create a new course (instructor only)
 * Body: { title, description, thumbnailUrl, price, level, category, lessons }
 */
router.post("/", authenticate, async (req, res, next) => {
  try {
    const user = req.user as AuthUser;
    const { title, description, thumbnailUrl, price, level, category, lessons } = req.body;

    if (!title) {
      res.status(400).json({ error: "عنوان الدورة مطلوب" });
      return;
    }

    // 1. Create the course
    const course = await coursesService.createCourse(user.userId, {
      title,
      description,
      thumbnailUrl,
      price: price ? parseFloat(price) : 0,
      level: level || "beginner",
      category,
    });

    // 2. If lessons array provided, create a single default section + all lessons
    if (lessons && Array.isArray(lessons) && lessons.length > 0) {
      await coursesService.createSectionWithLessons(course.id, lessons);
    }

    res.status(201).json({ success: true, course });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/courses/:id
 * Get details for a specific course
 */
router.get("/:id", cacheMiddleware(5), async (req, res, next) => {
  try {
    const course = await coursesService.getCourseById(req.params.id as string);
    res.json(course);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/courses/:id/lessons/:lessonId
 * Get a specific lesson (auth required)
 */
router.get("/:id/lessons/:lessonId", authenticate, async (req, res, next) => {
  try {
    const lesson = await coursesService.getLessonById(req.params.lessonId as string);
    res.json(lesson);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/courses/:id
 * Delete a course (instructor owner only)
 */
router.delete("/:id", authenticate, async (req, res, next) => {
  try {
    const user = req.user as AuthUser;
    await coursesService.deleteCourse(req.params.id as string, user.userId);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
