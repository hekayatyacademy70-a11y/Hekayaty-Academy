import { supabase } from "../lib/supabase";

const INSTRUCTOR_SHARE = 0.70;

export class InstructorService {
  /**
   * Get all courses for an instructor with enrollment/revenue stats
   */
  async getInstructorCourses(instructorId: string) {
    const { data: courses, error } = await supabase
      .from("courses")
      .select("*")
      .eq("instructor_id", instructorId);

    if (error) throw new Error(`Failed to get instructor courses: ${error.message}`);
    if (!courses || courses.length === 0) return [];

    return await Promise.all(
      courses.map(async (course: any) => {
        const { count: totalStudents } = await supabase
          .from("enrollments")
          .select("*", { count: "exact", head: true })
          .eq("course_id", course.id);

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

        const students = totalStudents ?? 0;
        const totalRevenue = Math.round(students * course.price * INSTRUCTOR_SHARE);

        return {
          id: course.id,
          title: course.title,
          description: course.description,
          thumbnailUrl: course.thumbnail_url,
          price: course.price,
          status: course.status,
          level: course.level,
          createdAt: course.created_at,
          totalStudents: students,
          totalRevenue,
          totalLessons,
          averageRating: null,
        };
      })
    );
  }

  /**
   * Get aggregate stats for an instructor
   */
  async getInstructorStats(instructorId: string) {
    const { data: courses } = await supabase
      .from("courses")
      .select("id, status, price")
      .eq("instructor_id", instructorId);

    const courseIds = (courses || []).map((c: any) => c.id);
    const publishedCourses = (courses || []).filter((c: any) => c.status === "published").length;

    let totalStudents = 0;
    let totalRevenue = 0;

    if (courseIds.length > 0) {
      for (const course of (courses || [])) {
        const { count } = await supabase
          .from("enrollments")
          .select("*", { count: "exact", head: true })
          .eq("course_id", course.id);
        const students = count ?? 0;
        totalStudents += students;
        totalRevenue += Math.round(students * course.price * INSTRUCTOR_SHARE);
      }
    }

    return {
      totalStudents,
      totalRevenue,
      totalCourses: courses?.length ?? 0,
      publishedCourses,
      averageRating: null,
    };
  }

  /**
   * Get all students enrolled in this instructor's courses
   */
  async getInstructorStudents(instructorId: string) {
    const { data: courses } = await supabase
      .from("courses")
      .select("id")
      .eq("instructor_id", instructorId);
      
    if (!courses || courses.length === 0) return [];
    const courseIds = courses.map((c: any) => c.id);

    const { data: enrollments, error } = await supabase
      .from("enrollments")
      .select(`
        id, enrolled_at, status, course_id,
        users:user_id(id, name, email, avatar_url)
      `)
      .in("course_id", courseIds);

    if (error) throw new Error(error.message);
    if (!enrollments) return [];

    // Get completions
    const userIds = enrollments.map((e: any) => e.users.id);
    const { data: completions } = await supabase
      .from("lesson_completions")
      .select("user_id, lesson_id")
      .in("user_id", userIds);

    // Get total lessons per course
    const { data: sections } = await supabase
      .from("sections")
      .select("id, course_id")
      .in("course_id", courseIds);
      
    const sectionIds = (sections || []).map((s: any) => s.id);
    let lessons: any[] = [];
    if (sectionIds.length > 0) {
      const { data: l } = await supabase
        .from("lessons")
        .select("id, section_id")
        .in("section_id", sectionIds);
      lessons = l || [];
    }

    const courseLessonCounts: Record<string, number> = {};
    const lessonToCourse: Record<string, string> = {};
    
    for (const section of (sections || [])) {
      const sectionLessons = lessons.filter(l => l.section_id === section.id);
      courseLessonCounts[section.course_id] = (courseLessonCounts[section.course_id] || 0) + sectionLessons.length;
      for (const l of sectionLessons) {
        lessonToCourse[l.id] = section.course_id;
      }
    }

    return enrollments.map((e: any) => {
      const totalLessons = courseLessonCounts[e.course_id] || 0;
      
      const userCompletions = (completions || []).filter(c => 
        c.user_id === e.users.id && lessonToCourse[c.lesson_id] === e.course_id
      );
      
      const completedCount = userCompletions.length;
      const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

      return {
        id: e.users.id,
        enrollmentId: e.id,
        name: e.users.name || "طالب بدون اسم",
        email: e.users.email,
        avatar: e.users.avatar_url,
        enrolledAt: e.enrolled_at,
        courseId: e.course_id,
        progress,
        lessonsCompleted: completedCount,
        totalLessons,
        lastActivity: "غير متوفر",
      };
    });
  }

