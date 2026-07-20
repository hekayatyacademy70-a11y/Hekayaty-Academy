import { Router } from "express";
import { CoursesService } from "../services/courses.service";
import { authenticate, AuthUser } from "../middlewares/authenticate";
import { zodSchemas } from "@workspace/api-zod";

const router = Router();
const coursesService = new CoursesService();

router.post("/", authenticate, async (req, res, next) => {
  try {
    const user = req.user as AuthUser;
    const body = zodSchemas.EnrollInCourseBody.parse(req.body);
    const result = await coursesService.enrollInCourse(user.userId, body.courseId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
