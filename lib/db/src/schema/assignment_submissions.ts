import { pgTable, uuid, text, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { assignmentsTable } from "./assignments";

export const submissionStatusEnum = pgEnum("submission_status", ["pending", "graded"]);

export const assignmentSubmissionsTable = pgTable("assignment_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  assignmentId: uuid("assignment_id").notNull().references(() => assignmentsTable.id, { onDelete: "cascade" }),
  studentId: uuid("student_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  content: text("content"),
  attachmentUrl: text("attachment_url"),
  score: integer("score"),
  status: submissionStatusEnum("status").notNull().default("pending"),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
  gradedAt: timestamp("graded_at"),
});

export type InsertAssignmentSubmission = typeof assignmentSubmissionsTable.$inferInsert;
export type AssignmentSubmission = typeof assignmentSubmissionsTable.$inferSelect;
