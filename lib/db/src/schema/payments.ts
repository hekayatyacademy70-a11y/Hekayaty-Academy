import { pgTable, text, uuid, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { coursesTable } from "./courses";

/**
 * purchase_requests - Central table for the InstaPay workflow.
 * One record per student-course purchase attempt.
 * Status flow: pending_payment → pending_verification → completed | rejected
 */
export const purchaseRequestsTable = pgTable("purchase_requests", {
  id: uuid("id").primaryKey().defaultRandom(),

  studentId: uuid("student_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),

  courseId: uuid("course_id")
    .references(() => coursesTable.id, { onDelete: "cascade" })
    .notNull(),

  amountPaid: integer("amount_paid").notNull(), // in smallest currency unit (piastres)
  currency: text("currency").notNull().default("EGP"),

  // Workflow status
  status: text("status", {
    enum: ["pending_payment", "pending_verification", "completed", "rejected", "cancelled"],
  })
    .notNull()
    .default("pending_payment"),

  // Payment method - extensible for future gateways
  paymentMethod: text("payment_method", {
    enum: ["instapay", "paymob", "fawry", "stripe", "manual"],
  })
    .notNull()
    .default("instapay"),

  // InstaPay submission fields (set when student submits proof)
  instapayTransactionId: text("instapay_transaction_id"),
  receiptImageUrl: text("receipt_image_url"), // Cloudinary URL
  receiptImagePublicId: text("receipt_image_public_id"), // Cloudinary public_id

  // Verification fields (set when instructor/admin acts)
  reviewedBy: uuid("reviewed_by").references(() => usersTable.id),
  reviewedAt: timestamp("reviewed_at"),
  rejectionReason: text("rejection_reason"),

  // Timestamps
  submittedAt: timestamp("submitted_at"), // when student submits proof
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * instructor_wallets - Tracks per-instructor earnings.
 */
export const instructorWalletsTable = pgTable("instructor_wallets", {
  id: uuid("id").primaryKey().defaultRandom(),
  instructorId: uuid("instructor_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  availableBalance: integer("available_balance").notNull().default(0), // in piastres
  lifetimeEarnings: integer("lifetime_earnings").notNull().default(0),
  pendingBalance: integer("pending_balance").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * wallet_transactions - Immutable ledger of all wallet movements.
 */
export const walletTransactionsTable = pgTable("wallet_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  walletId: uuid("wallet_id")
    .references(() => instructorWalletsTable.id, { onDelete: "cascade" })
    .notNull(),
  purchaseRequestId: uuid("purchase_request_id").references(() => purchaseRequestsTable.id, { onDelete: "set null" }),
  type: text("type", { enum: ["credit", "debit", "payout"] }).notNull(),
  amount: integer("amount").notNull(), // in piastres
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
