import { supabase } from "../lib/supabase";

export class AdminService {
  async listUsers({ limit = 50, offset = 0 }: { limit?: number; offset?: number }) {
    const { data: users, count, error } = await supabase
      .from("users")
      .select("id, email, name, role, subscription_tier, is_suspended, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(`Failed to list users: ${error.message}`);

    return {
      users: (users || []).map((u: any) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        subscriptionTier: u.subscription_tier,
        isSuspended: u.is_suspended,
        createdAt: u.created_at,
      })),
      total: count ?? 0,
    };
  }

  async updateUserRole(userId: string, role: string) {
    // 1. Update the public.users table
    const { error: dbError } = await supabase
      .from("users")
      .update({ role, updated_at: new Date().toISOString() })
      .eq("id", userId);

    if (dbError) throw new Error(`Failed to update role in DB: ${dbError.message}`);

    // 2. Sync with Supabase Auth metadata so the JWT claims and Auth dashboard reflect the change
    const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { role }
    });

    if (authError) {
      console.warn(`Warning: Failed to sync role to Auth metadata: ${authError.message}`);
      // We don't throw here because the DB update succeeded, but we log the warning.
    }

    return { id: userId, role };
  }

  async suspendUser(userId: string, suspend: boolean) {
    const { error } = await supabase
      .from("users")
      .update({ is_suspended: suspend, updated_at: new Date().toISOString() })
      .eq("id", userId);

    if (error) throw new Error(`Failed to suspend user: ${error.message}`);
    return { id: userId, isSuspended: suspend };
  }

  async getPendingCourses() {
    const { data, error } = await supabase
      .from("courses")
      .select(`
        id, title, description, thumbnail_url, price, level, status, instructor_id, created_at,
        users!courses_instructor_id_fkey (name, email)
      `)
      .eq("status", "pending_review")
      .order("created_at", { ascending: false });

    if (error) throw new Error(`Failed to get pending courses: ${error.message}`);

    return (data || []).map((c: any) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      thumbnailUrl: c.thumbnail_url,
      price: c.price,
      level: c.level,
      status: c.status,
      instructorId: c.instructor_id,
      createdAt: c.created_at,
      instructor: { name: c.users?.name, email: c.users?.email },
    }));
  }

  async approveCourse(courseId: string) {
    const { error } = await supabase
      .from("courses")
      .update({ status: "published", updated_at: new Date().toISOString() })
      .eq("id", courseId);

    if (error) throw new Error(`Failed to approve course: ${error.message}`);
    return { id: courseId, status: "published" };
  }

  async rejectCourse(courseId: string) {
    const { error } = await supabase
      .from("courses")
      .update({ status: "rejected", updated_at: new Date().toISOString() })
      .eq("id", courseId);

    if (error) throw new Error(`Failed to reject course: ${error.message}`);
    return { id: courseId, status: "rejected" };
  }

  async listAllCourses({ limit = 50, offset = 0 }: { limit?: number; offset?: number }) {
    const { data, count, error } = await supabase
      .from("courses")
      .select(`
        id, title, status, price, level, created_at,
        users!courses_instructor_id_fkey (name)
      `, { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(`Failed to list courses: ${error.message}`);

    return {
      courses: (data || []).map((c: any) => ({
        id: c.id,
        title: c.title,
        status: c.status,
        price: c.price,
        level: c.level,
        createdAt: c.created_at,
        instructor: { name: c.users?.name },
      })),
      total: count ?? 0,
    };
  }

  async getPlatformStats() {
    const [
      { count: totalUsers },
      { count: totalCourses },
      { count: totalEnrollments },
      { count: recentSignups },
    ] = await Promise.all([
      supabase.from("users").select("*", { count: "exact", head: true }),
      supabase.from("courses").select("*", { count: "exact", head: true }),
      supabase.from("enrollments").select("*", { count: "exact", head: true }),
      supabase.from("users").select("*", { count: "exact", head: true })
        .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
    ]);

    // Status counts
    const { data: statusData } = await supabase
      .from("courses")
      .select("status");

    const statusMap: Record<string, number> = {};
    (statusData || []).forEach((c: any) => {
      statusMap[c.status] = (statusMap[c.status] || 0) + 1;
    });

    // Role counts
    const { data: roleData } = await supabase
      .from("users")
      .select("role");

    const roleBreakdown = Object.entries(
      (roleData || []).reduce((acc: any, u: any) => {
        acc[u.role] = (acc[u.role] || 0) + 1;
        return acc;
      }, {})
    ).map(([role, count]) => ({ role, count }));

    // Revenue from wallets
    const { data: wallets } = await supabase
      .from("instructor_wallets")
      .select("lifetime_earnings");

    const totalRevenue = (wallets || []).reduce((sum: number, w: any) => sum + (w.lifetime_earnings || 0), 0);
    const platformShare = Math.round(totalRevenue * 0.30 / 0.70); // back-calculate platform share

    return {
      users: {
        total: totalUsers ?? 0,
        recentSignups: recentSignups ?? 0,
        byRole: roleBreakdown,
      },
      courses: {
        total: totalCourses ?? 0,
        published: statusMap["published"] ?? 0,
        pending: statusMap["pending_review"] ?? 0,
        rejected: statusMap["rejected"] ?? 0,
        draft: statusMap["draft"] ?? 0,
      },
      enrollments: { total: totalEnrollments ?? 0 },
      revenue: {
        total: totalRevenue + platformShare,
        platformShare,
        instructorShare: totalRevenue,
      },
    };
  }
}
