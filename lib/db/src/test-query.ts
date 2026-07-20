import { db } from "./index";
import { sql } from "drizzle-orm";

async function main() {
  try {
    console.log("Testing query on users...");
    await db.execute(sql`SELECT is_suspended FROM users LIMIT 1`);
    console.log("Users query SUCCESS!");
  } catch (err: any) {
    console.error("Users query ERROR:");
    console.error(err);
  }

  try {
    console.log("Testing query on courses...");
    await db.execute(sql`SELECT * FROM courses LIMIT 1`);
    console.log("Courses query SUCCESS!");
  } catch (err: any) {
    console.error("Courses query ERROR:");
    console.error(err);
  }

  process.exit(0);
}

main();
