import { Router } from "express";
import { authenticate, requireAdmin } from "../middlewares/authenticate";
import { AuthUser } from "../middlewares/authenticate";
import { PaymentsService } from "../services/payments.service";

export const paymentsRouter = Router();
const paymentsService = new PaymentsService();

// All payment routes require authentication
paymentsRouter.use(authenticate);

// ─────────────────────────────────────────────
// STUDENT: INITIATE PURCHASE
// POST /api/payments/initiate
// ─────────────────────────────────────────────
paymentsRouter.post("/initiate", async (req, res, next) => {
  try {
    const user = req.user as AuthUser;
    const { courseId } = req.body;
    if (!courseId) { res.status(400).json({ error: "courseId is required" }); return; }

    const result = await paymentsService.initiatePurchase(user.userId, courseId);
    res.json(result);
  } catch (error: any) {
    if (error.message === "ALREADY_ENROLLED") {
      res.status(409).json({ error: "You are already enrolled in this course" });
      return;
    }
    if (error.message === "COURSE_IS_FREE") {
      res.status(400).json({ error: "This course is free — use the enroll endpoint" });
      return;
    }
    next(error);
  }
});

// ─────────────────────────────────────────────
// STUDENT: SUBMIT PAYMENT PROOF
// POST /api/payments/:id/submit
// ─────────────────────────────────────────────
paymentsRouter.post("/:id/submit", async (req, res, next) => {
  try {
    const user = req.user as AuthUser;
    const { transactionId, receiptImageUrl, receiptImagePublicId } = req.body;

    if (!transactionId || !receiptImageUrl) {
      res.status(400).json({ error: "transactionId and receiptImageUrl are required" });
      return;
    }

    const result = await paymentsService.submitPaymentProof(
      req.params.id,
      user.userId,
      transactionId,
      receiptImageUrl,
      receiptImagePublicId ?? ""
    );
    res.json(result);
  } catch (error: any) {
    if (error.message === "NOT_FOUND") { res.status(404).json({ error: "Purchase request not found" }); return; }
    if (error.message === "INVALID_STATUS") { res.status(400).json({ error: "Cannot submit — invalid status" }); return; }
    next(error);
  }
});

// ─────────────────────────────────────────────
// STUDENT: MY PURCHASES
// GET /api/payments/my
// ─────────────────────────────────────────────
paymentsRouter.get("/my", async (req, res, next) => {
  try {
    const user = req.user as AuthUser;
    const purchases = await paymentsService.getMyPurchases(user.userId);
    res.json({ purchases });
  } catch (error) { next(error); }
});

// ─────────────────────────────────────────────
// STUDENT: CHECK COURSE ACCESS
// GET /api/payments/access/:courseId
// ─────────────────────────────────────────────
paymentsRouter.get("/access/:courseId", async (req, res, next) => {
  try {
    const user = req.user as AuthUser;
    const result = await paymentsService.checkCourseAccess(user.userId, req.params.courseId);
    res.json(result);
  } catch (error) { next(error); }
});

// ─────────────────────────────────────────────
// INSTRUCTOR: PAYMENT REQUESTS
// GET /api/payments/instructor/requests
// ─────────────────────────────────────────────
paymentsRouter.get("/instructor/requests", async (req, res, next) => {
  try {
    const user = req.user as AuthUser;
    const requests = await paymentsService.getInstructorPaymentRequests(user.userId);
    res.json({ requests });
  } catch (error) { next(error); }
});

// ─────────────────────────────────────────────
// INSTRUCTOR: APPROVE PAYMENT
// PUT /api/payments/:id/approve
// ─────────────────────────────────────────────
paymentsRouter.put("/:id/approve", async (req, res, next) => {
  try {
    const user = req.user as AuthUser;
    const isAdmin = user.role === "admin" || user.role === "superadmin";
    const result = await paymentsService.approvePayment(req.params.id, user.userId, isAdmin);
    res.json(result);
  } catch (error: any) {
    if (error.message === "NOT_FOUND") { res.status(404).json({ error: "Purchase request not found" }); return; }
    if (error.message === "FORBIDDEN") { res.status(403).json({ error: "Only the course instructor can approve payments" }); return; }
    if (error.message === "INVALID_STATUS") { res.status(400).json({ error: "Request is not pending verification" }); return; }
    next(error);
  }
});

// ─────────────────────────────────────────────
// INSTRUCTOR: REJECT PAYMENT
// PUT /api/payments/:id/reject
// ─────────────────────────────────────────────
paymentsRouter.put("/:id/reject", async (req, res, next) => {
  try {
    const user = req.user as AuthUser;
    const { reason } = req.body;
    const isAdmin = user.role === "admin" || user.role === "superadmin";
    const result = await paymentsService.rejectPayment(
      req.params.id, user.userId, reason ?? "لم يتم التحقق من الدفعة", isAdmin
    );
    res.json(result);
  } catch (error: any) {
    if (error.message === "NOT_FOUND") { res.status(404).json({ error: "Purchase request not found" }); return; }
    if (error.message === "FORBIDDEN") { res.status(403).json({ error: "Only the course instructor can reject payments" }); return; }
    if (error.message === "INVALID_STATUS") { res.status(400).json({ error: "Request is not pending verification" }); return; }
    next(error);
  }
});

// ─────────────────────────────────────────────
// INSTRUCTOR: WALLET
// GET /api/payments/wallet
// ─────────────────────────────────────────────
paymentsRouter.get("/wallet", async (req, res, next) => {
  try {
    const user = req.user as AuthUser;
    const wallet = await paymentsService.getInstructorWallet(user.userId);
    res.json(wallet);
  } catch (error) { next(error); }
});
