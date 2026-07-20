import { supabase } from "../lib/supabase";

const PLATFORM_SHARE = 0.50;
const INSTRUCTOR_SHARE = 0.50;

export class PaymentsService {
  /**
   * Student: Initiate Purchase
   */
  async initiatePurchase(studentId: string, courseId: string) {
    // Check for existing active request
    const { data: existing } = await supabase
      .from("purchase_requests")
      .select("id, status")
      .eq("student_id", studentId)
      .eq("course_id", courseId)
      .not("status", "in", '("rejected","cancelled")')
      .limit(1);

    if (existing && existing.length > 0) {
      return { purchaseRequestId: existing[0].id, status: existing[0].status, isExisting: true };
    }

    // Check already enrolled
    const { data: enrolled } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", studentId)
      .eq("course_id", courseId)
      .limit(1);

    if (enrolled && enrolled.length > 0) throw new Error("ALREADY_ENROLLED");

    // Get course price
    const { data: course } = await supabase
      .from("courses")
      .select("price, instructor_id")
      .eq("id", courseId)
      .single();

    if (!course) throw new Error("COURSE_NOT_FOUND");
    if (course.price === 0) throw new Error("COURSE_IS_FREE");

    // Create purchase request
    const { data: req, error } = await supabase
      .from("purchase_requests")
      .insert({
        student_id: studentId,
        course_id: courseId,
        amount_paid: course.price,
        status: "pending_payment",
        payment_method: "instapay",
      })
      .select("id, status")
      .single();

    if (error || !req) throw new Error(`Failed to create purchase request: ${error?.message}`);
    return { purchaseRequestId: req.id, status: req.status, isExisting: false };
  }

