import { pgTable, uuid, text, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { coursesTable } from "./courses";

export const assignmentStatusEnum = pgEnum("assignment_status", ["published", "draft"]);

export const assignmentsTable = pgTable("assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseId: uuid("course_id").notNull().references(() => coursesTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  maxScore: integer("max_score").notNull().default(100),
  dueDate: timestamp("due_date"),
  status: assignmentStatusEnum("status").notNull().default("draft"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type InsertAssignment = typeof assignmentsTable.$inferInsert;
export type Assignment = typeof assignmentsTable.$inferSelect;
