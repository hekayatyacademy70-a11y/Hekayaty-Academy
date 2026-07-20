import { Router } from "express";
import { authenticate, AuthUser } from "../middlewares/authenticate";
import { MeService } from "../services/me.service";
import { InstructorService } from "../services/instructor.service";
import { PathsService } from "../services/paths.service";

export const meRouter = Router();
const meService = new MeService();
const instructorService = new InstructorService();
const pathsService = new PathsService();

// All /me routes require authentication
meRouter.use(authenticate);

/**
 * GET /api/me/enrollments
 * Returns the current user's enrolled courses with progress
 */
meRouter.get("/enrollments", async (req, res, next) => {
  try {
    const user = req.user as AuthUser;
    const enrollments = await meService.getMyEnrollments(user.userId);
    res.json(enrollments);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/me/stats
 * Returns the current user's learning statistics
 */
meRouter.get("/stats", async (req, res, next) => {
  try {
    const user = req.user as AuthUser;
    const stats = await meService.getMyStats(user.userId);
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/me/assignments
 * Returns assignments for the student's enrolled courses
 */
meRouter.get("/assignments", async (req, res, next) => {
  try {
    const user = req.user as AuthUser;
    const assignments = await meService.getMyAssignments(user.userId);
    res.json(assignments);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/me/instructor-courses
 * Returns all courses created by the current instructor with enrollment/revenue stats
 */
meRouter.get("/instructor-courses", async (req, res, next) => {
  try {
    const user = req.user as AuthUser;
    const courses = await instructorService.getInstructorCourses(user.userId);
    res.json(courses);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/me/instructor-courses/:id
 * Delete a course owned by the current instructor
 */
meRouter.delete("/instructor-courses/:id", async (req, res, next) => {
  try {
    const user = req.user as AuthUser;
    const result = await instructorService.deleteCourse(req.params.id, user.userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/me/instructor-stats
 * Returns aggregate statistics for the current instructor
 */
meRouter.get("/instructor-stats", async (req, res, next) => {
  try {
    const user = req.user as AuthUser;
    const stats = await instructorService.getInstructorStats(user.userId);
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/me/instructor-students
 */
meRouter.get("/instructor-students", async (req, res, next) => {
  try {
    const user = req.user as AuthUser;
    const students = await instructorService.getInstructorStudents(user.userId);
    res.json(students);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/me/instructor-assignments
 */
meRouter.get("/instructor-assignments", async (req, res, next) => {
  try {
    const user = req.user as AuthUser;
    const assignments = await instructorService.getInstructorAssignments(user.userId);
    res.json(assignments);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/me/instructor-assignments
 */
meRouter.post("/instructor-assignments", async (req, res, next) => {
  try {
    const data = req.body;
    const assignment = await instructorService.createAssignment(data);
    res.json(assignment);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/me/instructor-certificates
 */
meRouter.get("/instructor-certificates", async (req, res, next) => {
  try {
    const user = req.user as AuthUser;
    const certificates = await instructorService.getInstructorCertificates(user.userId);
    res.json(certificates);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/me/instructor-announcements
 */
meRouter.get("/instructor-announcements", async (req, res, next) => {
  try {
    const user = req.user as AuthUser;
    const announcements = await instructorService.getInstructorAnnouncements(user.userId);
    res.json(announcements);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/me/instructor-announcements
 */
meRouter.post("/instructor-announcements", async (req, res, next) => {
  try {
    const user = req.user as AuthUser;
    const data = req.body;
    const announcement = await instructorService.createAnnouncement(data, user.userId);
    res.json(announcement);
  } catch (error) {
    next(error);
  }
});

// ─────────────────────────────────────────────
// LEARNING PATHS
// ─────────────────────────────────────────────

/**
 * GET /api/me/paths
 * Returns the student's enrolled learning paths
 */
meRouter.get("/paths", async (req, res, next) => {
  try {
    const user = req.user as AuthUser;
    const paths = await pathsService.getMyPaths(user.userId);
    res.json(paths);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/me/instructor-paths
 * Returns the instructor's participation in learning paths
 */
meRouter.get("/instructor-paths", async (req, res, next) => {
  try {
    const user = req.user as AuthUser;
    const paths = await pathsService.getInstructorPaths(user.userId);
    res.json(paths);
  } catch (error) {
    next(error);
  }
});
