import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

// Support two connection modes:
// 1. Individual DB_* vars (preferred – avoids URL-encoding issues with special chars in passwords)
// 2. DATABASE_URL fallback
const hasIndividualVars = process.env.DB_HOST && process.env.DB_PASSWORD;

if (!hasIndividualVars && !process.env.DATABASE_URL) {
  throw new Error(
    "Database connection not configured. Set DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME or DATABASE_URL.",
  );
}

export const pool = hasIndividualVars
  ? new Pool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || "5432", 10),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || "postgres",
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });

export const db = drizzle(pool, { schema });

export * from "./schema";
