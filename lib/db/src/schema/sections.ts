import { pgTable, text, uuid, timestamp, integer } from "drizzle-orm/pg-core";
import { coursesTable } from "./courses";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const sectionsTable = pgTable("sections", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseId: uuid("course_id").notNull().references(() => coursesTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type InsertSection = typeof sectionsTable.$inferInsert;
export type Section = typeof sectionsTable.$inferSelect;
