import { pgTable, uuid, text, timestamp, boolean, integer, pgEnum } from "drizzle-orm/pg-core";
import { sectionsTable } from "./sections";

export const lessonTypeEnum = pgEnum("lesson_type", ["video", "text", "quiz"]);

export const lessonsTable = pgTable("lessons", {
  id: uuid("id").primaryKey().defaultRandom(),
  sectionId: uuid("section_id")
    .references(() => sectionsTable.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  type: lessonTypeEnum("type").notNull().default("video"),
  content: text("content"), // Markdown or HTML for text lessons
  order: integer("order").notNull().default(0),
  
  // Media changes for Phase F Strategy:
  youtubeVideoId: text("youtube_video_id"),
  duration: integer("duration").default(0), // In seconds
  
  isFreePreview: boolean("is_free_preview").notNull().default(false),
  isPublished: boolean("is_published").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
