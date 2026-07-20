import { pgTable, text, uuid, timestamp, integer, boolean, pgEnum } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { articleCategoriesTable } from "./article_categories";

export const articleStatusEnum = pgEnum("article_status", ["draft", "pending_review", "approved", "published", "archived"]);
export const authorTypeEnum = pgEnum("author_type", ["admin", "instructor"]);

export const articlesTable = pgTable("articles", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(), // Markdown or HTML
  coverImage: text("cover_image"),
  authorId: uuid("author_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  authorType: authorTypeEnum("author_type").notNull().default("instructor"),
  categoryId: uuid("category_id").references(() => articleCategoriesTable.id, { onDelete: "set null" }),
  status: articleStatusEnum("status").notNull().default("draft"),
  featured: boolean("featured").notNull().default(false),
  views: integer("views").notNull().default(0),
  readingTime: integer("reading_time").notNull().default(0), // in minutes
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  publishedAt: timestamp("published_at"),
});

export type InsertArticle = typeof articlesTable.$inferInsert;
export type Article = typeof articlesTable.$inferSelect;
