import { supabase } from "../lib/supabase";

export class MeService {
  /**
   * Get student enrollments with progress
   */
  async getMyEnrollments(userId: string) {
    const { data: enrollments, error } = await supabase
      .from("enrollments")
      .select(`
        id,
        status,
        enrolled_at,
        completed_at,
        course_id,
        courses (
          id, title, description, thumbnail_url, level, status, price, whatsapp_link
        )
      `)
      .eq("user_id", userId)
      .eq("status", "active");

    if (error) throw new Error(`Failed to get enrollments: ${error.message}`);

    // For each enrollment get lesson progress
    const result = await Promise.all(
      (enrollments || []).map(async (e: any) => {
        const course = e.courses;

        // Total lessons in course via sections
        const { data: sections } = await supabase
          .from("sections")
          .select("id")
          .eq("course_id", e.course_id);

        const sectionIds = (sections || []).map((s: any) => s.id);
        let totalLessons = 0;
        let completedLessons = 0;

        if (sectionIds.length > 0) {
          const { count: total } = await supabase
            .from("lessons")
            .select("*", { count: "exact", head: true })
            .in("section_id", sectionIds)
            .eq("is_published", true);

          totalLessons = total ?? 0;

          // Get completed lessons
          const { data: lessonIds } = await supabase
            .from("lessons")
            .select("id")
            .in("section_id", sectionIds);

          if (lessonIds && lessonIds.length > 0) {
            const { count: completed } = await supabase
              .from("lesson_completions")
              .select("*", { count: "exact", head: true })
              .eq("user_id", userId)
              .in("lesson_id", lessonIds.map((l: any) => l.id));
            completedLessons = completed ?? 0;
          }
        }

        const progressPercent =
          totalLessons > 0
            ? Math.round((completedLessons / totalLessons) * 100)
            : 0;

        return {
          enrollmentId: e.id,
          status: e.status,
          enrolledAt: e.enrolled_at,
          completedAt: e.completed_at,
          progressPercent,
          completedLessons,
          totalLessons,
          course: {
            id: course?.id,
            title: course?.title,
            description: course?.description,
            thumbnailUrl: course?.thumbnail_url,
            level: course?.level,
            status: course?.status,
            price: course?.price,
            whatsappLink: course?.whatsapp_link,
          },
        };
      })
    );

    return result;
  }

  /**
   * Student dashboard stats
   */
  async getMyStats(userId: string) {
    const { count: totalEnrollments } = await supabase
      .from("enrollments")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    const { count: completedCourses } = await supabase
      .from("enrollments")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "completed");

    const { count: totalLessonsCompleted } = await supabase
      .from("lesson_completions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    return {
      totalEnrollments: totalEnrollments ?? 0,
      completedCourses: completedCourses ?? 0,
      totalLessonsCompleted: totalLessonsCompleted ?? 0,
      currentStreakDays: 0, // TODO: implement streak
    };
  }

  /**
   * Student assignments (from enrolled courses)
   */
  async getMyAssignments(userId: string) {
    // 1. Get enrolled courses
    const { data: enrollments } = await supabase
      .from("enrollments")
      .select("course_id, courses(title)")
      .eq("user_id", userId)
      .eq("status", "active");

    if (!enrollments || enrollments.length === 0) return [];
    const courseIds = enrollments.map((e: any) => e.course_id);

    // 2. Get assignments for those courses
    const { data: assignments } = await supabase
      .from("assignments")
      .select("*")
      .in("course_id", courseIds)
      .eq("status", "published")
      .order("due_date", { ascending: true });

    if (!assignments) return [];

    // Map course title
    return assignments.map(a => {
      const e = enrollments.find((en: any) => en.course_id === a.course_id);
      return {
        id: a.id,
        title: a.title,
        description: a.description,
        dueDate: a.due_date,
        maxScore: a.max_score,
        courseId: a.course_id,
        courseTitle: (Array.isArray(e?.courses) ? e?.courses[0]?.title : (e?.courses as any)?.title) || "دورة غير معروفة",
      };
    });
  }

  /**
   * Instructor: my courses with stats
   */
  async getMyInstructorCourses(instructorId: string) {
    const { data: courses, error } = await supabase
      .from("courses")
      .select("*")
      .eq("instructor_id", instructorId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(`Failed to get instructor courses: ${error.message}`);

    const result = await Promise.all(
      (courses || []).map(async (course: any) => {
        // Count students
        const { count: totalStudents } = await supabase
          .from("enrollments")
          .select("*", { count: "exact", head: true })
          .eq("course_id", course.id);

        // Count lessons
        const { data: sections } = await supabase
          .from("sections")
          .select("id")
          .eq("course_id", course.id);

        const sectionIds = (sections || []).map((s: any) => s.id);
        let totalLessons = 0;
        if (sectionIds.length > 0) {
          const { count } = await supabase
            .from("lessons")
            .select("*", { count: "exact", head: true })
            .in("section_id", sectionIds);
          totalLessons = count ?? 0;
        }

        // Revenue from wallet
        const { data: walletTx } = await supabase
          .from("wallet_transactions")
          .select("amount")
          .eq("type", "credit");

        const totalRevenue = 0; // simplified for now

        return {
          id: course.id,
          title: course.title,
          description: course.description,
          thumbnailUrl: course.thumbnail_url,
          price: course.price,
          status: course.status,
          level: course.level,
          createdAt: course.created_at,
          totalStudents: totalStudents ?? 0,
          totalLessons,
          totalRevenue,
        };
      })
    );

    return result;
  }

  /**
   * Instructor stats summary
   */
  async getMyInstructorStats(instructorId: string) {
    const { data: courses } = await supabase
      .from("courses")
      .select("id, status")
      .eq("instructor_id", instructorId);

    const courseIds = (courses || []).map((c: any) => c.id);
    const publishedCourses = (courses || []).filter((c: any) => c.status === "published").length;

    let totalStudents = 0;
    if (courseIds.length > 0) {
      const { count } = await supabase
        .from("enrollments")
        .select("*", { count: "exact", head: true })
        .in("course_id", courseIds);
      totalStudents = count ?? 0;
    }

    // Get wallet
    const { data: wallet } = await supabase
      .from("instructor_wallets")
      .select("lifetime_earnings")
      .eq("instructor_id", instructorId)
      .single();

    return {
      totalRevenue: wallet?.lifetime_earnings ?? 0,
      totalStudents,
      publishedCourses,
      totalCourses: courses?.length ?? 0,
    };
  }
}
