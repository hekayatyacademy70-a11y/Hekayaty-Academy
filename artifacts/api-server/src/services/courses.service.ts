import { supabase } from "../lib/supabase";

export class CoursesService {
  /**
   * Get all published courses
   */
  async getCourses() {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("status", "published");

    if (error) throw new Error(`Failed to get courses: ${error.message}`);
    return this.mapCourses(data || []);
  }

  /**
   * Get a specific course along with its instructor, sections, and lessons
   */
  async getCourseById(courseId: string) {
    const { data: course, error } = await supabase
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .single();

    if (error || !course) throw new Error("Course not found");

    const { data: instructor } = await supabase
      .from("users")
      .select("id, name, email, avatar_url")
      .eq("id", course.instructor_id)
      .single();

    const { data: sections } = await supabase
      .from("sections")
      .select("*")
      .eq("course_id", courseId)
      .order("order");

    const sectionIds = (sections || []).map((s: any) => s.id);
    let lessons: any[] = [];
    if (sectionIds.length > 0) {
      const { data: lessonData } = await supabase
        .from("lessons")
        .select("*")
        .in("section_id", sectionIds)
        .order("order");
      lessons = lessonData || [];
    }

    const sectionsWithLessons = (sections || []).map((section: any) => ({
      ...this.mapSection(section),
      lessons: lessons
        .filter((l: any) => l.section_id === section.id)
        .map(this.mapLesson),
    }));

    return {
      ...this.mapCourse(course),
      instructor: instructor
        ? { id: instructor.id, name: instructor.name, email: instructor.email, avatarUrl: instructor.avatar_url }
        : null,
      sections: sectionsWithLessons,
    };
  }

  /**
   * Get a specific lesson
   */
  async getLessonById(lessonId: string) {
    const { data: lesson, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("id", lessonId)
      .single();

    if (error || !lesson) throw new Error("Lesson not found");
    return this.mapLesson(lesson);
  }

  /**
   * Create a new course
   */
  async createCourse(instructorId: string, data: {
    title: string;
    description?: string;
    thumbnailUrl?: string;
    price?: number;
    level?: string;
    category?: string;
    whatsappLink?: string;
  }) {
    const { data: course, error } = await supabase
      .from("courses")
      .insert({
        title: data.title,
        description: data.description,
        thumbnail_url: data.thumbnailUrl,
        instructor_id: instructorId,
        price: data.price ?? 0,
        level: data.level || "beginner",
        category: data.category ?? null,
        whatsapp_link: data.whatsappLink ?? null,
        status: "published",
      })
      .select()
      .single();

    if (error || !course) throw new Error(`Failed to create course: ${error?.message}`);
    return this.mapCourse(course);
  }

  /**
   * Create a default section and insert lessons under it
   */
  async createSectionWithLessons(courseId: string, lessons: Array<{ title: string; youtubeVideoId?: string }>) {
    // Create one default section
    const { data: section, error: secErr } = await supabase
      .from("sections")
      .insert({ course_id: courseId, title: "المحتوى", order: 1 })
      .select()
      .single();

    if (secErr || !section) throw new Error(`Failed to create section: ${secErr?.message}`);

    // Insert all lessons
    const lessonRows = lessons.map((l, i) => ({
      section_id: section.id,
      title: l.title || `درس ${i + 1}`,
      type: "video",
      youtube_video_id: l.youtubeVideoId || null,
      order: i + 1,
    }));

    const { error: lessonErr } = await supabase.from("lessons").insert(lessonRows);
    if (lessonErr) throw new Error(`Failed to create lessons: ${lessonErr.message}`);

    return { sectionId: section.id };
  }

  /**
   * Enroll a user in a course
   */
  async enrollInCourse(userId: string, courseId: string) {
    const { error } = await supabase.from("enrollments").insert({
      user_id: userId,
      course_id: courseId,
      status: "active",
    });
    if (error) throw new Error(`Enrollment failed: ${error.message}`);
    return { success: true };
  }

  /**
   * Mark a lesson as completed
   */
  async completeLesson(userId: string, lessonId: string) {
    const { error } = await supabase.from("lesson_completions").insert({
      user_id: userId,
      lesson_id: lessonId,
    });
    if (error && !error.message.includes("duplicate")) {
      throw new Error(`Failed to mark complete: ${error.message}`);
    }
    return { success: true };
  }

  // ── Mappers (snake_case → camelCase) ─────────────────────────
  private mapCourse(c: any) {
    return {
      id: c.id,
      title: c.title,
      description: c.description,
      thumbnailUrl: c.thumbnail_url,
      instructorId: c.instructor_id,
      price: c.price,
      status: c.status,
      level: c.level,
      isPremium: c.is_premium,
      category: c.category ?? null,
      whatsappLink: c.whatsapp_link ?? null,
      createdAt: c.created_at,
      updatedAt: c.updated_at,
    };
  }

  private mapCourses(courses: any[]) {
    return courses.map(this.mapCourse.bind(this));
  }

  private mapSection(s: any) {
    return {
      id: s.id,
      courseId: s.course_id,
      title: s.title,
      order: s.order,
      createdAt: s.created_at,
    };
  }

  private mapLesson(l: any) {
    return {
      id: l.id,
      sectionId: l.section_id,
      title: l.title,
      type: l.type,
      content: l.content,
      order: l.order,
      youtubeVideoId: l.youtube_video_id,
      duration: l.duration,
      isFreePreview: l.is_free_preview,
      isPublished: l.is_published,
      createdAt: l.created_at,
    };
  }

  /**
   * Delete a course — only the owning instructor can delete
   */
  async deleteCourse(courseId: string, instructorId: string) {
    // Verify ownership first
    const { data: course, error: findErr } = await supabase
      .from("courses")
      .select("id, instructor_id")
      .eq("id", courseId)
      .single();

    if (findErr || !course) throw new Error("Course not found");
    if (course.instructor_id !== instructorId) throw new Error("Forbidden: you don't own this course");

    // Delete lessons first (cascade may not be set)
    const { data: sections } = await supabase
      .from("sections")
      .select("id")
      .eq("course_id", courseId);

    if (sections && sections.length > 0) {
      const sectionIds = sections.map((s: any) => s.id);
      await supabase.from("lessons").delete().in("section_id", sectionIds);
      await supabase.from("sections").delete().in("id", sectionIds);
    }

    // Delete enrollments
    await supabase.from("enrollments").delete().eq("course_id", courseId);

    // Delete the course
    const { error: deleteErr } = await supabase.from("courses").delete().eq("id", courseId);
    if (deleteErr) throw new Error(`Failed to delete course: ${deleteErr.message}`);
  }
}
