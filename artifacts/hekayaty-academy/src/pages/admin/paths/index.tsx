import { useState, useEffect } from "react";
import { PageTransition } from "@/components/ui/PageTransition";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  Plus, Search, Eye, Edit2, Trash2, Loader2, BookOpen,
  Users, Star, BarChart3, RefreshCw, ChevronRight, Globe, Archive
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import NotFound from "@/pages/not-found";

function useAdminPaths() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const refetch = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("hekayaty-token");
      const res = await fetch("/api/admin/paths", { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setData(await res.json());
    } finally { setLoading(false); }
  };
  useEffect(() => { refetch(); }, []);
  return { data, loading, refetch };
}

async function adminAction(method: string, endpoint: string, body?: any) {
  const token = localStorage.getItem("hekayaty-token");
  const res = await fetch(`/api${endpoint}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft: { label: "مسودة", color: "bg-gray-500/10 text-gray-500 border-gray-500/20" },
  published: { label: "منشور", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  archived: { label: "مؤرشف", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
};

export default function AdminPathsPage() {
  const { role } = useAuth();
  const [, navigate] = useLocation();
  const { data: paths, loading, refetch } = useAdminPaths();
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  if (role !== "admin" && role !== "superadmin") return <NotFound />;

  const filtered = paths.filter(p =>
    !search || p.title?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المسار؟")) return;
    setDeleting(id);
    try {
      await adminAction("DELETE", `/admin/paths/${id}`);
      refetch();
    } finally { setDeleting(null); }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await adminAction("PUT", `/admin/paths/${id}`, { status });
      refetch();
    } catch (e) { console.error(e); }
  };

  return (
    <PageTransition dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">المسارات التعليمية</h1>
          <p className="text-muted-foreground mt-1">إنشاء وإدارة مسارات تعليمية متكاملة</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2" onClick={refetch}>
            <RefreshCw className="w-4 h-4" /> تحديث
          </Button>
          <Button size="sm" className="gap-2" onClick={() => navigate("/admin/paths/new")}>
            <Plus className="w-4 h-4" /> مسار جديد
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "إجمالي المسارات", value: paths.length, icon: Star, color: "text-primary" },
          { label: "منشور", value: paths.filter(p => p.status === "published").length, icon: Globe, color: "text-emerald-600" },
          { label: "مسودة", value: paths.filter(p => p.status === "draft").length, icon: Edit2, color: "text-gray-500" },
          { label: "مؤرشف", value: paths.filter(p => p.status === "archived").length, icon: Archive, color: "text-amber-600" },
        ].map(stat => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <stat.icon className={`w-8 h-8 ${stat.color}`} />
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="بحث بالعنوان..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pr-10"
        />
      </div>

      {/* Paths Grid */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Star className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="font-medium">لا توجد مسارات بعد</p>
          <Button className="mt-4 gap-2" onClick={() => navigate("/admin/paths/new")}>
            <Plus className="w-4 h-4" /> أنشئ أول مسار
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((path, i) => {
            const s = STATUS_LABELS[path.status] || STATUS_LABELS.draft;
            return (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-200"
              >
                {/* Thumbnail */}
                <div className="relative h-36 bg-muted overflow-hidden">
                  {path.thumbnailUrl ? (
                    <img src={path.thumbnailUrl} alt={path.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                      <Star className="w-10 h-10 text-primary/40" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <Badge variant="outline" className={`text-xs ${s.color}`}>{s.label}</Badge>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-foreground mb-1 truncate">{path.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{path.coursesCount ?? 0} كورس</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{path.studentsCount ?? 0} طالب</span>
                    <span className="font-semibold text-primary">{path.regularPrice ?? 0} ج.م</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm" variant="outline" className="flex-1 gap-1.5 text-xs"
                      onClick={() => navigate(`/admin/paths/${path.id}`)}
                    >
                      <Edit2 className="w-3.5 h-3.5" /> تعديل
                    </Button>
                    <Button
                      size="sm" variant="outline"
                      className={`text-xs px-2 ${path.status === "published" ? "text-amber-600 border-amber-500/30" : "text-emerald-600 border-emerald-500/30"}`}
                      onClick={() => handleStatusChange(path.id, path.status === "published" ? "draft" : "published")}
                    >
                      {path.status === "published" ? "إخفاء" : "نشر"}
                    </Button>
                    <Button
                      size="sm" variant="ghost"
                      className="text-destructive px-2"
                      disabled={deleting === path.id}
                      onClick={() => handleDelete(path.id)}
                    >
                      {deleting === path.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </PageTransition>
  );
}
