import { pgTable, text, uuid, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { manuscriptsTable } from "./manuscripts";

export const chaptersTable = pgTable("chapters", {
  id: uuid("id").primaryKey().defaultRandom(),
  manuscriptId: uuid("manuscript_id")
    .notNull()
    .references(() => manuscriptsTable.id, { onDelete: "cascade" }),
  title: text("title").notNull().default("فصل بلا عنوان"),
  content: text("content").notNull().default(""),
  wordCount: integer("word_count").notNull().default(0),
  order: integer("order").notNull().default(1),
  isLocked: boolean("is_locked").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type InsertChapter = typeof chaptersTable.$inferInsert;
export type Chapter = typeof chaptersTable.$inferSelect;
