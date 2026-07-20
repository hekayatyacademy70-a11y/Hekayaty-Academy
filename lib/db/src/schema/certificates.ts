import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { coursesTable } from "./courses";

export const certificatesTable = pgTable("certificates", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  courseId: uuid("course_id").notNull().references(() => coursesTable.id, { onDelete: "cascade" }),
  issuedById: uuid("issued_by_id").notNull().references(() => usersTable.id, { onDelete: "set null" }), // Instructor who issued it
  pdfUrl: text("pdf_url"),
  issuedAt: timestamp("issued_at").notNull().defaultNow(),
});

export type InsertCertificate = typeof certificatesTable.$inferInsert;
export type Certificate = typeof certificatesTable.$inferSelect;
