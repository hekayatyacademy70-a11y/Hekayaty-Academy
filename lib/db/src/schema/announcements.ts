import { pgTable, uuid, text, timestamp, pgEnum, integer } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { coursesTable } from "./courses";

export const announcementPriorityEnum = pgEnum("announcement_priority", ["normal", "important", "urgent"]);
export const announcementStatusEnum = pgEnum("announcement_status", ["published", "draft"]);

export const announcementsTable = pgTable("announcements", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseId: uuid("course_id").notNull().references(() => coursesTable.id, { onDelete: "cascade" }),
  instructorId: uuid("instructor_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  priority: announcementPriorityEnum("priority").notNull().default("normal"),
  status: announcementStatusEnum("status").notNull().default("published"),
  readCount: integer("read_count").notNull().default(0),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
});

export type InsertAnnouncement = typeof announcementsTable.$inferInsert;
export type Announcement = typeof announcementsTable.$inferSelect;
