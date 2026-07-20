import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";

export const articleCategoriesTable = pgTable("article_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type InsertArticleCategory = typeof articleCategoriesTable.$inferInsert;
export type ArticleCategory = typeof articleCategoriesTable.$inferSelect;
