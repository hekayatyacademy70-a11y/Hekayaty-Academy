import { supabase } from "../lib/supabase";

export class PathsService {
  // ─────────────────────────────────────────────
  // PUBLIC / STUDENT METHODS
  // ─────────────────────────────────────────────

  async getPublishedPaths() {
    const { data, error } = await supabase
      .from("learning_paths")
      .select(`
        id, title, slug, short_description, thumbnail_url, skill_level,
        total_hours, regular_price, discount_price, status, created_at,
        learning_path_courses (id),
        learning_path_enrollments (id)
      `)
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error) throw new Error(`Failed to get paths: ${error.message}`);

    return (data || []).map((p: any) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      shortDescription: p.short_description,
      thumbnailUrl: p.thumbnail_url,
      skillLevel: p.skill_level,
      totalHours: p.total_hours,
      regularPrice: p.regular_price,
      discountPrice: p.discount_price,
      status: p.status,
      coursesCount: (p.learning_path_courses || []).length,
      studentsCount: (p.learning_path_enrollments || []).length,
    }));
  }

  async getPathBySlug(slug: string) {
    const { data: path, error } = await supabase
      .from("learning_paths")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (error || !path) throw new Error("Path not found");

    const { data: pathCourses } = await supabase
      .from("learning_path_courses")
      .select(`
        id, order_index, revenue_weight, require_previous, course_id,
        courses (id, title, thumbnail_url, price, instructor_id,
          users!courses_instructor_id_fkey (name)
        )
      `)
      .eq("path_id", path.id)
      .order("order_index", { ascending: true });

    return {
      id: path.id,
      title: path.title,
      slug: path.slug,
      shortDescription: path.short_description,
      fullDescription: path.full_description,
      thumbnailUrl: path.thumbnail_url,
      bannerUrl: path.banner_url,
      skillLevel: path.skill_level,
      totalHours: path.total_hours,
      regularPrice: path.regular_price,
      discountPrice: path.discount_price,
      status: path.status,
      courses: (pathCourses || []).map((pc: any) => ({
        pathCourseId: pc.id,
        orderIndex: pc.order_index,
        courseId: pc.course_id,
        title: pc.courses?.title,
        thumbnailUrl: pc.courses?.thumbnail_url,
        instructorName: pc.courses?.users?.name,
        price: pc.courses?.price,
        requirePrevious: pc.require_previous,
      })),
    };
  }

  async enrollUserInPath(userId: string, pathId: string) {
    // 1. Get courses in path
    const { data: pathCourses } = await supabase
      .from("learning_path_courses")
      .select("course_id")
      .eq("path_id", pathId);

    // 2. Create path enrollment
    const { error: enrollError } = await supabase
      .from("learning_path_enrollments")
      .insert({ user_id: userId, path_id: pathId, status: "active", progress_percent: 0 });

    if (enrollError) throw new Error(`Enrollment failed: ${enrollError.message}`);

    // 3. Enroll in each course (ignore conflicts)
    for (const { course_id } of (pathCourses || [])) {
      await supabase
        .from("enrollments")
        .upsert({ user_id: userId, course_id, status: "active" }, { onConflict: "user_id,course_id", ignoreDuplicates: true });
    }

    return { success: true };
  }

  async getMyPaths(userId: string) {
    const { data, error } = await supabase
      .from("learning_path_enrollments")
      .select(`
        id, status, progress_percent, created_at,
        learning_paths (id, title, slug, thumbnail_url, total_hours)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(`Failed to get my paths: ${error.message}`);

    return (data || []).map((e: any) => ({
      id: e.id,
      status: e.status,
      progressPercent: e.progress_percent,
      path: {
        id: e.learning_paths?.id,
        title: e.learning_paths?.title,
        slug: e.learning_paths?.slug,
        thumbnailUrl: e.learning_paths?.thumbnail_url,
        totalHours: e.learning_paths?.total_hours,
      },
    }));
  }

  // ─────────────────────────────────────────────
  // ADMIN METHODS
  // ─────────────────────────────────────────────

  async getAdminPaths() {
    const { data, error } = await supabase
      .from("learning_paths")
      .select(`
        id, title, slug, status, regular_price, created_at,
        learning_path_courses (id),
        learning_path_enrollments (id)
      `)
      .order("created_at", { ascending: false });

    if (error) throw new Error(`Failed to get admin paths: ${error.message}`);

    return (data || []).map((p: any) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      status: p.status,
      regularPrice: p.regular_price,
      createdAt: p.created_at,
      coursesCount: (p.learning_path_courses || []).length,
      studentsCount: (p.learning_path_enrollments || []).length,
    }));
  }

  async createPath(data: any) {
    const { data: path, error } = await supabase
      .from("learning_paths")
      .insert({
        title: data.title,
        slug: data.slug,
        short_description: data.shortDescription,
        full_description: data.fullDescription,
        thumbnail_url: data.thumbnailUrl,
        banner_url: data.bannerUrl,
        skill_level: data.skillLevel || "beginner",
        total_hours: data.totalHours || 0,
        regular_price: data.regularPrice || 0,
        discount_price: data.discountPrice || null,
        status: data.status || "draft",
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create path: ${error.message}`);
    return path;
  }

  async getAdminPathDetails(id: string) {
    const { data: path, error } = await supabase
      .from("learning_paths")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !path) throw new Error("Path not found");

    const { data: pathCourses } = await supabase
      .from("learning_path_courses")
      .select(`
        id, order_index, revenue_weight, require_previous, course_id,
        courses (id, title, thumbnail_url, price, instructor_id,
          users!courses_instructor_id_fkey (name)
        )
      `)
      .eq("path_id", id)
      .order("order_index", { ascending: true });

    return {
      id: path.id,
      title: path.title,
      slug: path.slug,
      shortDescription: path.short_description,
      fullDescription: path.full_description,
      thumbnailUrl: path.thumbnail_url,
      bannerUrl: path.banner_url,
      skillLevel: path.skill_level,
      totalHours: path.total_hours,
      regularPrice: path.regular_price,
      discountPrice: path.discount_price,
      status: path.status,
      courses: (pathCourses || []).map((pc: any) => ({
        pathCourseId: pc.id,
        courseId: pc.course_id,
        title: pc.courses?.title,
        thumbnailUrl: pc.courses?.thumbnail_url,
        instructorName: pc.courses?.users?.name,
        price: pc.courses?.price,
        orderIndex: pc.order_index,
        revenueWeight: pc.revenue_weight,
        requirePrevious: pc.require_previous,
      })),
    };
  }

  async updatePath(id: string, data: any) {
    const updateData: any = { updated_at: new Date().toISOString() };
    if (data.title !== undefined) updateData.title = data.title;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.shortDescription !== undefined) updateData.short_description = data.shortDescription;
    if (data.fullDescription !== undefined) updateData.full_description = data.fullDescription;
    if (data.thumbnailUrl !== undefined) updateData.thumbnail_url = data.thumbnailUrl;
    if (data.bannerUrl !== undefined) updateData.banner_url = data.bannerUrl;
    if (data.skillLevel !== undefined) updateData.skill_level = data.skillLevel;
    if (data.totalHours !== undefined) updateData.total_hours = data.totalHours;
    if (data.regularPrice !== undefined) updateData.regular_price = data.regularPrice;
    if (data.discountPrice !== undefined) updateData.discount_price = data.discountPrice || null;
    if (data.status !== undefined) updateData.status = data.status;

    const { data: updated, error } = await supabase
      .from("learning_paths")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update path: ${error.message}`);
    return updated;
  }

  async deletePath(id: string) {
    const { error } = await supabase.from("learning_paths").delete().eq("id", id);
    if (error) throw new Error(`Failed to delete path: ${error.message}`);
    return { success: true };
  }

  async updatePathCourses(pathId: string, coursesData: any[]) {
    // Clear existing
    await supabase.from("learning_path_courses").delete().eq("path_id", pathId);

    if (!coursesData || coursesData.length === 0) return { success: true };

    const { error } = await supabase.from("learning_path_courses").insert(
      coursesData.map(c => ({
        path_id: pathId,
        course_id: c.courseId,
        order_index: c.orderIndex,
        revenue_weight: c.revenueWeight,
        require_previous: c.requirePrevious || false,
      }))
    );

    if (error) throw new Error(`Failed to update path courses: ${error.message}`);
    return { success: true };
  }

  // ─────────────────────────────────────────────
  // INSTRUCTOR METHODS
  // ─────────────────────────────────────────────

  async getInstructorPaths(instructorId: string) {
    // Get all courses belonging to this instructor
    const { data: myCourses } = await supabase
      .from("courses")
      .select("id, title")
      .eq("instructor_id", instructorId);

    if (!myCourses || myCourses.length === 0) return [];

    const myCourseIds = myCourses.map(c => c.id);

    // Find paths that contain these courses
    const { data: pathCourses } = await supabase
      .from("learning_path_courses")
      .select(`
        path_id, course_id, revenue_weight,
        learning_paths (id, title, status, thumbnail_url, learning_path_enrollments (id))
      `)
      .in("course_id", myCourseIds);

    if (!pathCourses || pathCourses.length === 0) return [];

    // Group by path
    const pathsMap = new Map();

    for (const pc of pathCourses) {
      const p = pc.learning_paths as any;
      if (!p) continue;

      if (!pathsMap.has(p.id)) {
        pathsMap.set(p.id, {
          pathId: p.id,
          pathTitle: p.title,
          status: p.status,
          thumbnailUrl: p.thumbnail_url,
          enrollments: (p.learning_path_enrollments || []).length,
          revenueWeight: 0,
          earnings: 0, // Placeholder - actual calculation needs payment integration
          courses: [],
        });
      }

      const pathEntry = pathsMap.get(p.id);
      pathEntry.revenueWeight += pc.revenue_weight || 0;
      
      const courseDetails = myCourses.find(c => c.id === pc.course_id);
      if (courseDetails) {
        pathEntry.courses.push({
          courseId: courseDetails.id,
          title: courseDetails.title,
          revenueWeight: pc.revenue_weight,
        });
      }
    }

    return Array.from(pathsMap.values());
  }
}
