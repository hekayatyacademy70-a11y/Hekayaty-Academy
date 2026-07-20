import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const reportsTable = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  reporterId: uuid("reporter_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  reportedId: uuid("reported_id") // ID of the user or post being reported
    .notNull(),
  reportType: text("report_type", { enum: ["user", "post", "comment"] }).notNull(),
  reason: text("reason").notNull(),
  details: text("details"),
  status: text("status", { enum: ["pending", "reviewed", "resolved", "dismissed"] }).notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