  /**
   * Get all assignments for this instructor's courses
   */
  async getInstructorAssignments(instructorId: string) {
    const { data: courses } = await supabase
      .from("courses")
      .select("id")
      .eq("instructor_id", instructorId);
    if (!courses || courses.length === 0) return [];
    
    const { data, error } = await supabase
      .from("assignments")
      .select("*")
      .in("course_id", courses.map(c => c.id))
      .order("created_at", { ascending: false });
      
    if (error) throw new Error(error.message);
    
    if (data && data.length > 0) {
      const assignmentIds = data.map(a => a.id);
      const { data: submissions } = await supabase
        .from("assignment_submissions")
        .select("assignment_id, status, score")
        .in("assignment_id", assignmentIds);
        
      return data.map(a => {
        const subs = (submissions || []).filter(s => s.assignment_id === a.id);
        const pending = subs.filter(s => s.status === "pending").length;
        const graded = subs.filter(s => s.status === "graded");
        const avgScore = graded.length > 0 
          ? Math.round(graded.reduce((acc, s) => acc + (s.score || 0), 0) / graded.length) 
          : 0;
          
        return {
          id: a.id,
          title: a.title,
          description: a.description,
          dueDate: a.due_date,
          maxScore: a.max_score,
          courseId: a.course_id,
          status: a.status,
          submissions: subs.length,
          pending,
          averageScore: avgScore
        };
      });
    }
    
    return [];
  }

  async createAssignment(data: any) {
    const { data: newAssignment, error } = await supabase
      .from("assignments")
      .insert({
        course_id: data.courseId,
        title: data.title,
        description: data.description,
        max_score: data.maxScore || 100,
        due_date: data.dueDate || null,
        status: data.status || "published"
      })
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    return newAssignment;
  }

  /**
   * Get all certificates issued by this instructor
   */
  async getInstructorCertificates(instructorId: string) {
    const { data: courses } = await supabase
      .from("courses")
      .select("id")
      .eq("instructor_id", instructorId);
    if (!courses || courses.length === 0) return [];
    
    const { data, error } = await supabase
      .from("certificates")
      .select(`
        *,
        user:user_id(id, name, email, avatar_url)
      `)
      .in("course_id", courses.map(c => c.id))
      .order("issued_at", { ascending: false });
      
    if (error) throw new Error(error.message);
    return data;
  }

  /**
   * Get all announcements created by this instructor
   */
  async getInstructorAnnouncements(instructorId: string) {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .eq("instructor_id", instructorId)
      .order("published_at", { ascending: false });
      
    if (error) throw new Error(error.message);
    
    return (data || []).map(a => ({
      id: a.id,
      title: a.title,
      content: a.content,
      courseId: a.course_id,
      priority: a.priority,
      status: a.status,
      readCount: a.read_count,
      publishedAt: a.published_at
    }));
  }

  async createAnnouncement(data: any, instructorId: string) {
    const { data: announcement, error } = await supabase
      .from("announcements")
      .insert({
        course_id: data.courseId,
        instructor_id: instructorId,
        title: data.title,
        content: data.content,
        priority: data.priority || "normal",
        status: "published"
      })
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    return announcement;
  }

