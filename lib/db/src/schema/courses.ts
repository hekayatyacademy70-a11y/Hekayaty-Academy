import { pgTable, text, uuid, timestamp, integer, boolean, pgEnum } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const courseStatusEnum = pgEnum("course_status", ["draft", "pending_review", "published", "rejected", "archived"]);
export const courseLevelEnum = pgEnum("course_level", ["beginner", "intermediate", "advanced", "all"]);

export const coursesTable = pgTable("courses", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url"),
  instructorId: uuid("instructor_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  price: integer("price").notNull().default(0), // stored in cents or smallest currency unit
  status: courseStatusEnum("status").notNull().default("draft"),
  level: courseLevelEnum("level").notNull().default("beginner"),
  isPremium: boolean("is_premium").notNull().default(false),
  category: text("category"),
  whatsappLink: text("whatsapp_link"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type InsertCourse = typeof coursesTable.$inferInsert;
export type Course = typeof coursesTable.$inferSelect;
