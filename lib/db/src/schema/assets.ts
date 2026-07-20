import { pgTable, text, timestamp, integer, uuid } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const assetsTable = pgTable("assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  uploaderId: uuid("uploader_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  
  assetCategory: text("asset_category", { enum: ["video", "thumbnail", "avatar", "manuscript", "submission", "document", "misc"] }).notNull(),
  
  fileName: text("file_name").notNull(),
  mimeType: text("mime_type").notNull(),
  fileSizeBytes: integer("file_size_bytes").notNull(),
  
  provider: text("provider", { enum: ["cloudinary", "youtube", "r2", "local"] }).notNull().default("cloudinary"),
  providerId: text("provider_id").notNull().unique(),
  providerUrl: text("provider_url").notNull(),
  
  visibility: text("visibility", { enum: ["public", "private"] }).notNull().default("public"),
  status: text("status", { enum: ["pending", "uploaded", "failed", "deleted"] }).notNull().default("uploaded"),
  
  usageReferenceId: uuid("usage_reference_id"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
