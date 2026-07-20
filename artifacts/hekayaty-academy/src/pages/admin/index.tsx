import { useState, useEffect } from "react";
import { PageTransition } from "@/components/ui/PageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Users, BookOpen, TrendingUp, ShieldAlert, CheckCircle2, XCircle,
  Search, Eye, RefreshCw, DollarSign, Clock, BarChart3, Award,
  ChevronRight, Loader2, AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Link, useLocation } from "wouter";
import NotFound from "@/pages/not-found";

// ─────────────────────────────────────────────
// API HOOKS (raw fetch, admin-only)
// ─────────────────────────────────────────────
function useAdminData<T>(endpoint: string, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("hekayaty-token");
      const res = await fetch(`/api${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, deps);
  return { data, loading, error, refetch: fetchData };
}

async function adminAction(method: string, endpoint: string, body?: any) {
  const token = localStorage.getItem("hekayaty-token");
  const res = await fetch(`/api${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ─────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: any; label: string; value: string | number; sub?: string; color: string;
}) {
  return (
    <Card className="border-border bg-card hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{label}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────
// PENDING COURSES TAB
// ─────────────────────────────────────────────
function PendingCoursesTab() {
  const { data, loading, error, refetch } = useAdminData<{ courses: any[] }>("/admin/courses/pending");
  const [acting, setActing] = useState<string | null>(null);

  const handleAction = async (courseId: string, action: "approve" | "reject") => {
    setActing(courseId);
    try {
      await adminAction("PUT", `/admin/courses/${courseId}/${action}`);
      refetch();
    } catch (e) {
      console.error(e);
    } finally {
      setActing(null);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (error) return <div className="text-center py-12 text-destructive">{error}</div>;

  const courses = data?.courses ?? [];

  return (
    <div className="space-y-4">
      {courses.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">لا توجد دورات بانتظار المراجعة</p>
        </div>
      ) : (
        courses.map((course: any) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors"
          >
            <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
              {course.thumbnailUrl
                ? <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                : <BookOpen className="w-6 h-6 text-muted-foreground" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate">{course.title}</p>
              <p className="text-sm text-muted-foreground truncate">
                {course.instructor?.name} · {course.price > 0 ? `${course.price} ج.م` : "مجاني"}
              </p>
            </div>
            <Badge variant="outline" className="shrink-0 text-amber-600 border-amber-500/30 bg-amber-500/10">
              <Clock className="w-3 h-3 ml-1" /> بانتظار المراجعة
            </Badge>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
                onClick={() => handleAction(course.id, "approve")}
                disabled={acting === course.id}
              >
                {acting === course.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                قبول
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10"
                onClick={() => handleAction(course.id, "reject")}
                disabled={acting === course.id}
              >
                <XCircle className="w-3.5 h-3.5" />
                رفض
              </Button>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// USERS TAB
// ─────────────────────────────────────────────
function UsersTab() {
  const { data, loading, error, refetch } = useAdminData<{ users: any[]; total: number }>("/admin/users");
  const [search, setSearch] = useState("");
  const [acting, setActing] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, role: string) => {
    setActing(userId);
    try {
      await adminAction("PUT", `/admin/users/${userId}/role`, { role });
      refetch();
    } catch (e) { console.error(e); }
    finally { setActing(null); }
  };

  const handleSuspend = async (userId: string, suspend: boolean) => {
    setActing(userId);
    try {
      await adminAction("PUT", `/admin/users/${userId}/suspend`, { suspend });
      refetch();
    } catch (e) { console.error(e); }
    finally { setActing(null); }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (error) return <div className="text-center py-12 text-destructive">{error}</div>;

  const users = (data?.users ?? []).filter((u: any) =>
    !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const roleColors: Record<string, string> = {
    student: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    instructor: "bg-violet-500/10 text-violet-600 border-violet-500/20",
    admin: "bg-red-500/10 text-red-600 border-red-500/20",
    superadmin: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    reviewer: "bg-teal-500/10 text-teal-600 border-teal-500/20",
    parent: "bg-green-500/10 text-green-600 border-green-500/20",
    guest: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="بحث بالاسم أو البريد..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-10"
          />
        </div>
        <p className="text-sm text-muted-foreground">{data?.total ?? 0} مستخدم</p>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-right px-4 py-3 font-semibold text-muted-foreground">المستخدم</th>
              <th className="text-right px-4 py-3 font-semibold text-muted-foreground">الدور</th>
              <th className="text-right px-4 py-3 font-semibold text-muted-foreground">الباقة</th>
              <th className="text-right px-4 py-3 font-semibold text-muted-foreground">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any, idx: number) => (
              <tr key={user.id} className={`border-b border-border last:border-0 ${idx % 2 === 0 ? '' : 'bg-muted/20'}`}>
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Select
                    value={user.role}
                    onValueChange={(role) => handleRoleChange(user.id, role)}
                    disabled={acting === user.id}
                  >
                    <SelectTrigger className="h-7 w-32 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["student", "instructor", "reviewer", "parent", "admin", "superadmin"].map((r) => (
                        <SelectItem key={r} value={r} className="text-xs">{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className="text-xs">{user.subscriptionTier}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className={`text-xs h-7 px-2 ${user.isSuspended ? 'text-emerald-600 border-emerald-500/30' : 'text-destructive border-destructive/30'}`}
                    onClick={() => handleSuspend(user.id, !user.isSuspended)}
                    disabled={acting === user.id}
                  >
                    {acting === user.id ? <Loader2 className="w-3 h-3 animate-spin" /> : user.isSuspended ? "إلغاء الإيقاف" : "إيقاف"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN ADMIN PAGE
// ─────────────────────────────────────────────
type AdminTab = "overview" | "courses" | "users";

export default function AdminDashboard() {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const { data: stats, loading: statsLoading, refetch: refetchStats } =
    useAdminData<any>("/admin/stats");

  // Guard: only admins can see this
  if (role !== "admin" && role !== "superadmin") {
    return <NotFound />;
  }

  const tabs: { key: AdminTab; label: string; icon: any }[] = [
    { key: "overview", label: "نظرة عامة", icon: BarChart3 },
    { key: "courses", label: "مراجعة الدورات", icon: BookOpen },
    { key: "users", label: "إدارة المستخدمين", icon: Users },
  ];

  return (
    <PageTransition dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">لوحة الإدارة</h1>
          <p className="text-muted-foreground mt-1">مركز التحكم في المنصة</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={refetchStats}>
          <RefreshCw className="w-4 h-4" />
          تحديث
        </Button>
      </div>

      {/* Stats Overview */}
      {activeTab === "overview" && (
        <>
          {statsLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : stats ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                icon={Users}
                label="إجمالي المستخدمين"
                value={stats.users?.total?.toLocaleString() ?? 0}
                sub={`+${stats.users?.recentSignups ?? 0} هذا الشهر`}
                color="bg-blue-500/10 text-blue-600"
              />
              <StatCard
                icon={BookOpen}
                label="الدورات المنشورة"
                value={stats.courses?.published ?? 0}
                sub={`${stats.courses?.pending ?? 0} بانتظار المراجعة`}
                color="bg-violet-500/10 text-violet-600"
              />
              <StatCard
                icon={TrendingUp}
                label="إجمالي التسجيلات"
                value={stats.enrollments?.total?.toLocaleString() ?? 0}
                color="bg-emerald-500/10 text-emerald-600"
              />
              <StatCard
                icon={DollarSign}
                label="حصة المنصة"
                value={`${stats.revenue?.platformShare?.toLocaleString() ?? 0} ج.م`}
                sub={`إجمالي: ${stats.revenue?.total?.toLocaleString() ?? 0} ج.م`}
                color="bg-amber-500/10 text-amber-600"
              />
            </div>
          ) : null}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  الدورات بانتظار المراجعة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-foreground mb-1">{stats?.courses?.pending ?? "—"}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 mt-3"
                  onClick={() => setActiveTab("courses")}
                >
                  مراجعة الدورات <ChevronRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  توزيع المستخدمين حسب الدور
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(stats?.users?.byRole ?? []).map((item: any) => (
                    <div key={item.role} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground capitalize">{item.role}</span>
                      <Badge variant="outline">{item.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Tabs */}
      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <div className="flex border-b border-border bg-muted/30">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-colors duration-150
                ${activeTab === tab.key
                  ? "border-primary text-primary bg-background"
                  : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="text-center py-8 text-muted-foreground">
              <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>اختر تبويباً للبدء في الإدارة</p>
            </div>
          )}
          {activeTab === "courses" && <PendingCoursesTab />}
          {activeTab === "users" && <UsersTab />}
        </div>
      </div>
    </PageTransition>
  );
}
