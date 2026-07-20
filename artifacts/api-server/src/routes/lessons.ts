import { Router } from "express";
import { CoursesService } from "../services/courses.service";
import { authenticate, AuthUser } from "../middlewares/authenticate";

const router = Router();
const coursesService = new CoursesService();

router.post("/:lessonId/complete", authenticate, async (req, res, next) => {
  try {
    const user = req.user as AuthUser;
    const result = await coursesService.completeLesson(user.userId, req.params.lessonId as string);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
