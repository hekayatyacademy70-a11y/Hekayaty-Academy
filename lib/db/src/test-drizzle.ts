import { db, usersTable, coursesTable } from "./index";

async function run() {
  try {
    console.log("Testing Drizzle query...");
    const courses = await db.select().from(coursesTable).limit(1);
    console.log("Courses:", courses);
    
    const users = await db.select().from(usersTable).limit(1);
    console.log("Users:", users);
  } catch (err) {
    console.error("Drizzle Query Error:", err);
  }
}

run();
