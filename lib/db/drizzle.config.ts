import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load .env from this directory (lib/db/.env)
dotenv.config();

// @ts-ignore
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  schema: "./src/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    // @ts-ignore
    url: process.env.DATABASE_URL,
  },
});
