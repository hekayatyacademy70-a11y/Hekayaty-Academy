import { pgTable, text, uuid, timestamp, integer, boolean, pgEnum } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const competitionStatusEnum = pgEnum("competition_status", [
  "upcoming",
  "active",
  "judging",
  "completed",
]);

export const competitionsTable = pgTable("competitions", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  rules: text("rules"),
  prize: text("prize"),
  status: competitionStatusEnum("status").notNull().default("upcoming"),
  submissionsCount: integer("submissions_count").notNull().default(0),
  maxParticipants: integer("max_participants"),
  startsAt: timestamp("starts_at").notNull(),
  endsAt: timestamp("ends_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const competitionSubmissionsTable = pgTable("competition_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  competitionId: uuid("competition_id")
    .notNull()
    .references(() => competitionsTable.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  assetUrl: text("asset_url"),
  score: integer("score"),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
});

export type InsertCompetition = typeof competitionsTable.$inferInsert;
export type Competition = typeof competitionsTable.$inferSelect;
export type InsertCompetitionSubmission = typeof competitionSubmissionsTable.$inferInsert;
export type CompetitionSubmission = typeof competitionSubmissionsTable.$inferSelect;
