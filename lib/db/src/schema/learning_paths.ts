import { pgTable, uuid, text, integer, timestamp, boolean, primaryKey, pgEnum } from 'drizzle-orm/pg-core';
import { usersTable } from './users';
import { coursesTable } from './courses';

// Enums
export const skillLevelEnum = pgEnum('skill_level', ['beginner', 'intermediate', 'advanced', 'kids']);
export const pathStatusEnum = pgEnum('path_status', ['draft', 'published', 'archived']);
export const pathEnrollmentStatusEnum = pgEnum('path_enrollment_status', ['active', 'completed']);

// Learning Paths
export const learningPaths = pgTable('learning_paths', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  shortDescription: text('short_description'),
  fullDescription: text('full_description'),
  thumbnailUrl: text('thumbnail_url'),
  bannerUrl: text('banner_url'),
  skillLevel: skillLevelEnum('skill_level').default('beginner'),
  totalHours: integer('total_hours').default(0),
  regularPrice: integer('regular_price').default(0),
  discountPrice: integer('discount_price'),
  status: pathStatusEnum('status').default('draft'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Learning Path Courses (Join table with ordering and revenue weights)
export const learningPathCourses = pgTable('learning_path_courses', {
  id: uuid('id').primaryKey().defaultRandom(),
  pathId: uuid('path_id').notNull().references(() => learningPaths.id, { onDelete: 'cascade' }),
  courseId: uuid('course_id').notNull().references(() => coursesTable.id, { onDelete: 'cascade' }),
  orderIndex: integer('order_index').notNull().default(0),
  revenueWeight: integer('revenue_weight').notNull().default(0), // percentage 1-100
  requirePrevious: boolean('require_previous').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Learning Path Enrollments
export const learningPathEnrollments = pgTable('learning_path_enrollments', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  pathId: uuid('path_id').notNull().references(() => learningPaths.id, { onDelete: 'cascade' }),
  progressPercent: integer('progress_percent').notNull().default(0),
  status: pathEnrollmentStatusEnum('status').default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Learning Path Certificates
export const learningPathCertificates = pgTable('learning_path_certificates', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  pathId: uuid('path_id').notNull().references(() => learningPaths.id, { onDelete: 'cascade' }),
  verificationCode: text('verification_code').notNull().unique(),
  issuedAt: timestamp('issued_at', { withTimezone: true }).defaultNow().notNull(),
});
