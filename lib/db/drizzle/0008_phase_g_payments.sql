-- Phase G: InstaPay Payment System
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS "purchase_requests" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "student_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "course_id" uuid NOT NULL REFERENCES "courses"("id") ON DELETE CASCADE,
  "amount_paid" integer NOT NULL,
  "currency" text NOT NULL DEFAULT 'EGP',
  "status" text NOT NULL DEFAULT 'pending_payment',
  "payment_method" text NOT NULL DEFAULT 'instapay',
  "instapay_transaction_id" text,
  "receipt_image_url" text,
  "receipt_image_public_id" text,
  "reviewed_by" uuid REFERENCES "users"("id"),
  "reviewed_at" timestamp,
  "rejection_reason" text,
  "submitted_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "instructor_wallets" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "instructor_id" uuid NOT NULL UNIQUE REFERENCES "users"("id") ON DELETE CASCADE,
  "available_balance" integer NOT NULL DEFAULT 0,
  "lifetime_earnings" integer NOT NULL DEFAULT 0,
  "pending_balance" integer NOT NULL DEFAULT 0,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "wallet_transactions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "wallet_id" uuid NOT NULL REFERENCES "instructor_wallets"("id") ON DELETE CASCADE,
  "purchase_request_id" uuid REFERENCES "purchase_requests"("id"),
  "type" text NOT NULL,
  "amount" integer NOT NULL,
  "description" text,
  "created_at" timestamp DEFAULT now() NOT NULL
);

-- Prevent duplicate purchase requests for same student+course
CREATE UNIQUE INDEX IF NOT EXISTS "unique_active_purchase"
  ON "purchase_requests"("student_id", "course_id")
  WHERE status NOT IN ('rejected', 'cancelled');
