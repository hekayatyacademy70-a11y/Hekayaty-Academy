import { pgTable, text, uuid, timestamp, integer, boolean, pgEnum } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const postStatusEnum = pgEnum("post_status", ["published", "draft", "removed"]);

export const postsTable = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  authorId: uuid("author_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  title: text("title"),
  content: text("content").notNull(),
  status: postStatusEnum("status").notNull().default("published"),
  likesCount: integer("likes_count").notNull().default(0),
  commentsCount: integer("comments_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type InsertPost = typeof postsTable.$inferInsert;
export type Post = typeof postsTable.$inferSelect;
