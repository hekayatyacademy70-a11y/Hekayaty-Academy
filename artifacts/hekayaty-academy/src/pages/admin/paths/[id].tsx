import { useState, useEffect, useCallback } from "react";
import { PageTransition } from "@/components/ui/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  ArrowRight, Save, Plus, Trash2, GripVertical, Loader2,
  BookOpen, Search, Info, BarChart3, ToggleLeft, ToggleRight, ChevronDown, ChevronUp
} from "lucide-react";
import { Link, useLocation, useParams } from "wouter";
import { useAuth } from "@/context/AuthContext";
import NotFound from "@/pages/not-found";

const SKILL_LEVELS = [
  { value: "beginner", label: "مبتدئ" },
  { value: "intermediate", label: "متوسط" },
  { value: "advanced", label: "متقدم" },
  { value: "kids", label: "أطفال 🧒" },
];
const STATUS_OPTIONS = [
  { value: "draft", label: "مسودة" },
  { value: "published", label: "منشور" },
  { value: "archived", label: "مؤرشف" },
];

async function apiCall(method: string, endpoint: string, body?: any) {
  const token = localStorage.getItem("hekayaty-token");
  const res = await fetch(`/api${endpoint}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export default function AdminPathBuilderPage() {
  const { role } = useAuth();
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const isNew = params.id === "new";

  // ─── Form State ───────────────────────────────
  const [form, setForm] = useState({
    title: "", slug: "", shortDescription: "", fullDescription: "",
    thumbnailUrl: "", bannerUrl: "", skillLevel: "beginner",
    totalHours: 0, regularPrice: 0, discountPrice: "", status: "draft",
  });
  const [activeTab, setActiveTab] = useState<"info" | "courses" | "revenue">("info");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [pathId, setPathId] = useState<string | null>(isNew ? null : params.id);

  // ─── Courses State ────────────────────────────
  const [pathCourses, setPathCourses] = useState<any[]>([]);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [courseSearch, setCourseSearch] = useState("");
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  // Load existing path
  useEffect(() => {
    if (!isNew && params.id) {
      setLoading(true);
      apiCall("GET", `/admin/paths/${params.id}`)
        .then(data => {
          setForm({
            title: data.title || "",
            slug: data.slug || "",
            shortDescription: data.shortDescription || "",
            fullDescription: data.fullDescription || "",
            thumbnailUrl: data.thumbnailUrl || "",
            bannerUrl: data.bannerUrl || "",
            skillLevel: data.skillLevel || "beginner",
            totalHours: data.totalHours || 0,
            regularPrice: data.regularPrice || 0,
            discountPrice: data.discountPrice || "",
            status: data.status || "draft",
          });
          setPathCourses(data.courses || []);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [params.id, isNew]);

  // Load all courses for picker
  useEffect(() => {
    if (activeTab === "courses") {
      setLoadingCourses(true);
      apiCall("GET", "/admin/courses")
        .then(data => setAllCourses(data.courses || []))
        .catch(console.error)
        .finally(() => setLoadingCourses(false));
    }
  }, [activeTab]);

  const handleTitleChange = (val: string) => {
    setForm(f => ({
      ...f,
      title: val,
      slug: val.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, ""),
    }));
  };

  const handleSaveInfo = async () => {
    setSaving(true);
    try {
      if (isNew || !pathId) {
        const created = await apiCall("POST", "/admin/paths", form);
        setPathId(created.id);
        navigate(`/admin/paths/${created.id}`, { replace: true });
      } else {
        await apiCall("PUT", `/admin/paths/${pathId}`, form);
      }
      setActiveTab("courses");
    } catch (e) {
      console.error(e);
      alert("فشل الحفظ");
    } finally { setSaving(false); }
  };

  const handleSaveCourses = async () => {
    if (!pathId) { alert("احفظ المعلومات الأساسية أولاً"); return; }
    setSaving(true);
    try {
      await apiCall("PUT", `/admin/paths/${pathId}/courses`, {
        courses: pathCourses.map((c, i) => ({
          courseId: c.courseId,
          orderIndex: i,
          revenueWeight: c.revenueWeight || 0,
          requirePrevious: c.requirePrevious || false,
        })),
      });
      setActiveTab("revenue");
    } catch (e) {
      alert("فشل حفظ الكورسات");
    } finally { setSaving(false); }
  };

  const addCourse = (course: any) => {
    if (pathCourses.find(c => c.courseId === course.id)) return;
    setPathCourses(prev => [...prev, {
      courseId: course.id,
      title: course.title,
      thumbnailUrl: course.thumbnailUrl,
      instructorName: course.instructor?.name || "",
      orderIndex: prev.length,
      revenueWeight: 0,
      requirePrevious: false,
    }]);
  };

  const removeCourse = (idx: number) => setPathCourses(prev => prev.filter((_, i) => i !== idx));

  const moveCourse = (from: number, to: number) => {
    if (to < 0 || to >= pathCourses.length) return;
    const next = [...pathCourses];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setPathCourses(next);
  };

  const totalWeight = pathCourses.reduce((sum, c) => sum + (Number(c.revenueWeight) || 0), 0);

  const availableCourses = allCourses.filter(
    c => !pathCourses.find(pc => pc.courseId === c.id) &&
      (!courseSearch || c.title?.toLowerCase().includes(courseSearch.toLowerCase()))
  );

  if (role !== "admin" && role !== "superadmin") return <NotFound />;
  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  return (
    <PageTransition dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/paths")}>
          <ArrowRight className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold font-serif">
            {isNew ? "مسار تعليمي جديد" : `تعديل: ${form.title}`}
          </h1>
          <p className="text-sm text-muted-foreground">اتبع الخطوات لإنشاء المسار</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mb-8 gap-1">
        {[
          { key: "info", label: "المعلومات الأساسية", icon: Info },
          { key: "courses", label: "اختيار الكورسات", icon: BookOpen },
          { key: "revenue", label: "توزيع الإيرادات", icon: BarChart3 },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* ─── Tab: Info ─────────────────────────────── */}
      {activeTab === "info" && (
        <div className="max-w-2xl space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">عنوان المسار *</label>
              <Input value={form.title} onChange={e => handleTitleChange(e.target.value)} placeholder="مسار كتابة الرواية" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Slug *</label>
              <Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="novel-writing-path" dir="ltr" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">وصف مختصر</label>
            <Input value={form.shortDescription} onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))} placeholder="وصف سريع يظهر في قوائم المسارات" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">وصف تفصيلي</label>
            <textarea
              value={form.fullDescription}
              onChange={e => setForm(f => ({ ...f, fullDescription: e.target.value }))}
              rows={4}
              placeholder="شرح كامل للمسار ومحتوياته..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">رابط الصورة المصغرة</label>
              <Input value={form.thumbnailUrl} onChange={e => setForm(f => ({ ...f, thumbnailUrl: e.target.value }))} placeholder="https://..." dir="ltr" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">رابط البانر الترويجي</label>
              <Input value={form.bannerUrl} onChange={e => setForm(f => ({ ...f, bannerUrl: e.target.value }))} placeholder="https://..." dir="ltr" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">المستوى</label>
              <select
                value={form.skillLevel}
                onChange={e => setForm(f => ({ ...f, skillLevel: e.target.value }))}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {SKILL_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">السعر الأساسي (ج.م)</label>
              <Input type="number" value={form.regularPrice} onChange={e => setForm(f => ({ ...f, regularPrice: Number(e.target.value) }))} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">سعر الخصم (اختياري)</label>
              <Input type="number" value={form.discountPrice} onChange={e => setForm(f => ({ ...f, discountPrice: e.target.value }))} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">الحالة</label>
            <select
              value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          <Button className="gap-2" onClick={handleSaveInfo} disabled={saving || !form.title}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            حفظ والتالي
          </Button>
        </div>
      )}

      {/* ─── Tab: Courses ──────────────────────────── */}
      {activeTab === "courses" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Course Picker */}
          <div>
            <h2 className="font-bold mb-4 text-lg">الكورسات المتاحة</h2>
            <div className="relative mb-3">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={courseSearch} onChange={e => setCourseSearch(e.target.value)} placeholder="بحث..." className="pr-10" />
            </div>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {loadingCourses ? (
                <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
              ) : availableCourses.map(course => (
                <div
                  key={course.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => addCourse(course)}
                >
                  <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0">
                    {course.thumbnailUrl
                      ? <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                      : <BookOpen className="w-5 h-5 m-auto mt-3.5 text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{course.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{course.instructor?.name}</p>
                  </div>
                  <Plus className="w-4 h-4 text-primary shrink-0" />
                </div>
              ))}
              {!loadingCourses && availableCourses.length === 0 && (
                <p className="text-center text-muted-foreground text-sm py-6">لا توجد كورسات متاحة</p>
              )}
            </div>
          </div>

          {/* Right: Path Courses */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">كورسات المسار ({pathCourses.length})</h2>
              <Button size="sm" className="gap-2" onClick={handleSaveCourses} disabled={saving}>
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                حفظ التسلسل
              </Button>
            </div>

            {pathCourses.length === 0 ? (
              <div className="border-2 border-dashed border-border rounded-xl h-48 flex flex-col items-center justify-center text-muted-foreground">
                <BookOpen className="w-8 h-8 mb-2 opacity-30" />
                <p className="text-sm">أضف كورسات من القائمة على اليسار</p>
              </div>
            ) : (
              <div className="space-y-2">
                {pathCourses.map((course, idx) => (
                  <motion.div
                    key={course.courseId}
                    layout
                    className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card"
                  >
                    <div className="flex flex-col gap-1 shrink-0">
                      <button onClick={() => moveCourse(idx, idx - 1)} className="text-muted-foreground hover:text-foreground disabled:opacity-30" disabled={idx === 0}>
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <span className="text-xs text-center font-bold text-primary">{idx + 1}</span>
                      <button onClick={() => moveCourse(idx, idx + 1)} className="text-muted-foreground hover:text-foreground disabled:opacity-30" disabled={idx === pathCourses.length - 1}>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="w-10 h-10 rounded-md bg-muted overflow-hidden shrink-0">
                      {course.thumbnailUrl
                        ? <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                        : <BookOpen className="w-4 h-4 m-auto mt-3 text-muted-foreground" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{course.title}</p>
                      <p className="text-xs text-muted-foreground">{course.instructorName}</p>
                    </div>
                    <button
                      onClick={() => setPathCourses(prev => prev.map((c, i) => i === idx ? { ...c, requirePrevious: !c.requirePrevious } : c))}
                      title="إلزام بإكمال السابق"
                    >
                      {course.requirePrevious
                        ? <ToggleRight className="w-5 h-5 text-primary" />
                        : <ToggleLeft className="w-5 h-5 text-muted-foreground" />}
                    </button>
                    <button onClick={() => removeCourse(idx)} className="text-destructive hover:text-destructive/70">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Tab: Revenue ──────────────────────────── */}
      {activeTab === "revenue" && (
        <div className="max-w-2xl">
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 text-sm">
            <p className="font-semibold text-primary mb-1">نظام توزيع الإيرادات</p>
            <p className="text-muted-foreground">الأكاديمية تحتفظ بـ 30% من كل عملية بيع. الـ 70% المتبقية تُوزَّع على المدربين بناءً على الأوزان المحددة أدناه.</p>
          </div>

          <div className={`mb-4 flex items-center gap-2 text-sm font-medium ${Math.abs(totalWeight - 100) < 0.1 ? "text-emerald-600" : "text-amber-600"}`}>
            <span>إجمالي الأوزان: {totalWeight}%</span>
            {Math.abs(totalWeight - 100) > 0.1 && <span>(يجب أن يساوي 100%)</span>}
          </div>

          <div className="space-y-3">
            {pathCourses.map((course, idx) => (
              <div key={course.courseId} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
                <span className="text-sm font-bold text-primary w-6 text-center">{idx + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{course.title}</p>
                  <p className="text-xs text-muted-foreground">{course.instructorName}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={course.revenueWeight}
                    onChange={e => setPathCourses(prev => prev.map((c, i) => i === idx ? { ...c, revenueWeight: Number(e.target.value) } : c))}
                    className="w-20 text-center"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
              </div>
            ))}
          </div>

          {pathCourses.length === 0 && (
            <p className="text-center text-muted-foreground py-8">لا توجد كورسات مضافة. ارجع إلى تبويب "اختيار الكورسات".</p>
          )}

          <Button
            className="mt-6 gap-2"
            onClick={handleSaveCourses}
            disabled={saving || Math.abs(totalWeight - 100) > 0.1 && pathCourses.length > 0}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            حفظ التوزيع وإنهاء
          </Button>
        </div>
      )}
    </PageTransition>
  );
}
