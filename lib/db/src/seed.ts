import "dotenv/config";
import { db, usersTable, coursesTable, sectionsTable, lessonsTable } from "./index";
import bcrypt from "bcryptjs";

const seedData = async () => {
  console.log("Seeding database...");

  // 1. Create a dummy instructor
  const passwordHash = await bcrypt.hash("password123", 10);
  const [instructor] = await db.insert(usersTable).values({
    email: "instructor@example.com",
    name: "محمد الشريف",
    passwordHash,
    role: "instructor",
  }).returning();

  console.log(`Instructor created with ID: ${instructor.id}`);

  // 2. Insert Mock Courses
  const mockCourses = [
    {
      title: "أساسيات الكتابة الإبداعية",
      price: 150,
      category: "القصة القصيرة",
      level: "beginner" as const,
      thumbnailColor: "from-amber-600 to-amber-900",
      description: "تعلم القواعد الأساسية لبناء القصة والشخصيات والحبكة، لتنطلق في عالم الكتابة."
    },
    {
      title: "بناء العوالم الخيالية",
      price: 200,
      category: "الفانتازيا",
      level: "advanced" as const,
      thumbnailColor: "from-blue-600 to-indigo-900",
      description: "ورشة متقدمة في بناء عوالم الفانتازيا والخيال العلمي بدقة واحترافية."
    },
    {
      title: "فن الرواية التاريخية",
      price: 180,
      category: "الرواية",
      level: "intermediate" as const,
      thumbnailColor: "from-stone-600 to-stone-900",
      description: "كيف تكتب رواية تاريخية تمزج بين دقة البحث وجمال السرد."
    }
  ];

  for (const mc of mockCourses) {
    const [course] = await db.insert(coursesTable).values({
      title: mc.title,
      description: mc.description,
      instructorId: instructor.id,
      price: mc.price,
      status: "published",
      level: mc.level,
      // We store the thumbnailColor in the description or another field for now, 
      // or just leave it out until we add it to the schema
    }).returning();

    // 3. Add Sections
    const [section] = await db.insert(sectionsTable).values({
      courseId: course.id,
      title: "المقدمة",
      order: 1,
    }).returning();

    // 4. Add Lessons
    await db.insert(lessonsTable).values({
      sectionId: section.id,
      title: "الدرس الأول: ترحيب",
      type: "video",
      duration: 120,
      order: 1,
      isFreePreview: true,
    });
  }

  console.log("Seeding complete!");
};

seedData().catch(console.error).finally(() => process.exit(0));
