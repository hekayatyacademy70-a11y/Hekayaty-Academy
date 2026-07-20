import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { lessonsTable } from "./lessons";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const lessonCompletionsTable = pgTable("lesson_completions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  lessonId: uuid("lesson_id").notNull().references(() => lessonsTable.id, { onDelete: "cascade" }),
  completedAt: timestamp("completed_at").notNull().defaultNow(),
});

export type InsertLessonCompletion = typeof lessonCompletionsTable.$inferInsert;
export type LessonCompletion = typeof lessonCompletionsTable.$inferSelect;
