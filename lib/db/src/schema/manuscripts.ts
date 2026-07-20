import { pgTable, text, uuid, timestamp, integer, boolean, pgEnum } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const manuscriptStatusEnum = pgEnum("manuscript_status", [
  "draft",
  "writing",
  "editing",
  "published",
  "archived",
]);

export const manuscriptGenreEnum = pgEnum("manuscript_genre", [
  "novel",
  "short_story",
  "screenplay",
  "poetry",
  "non_fiction",
  "children",
  "other",
]);

export const manuscriptsTable = pgTable("manuscripts", {
  id: uuid("id").primaryKey().defaultRandom(),
  authorId: uuid("author_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  synopsis: text("synopsis"),
  genre: manuscriptGenreEnum("genre").notNull().default("novel"),
  status: manuscriptStatusEnum("status").notNull().default("draft"),
  targetWordCount: integer("target_word_count").default(80000),
  isPublic: boolean("is_public").notNull().default(false),
  coverImageUrl: text("cover_image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type InsertManuscript = typeof manuscriptsTable.$inferInsert;
export type Manuscript = typeof manuscriptsTable.$inferSelect;
