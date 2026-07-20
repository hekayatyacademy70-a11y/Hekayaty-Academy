import { Router } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import coursesRouter from "./courses";
import enrollmentsRouter from "./enrollments";
import lessonsRouter from "./lessons";

import { assetsRouter } from "./assets";
import { meRouter } from "./me";
import { workspaceRouter } from "./workspace";
import { adminRouter } from "./admin";
import { paymentsRouter } from "./payments";
import instructorsRouter from "./instructors";
import { pathsRouter } from "./paths";
import { articlesRouter } from "./articles";

const router = Router();

router.use("/healthz", healthRouter);
router.use("/auth", authRouter);
router.use("/courses", coursesRouter);
router.use("/instructors", instructorsRouter);
router.use("/enrollments", enrollmentsRouter);
router.use("/lessons", lessonsRouter);
router.use("/assets", assetsRouter);
router.use("/me", meRouter);
router.use("/workspaces", workspaceRouter);
router.use("/admin", adminRouter);
router.use("/payments", paymentsRouter);
router.use("/paths", pathsRouter);
router.use("/articles", articlesRouter);

export default router;
