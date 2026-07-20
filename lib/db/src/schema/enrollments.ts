import { pgTable, uuid, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { coursesTable } from "./courses";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const enrollmentStatusEnum = pgEnum("enrollment_status", ["active", "completed", "cancelled"]);

export const enrollmentsTable = pgTable("enrollments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  courseId: uuid("course_id").notNull().references(() => coursesTable.id, { onDelete: "cascade" }),
  status: enrollmentStatusEnum("status").notNull().default("active"),
  enrolledAt: timestamp("enrolled_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

export type InsertEnrollment = typeof enrollmentsTable.$inferInsert;
export type Enrollment = typeof enrollmentsTable.$inferSelect;