  /**
   * Delete a course owned by this instructor.
   * ❌ BLOCKED if any students are currently enrolled — to protect student rights.
   * Only admins can force-delete courses with enrolled students.
   */
  async deleteCourse(courseId: string, instructorId: string) {
    // 1. Verify ownership
    const { data: course, error: fetchError } = await supabase
      .from("courses")
      .select("id, instructor_id")
      .eq("id", courseId)
      .single();

    if (fetchError || !course) throw new Error("الدورة غير موجودة");
    if (course.instructor_id !== instructorId) throw new Error("غير مصرح لك بحذف هذه الدورة");

    // 2. Check for enrolled students — block if any exist
    const { count: enrollmentCount } = await supabase
      .from("enrollments")
      .select("*", { count: "exact", head: true })
      .eq("course_id", courseId);

    if (enrollmentCount && enrollmentCount > 0) {
      throw new Error(
        `لا يمكن حذف هذه الدورة لأن ${enrollmentCount} طالب/طلاب مسجلين فيها. تواصل مع الإدارة لحذف الدورة.`
      );
    }

    // 3. Safe to delete — no students enrolled, do a clean cascade
    await supabase.from("announcements").delete().eq("course_id", courseId);
    await supabase.from("assignments").delete().eq("course_id", courseId);
    await supabase.from("certificates").delete().eq("course_id", courseId);
    await supabase.from("purchase_requests").delete().eq("course_id", courseId);

    const { data: sections } = await supabase
      .from("sections").select("id").eq("course_id", courseId);
    const sectionIds = (sections || []).map((s: any) => s.id);
    if (sectionIds.length > 0) {
      await supabase.from("lessons").delete().in("section_id", sectionIds);
    }
    await supabase.from("sections").delete().eq("course_id", courseId);

    const { error } = await supabase.from("courses").delete().eq("id", courseId);
    if (error) throw new Error(error.message);

    return { success: true };
  }

  /**
   * Admin-only: Force-delete a course regardless of enrolled students.
   * Cleans up all related data in the correct FK order.
   */
  async adminForceDeleteCourse(courseId: string) {
    // Verify course exists
    const { data: course, error: fetchError } = await supabase
      .from("courses").select("id").eq("id", courseId).single();
    if (fetchError || !course) throw new Error("الدورة غير موجودة");

    // Step 1: wallet_transactions → purchase_requests
    const { data: purchaseRequests } = await supabase
      .from("purchase_requests").select("id").eq("course_id", courseId);
    const prIds = (purchaseRequests || []).map((pr: any) => pr.id);
    if (prIds.length > 0) {
      await supabase.from("wallet_transactions").delete().in("purchase_request_id", prIds);
    }
    await supabase.from("purchase_requests").delete().eq("course_id", courseId);

    // Step 2: lesson_completions
    const { data: sections } = await supabase
      .from("sections").select("id").eq("course_id", courseId);
    const sectionIds = (sections || []).map((s: any) => s.id);
    if (sectionIds.length > 0) {
      const { data: lessons } = await supabase
        .from("lessons").select("id").in("section_id", sectionIds);
      const lessonIds = (lessons || []).map((l: any) => l.id);
      if (lessonIds.length > 0) {
        await supabase.from("lesson_completions").delete().in("lesson_id", lessonIds);
      }
      await supabase.from("lessons").delete().in("section_id", sectionIds);
    }

    // Step 3: assignment_submissions → assignments
    const { data: assignments } = await supabase
      .from("assignments").select("id").eq("course_id", courseId);
    const assignmentIds = (assignments || []).map((a: any) => a.id);
    if (assignmentIds.length > 0) {
      await supabase.from("assignment_submissions").delete().in("assignment_id", assignmentIds);
    }

    // Step 4: remaining dependents
    await supabase.from("assignments").delete().eq("course_id", courseId);
    await supabase.from("announcements").delete().eq("course_id", courseId);
    await supabase.from("certificates").delete().eq("course_id", courseId);
    await supabase.from("enrollments").delete().eq("course_id", courseId);
    await supabase.from("sections").delete().eq("course_id", courseId);

    // Step 5: the course itself
    const { error } = await supabase.from("courses").delete().eq("id", courseId);
    if (error) throw new Error(error.message);

    return { success: true };
  }
}