  /**
   * Student: Submit payment proof
   */
  async submitPaymentProof(
    purchaseRequestId: string,
    studentId: string,
    transactionId: string,
    receiptImageUrl: string,
    receiptImagePublicId: string
  ) {
    const { data: req } = await supabase
      .from("purchase_requests")
      .select("status")
      .eq("id", purchaseRequestId)
      .eq("student_id", studentId)
      .single();

    if (!req) throw new Error("NOT_FOUND");
    if (req.status !== "pending_payment") throw new Error("INVALID_STATUS");

    const { error } = await supabase
      .from("purchase_requests")
      .update({
        instapay_transaction_id: transactionId,
        receipt_image_url: receiptImageUrl,
        receipt_image_public_id: receiptImagePublicId,
        status: "pending_verification",
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", purchaseRequestId);

    if (error) throw new Error(`Failed to submit proof: ${error.message}`);
    return { success: true, status: "pending_verification" };
  }

  /**
   * Student: My purchases
   */
  async getMyPurchases(studentId: string) {
    const { data, error } = await supabase
      .from("purchase_requests")
      .select(`
        id, status, amount_paid, payment_method,
        instapay_transaction_id, receipt_image_url, rejection_reason,
        submitted_at, created_at,
        courses (id, title, thumbnail_url, price)
      `)
      .eq("student_id", studentId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(`Failed to get purchases: ${error.message}`);

    return (data || []).map((r: any) => ({
      id: r.id,
      status: r.status,
      amountPaid: r.amount_paid,
      paymentMethod: r.payment_method,
      instapayTransactionId: r.instapay_transaction_id,
      receiptImageUrl: r.receipt_image_url,
      rejectionReason: r.rejection_reason,
      submittedAt: r.submitted_at,
      createdAt: r.created_at,
      course: {
        id: r.courses?.id,
        title: r.courses?.title,
        thumbnailUrl: r.courses?.thumbnail_url,
        price: r.courses?.price,
      },
    }));
  }

  /**
   * Instructor: Get payment requests for their courses
   */
  async getInstructorPaymentRequests(instructorId: string) {
    // Get instructor's course IDs
    const { data: courses } = await supabase
      .from("courses")
      .select("id")
      .eq("instructor_id", instructorId);

    const courseIds = (courses || []).map((c: any) => c.id);
    if (courseIds.length === 0) return [];

    const { data, error } = await supabase
      .from("purchase_requests")
      .select(`
        id, status, amount_paid,
        instapay_transaction_id, receipt_image_url,
        submitted_at, created_at,
        courses (id, title),
        users!purchase_requests_student_id_fkey (id, name, email)
      `)
      .in("course_id", courseIds)
      .eq("status", "pending_verification")
      .order("submitted_at", { ascending: true });

    if (error) throw new Error(`Failed to get payment requests: ${error.message}`);

    return (data || []).map((r: any) => ({
      id: r.id,
      status: r.status,
      amountPaid: r.amount_paid,
      instapayTransactionId: r.instapay_transaction_id,
      receiptImageUrl: r.receipt_image_url,
      submittedAt: r.submitted_at,
      createdAt: r.created_at,
      course: { id: r.courses?.id, title: r.courses?.title },
      student: {
        id: r.users?.id,
        name: r.users?.name,
        email: r.users?.email,
      },
    }));
  }

  /**
   * Instructor/Admin: Approve payment
   */
  async approvePayment(purchaseRequestId: string, reviewerId: string, isAdmin = false) {
    const { data: req } = await supabase
      .from("purchase_requests")
      .select(`
        id, student_id, course_id, amount_paid, status,
        courses (instructor_id)
      `)
      .eq("id", purchaseRequestId)
      .single();

    if (!req) throw new Error("NOT_FOUND");
    if (req.status !== "pending_verification") throw new Error("INVALID_STATUS");

    const instructorId = (req.courses as any)?.instructor_id;
    if (!isAdmin && instructorId !== reviewerId) throw new Error("FORBIDDEN");

    // 1. Mark completed
    await supabase
      .from("purchase_requests")
      .update({
        status: "completed",
        reviewed_by: reviewerId,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", purchaseRequestId);

    // 2. Create enrollment if it doesn't exist
    const { data: existingEnrollment } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", req.student_id)
      .eq("course_id", req.course_id)
      .single();

    if (!existingEnrollment) {
      const { error: enrollErr } = await supabase.from("enrollments").insert({
        user_id: req.student_id,
        course_id: req.course_id,
        status: "active",
      });
      if (enrollErr) throw new Error(`Failed to create enrollment: ${enrollErr.message}`);
    }

    // 3. Update instructor wallet (70%)
    const instructorEarning = Math.floor(req.amount_paid * INSTRUCTOR_SHARE);

    const { data: existingWallet } = await supabase
      .from("instructor_wallets")
      .select("id, available_balance, lifetime_earnings")
      .eq("instructor_id", instructorId)
      .single();

    let walletId: string;
    if (existingWallet) {
      await supabase
        .from("instructor_wallets")
        .update({
          available_balance: existingWallet.available_balance + instructorEarning,
          lifetime_earnings: existingWallet.lifetime_earnings + instructorEarning,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingWallet.id);
      walletId = existingWallet.id;
    } else {
      const { data: newWallet } = await supabase
        .from("instructor_wallets")
        .insert({
          instructor_id: instructorId,
          available_balance: instructorEarning,
          lifetime_earnings: instructorEarning,
          pending_balance: 0,
        })
        .select("id")
        .single();
      walletId = newWallet?.id;
    }

    // 4. Log wallet transaction
    if (walletId) {
      await supabase.from("wallet_transactions").insert({
        wallet_id: walletId,
        purchase_request_id: purchaseRequestId,
        type: "credit",
        amount: instructorEarning,
        description: "InstaPay payment approved",
      });
    }

    return { success: true, enrollmentCreated: true };
  }

  /**
   * Instructor/Admin: Reject payment
   */
  async rejectPayment(purchaseRequestId: string, reviewerId: string, reason: string, isAdmin = false) {
    const { data: req } = await supabase
      .from("purchase_requests")
      .select(`status, courses (instructor_id)`)
      .eq("id", purchaseRequestId)
      .single();

    if (!req) throw new Error("NOT_FOUND");
    if (req.status !== "pending_verification") throw new Error("INVALID_STATUS");

    const instructorId = (req.courses as any)?.instructor_id;
    if (!isAdmin && instructorId !== reviewerId) throw new Error("FORBIDDEN");

    await supabase
      .from("purchase_requests")
      .update({
        status: "rejected",
        reviewed_by: reviewerId,
        reviewed_at: new Date().toISOString(),
        rejection_reason: reason,
        updated_at: new Date().toISOString(),
      })
      .eq("id", purchaseRequestId);

    return { success: true };
  }

  /**
   * Instructor: Wallet balance
   */
  async getInstructorWallet(instructorId: string) {
    const { data: wallet } = await supabase
      .from("instructor_wallets")
      .select("*")
      .eq("instructor_id", instructorId)
      .single();

    let transactions: any[] = [];
    if (wallet?.id) {
      const { data: txData } = await supabase
        .from("wallet_transactions")
        .select("id, type, amount, description, created_at")
        .eq("wallet_id", wallet.id)
        .order("created_at", { ascending: false })
        .limit(20);
      transactions = txData || [];
    }

    return {
      availableBalance: wallet?.available_balance ?? 0,
      lifetimeEarnings: wallet?.lifetime_earnings ?? 0,
      pendingBalance: wallet?.pending_balance ?? 0,
      transactions,
    };
  }

  /**
   * Check if student has access to course
   */
  async checkCourseAccess(studentId: string, courseId: string) {
    const { data: course } = await supabase
      .from("courses")
      .select("price")
      .eq("id", courseId)
      .single();

    if (!course) return { hasAccess: false, isFree: false, purchaseStatus: null };
    if (course.price === 0) return { hasAccess: true, isFree: true, purchaseStatus: null };

    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", studentId)
      .eq("course_id", courseId)
      .limit(1);

    if (enrollment && enrollment.length > 0) {
      return { hasAccess: true, isFree: false, purchaseStatus: "completed" };
    }

    const { data: purchase } = await supabase
      .from("purchase_requests")
      .select("status")
      .eq("student_id", studentId)
      .eq("course_id", courseId)
      .not("status", "in", '("rejected","cancelled")')
      .order("created_at", { ascending: false })
      .limit(1);

    return {
      hasAccess: false,
      isFree: false,
      purchaseStatus: purchase?.[0]?.status ?? null,
    };
  }
}
