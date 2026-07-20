import { useState, useMemo } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  useGetMyInstructorCourses, 
  useGetMyInstructorStats,
  useGetMyInstructorStudents,
  useGetMyInstructorAssignments,
  useCreateAssignment,
  useGetMyInstructorCertificates,
  useGetMyInstructorAnnouncements,
  useCreateAnnouncement,
  useDeleteInstructorCourse,
  InstructorStudent
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  BookOpen, Users, Award, Megaphone, PlusCircle, Search,
  Eye, Pencil, Trash2, Globe, Archive, Loader2, Star,
  CheckCircle2, Clock, TrendingUp, X, Send, Bell,
  FileText, ChevronDown, BarChart2, GraduationCap, Filter,
  AlertTriangle, Trophy, BookMarked, CalendarDays, MessageSquare,
  Download, Settings, ArrowUpRight, MoreHorizontal, Layout
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────
type TabKey = "courses" | "students" | "assignments" | "certificates" | "announcements";



interface MockAssignment {
  id: string; title: string; description: string; dueDate: string;
  maxScore: number; courseId: string; submissions: number; pending: number;
  averageScore: number; status: "published" | "draft";
}

interface MockAnnouncement {
  id: string; title: string; content: string; courseId: string;
  priority: "normal" | "important" | "urgent"; publishedAt: string;
  readCount: number; status: "published" | "draft";
}

// ─── Real Data Types From Client ──────────────────────────────
// The types MockStudent, MockAssignment, MockAnnouncement are still defined above and match the API types.
// We remove the static mock arrays.

// ─── Helper Components ────────────────────────────────────────
const priorityConfig: Record<string, { label: string; color: string }> = {
  normal: { label: "عادي", color: "bg-slate-500/15 text-slate-600 border-slate-500/30" },
  important: { label: "مهم", color: "bg-amber-500/15 text-amber-600 border-amber-500/30" },
  urgent: { label: "عاجل", color: "bg-red-500/15 text-red-600 border-red-500/30" },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  published: { label: "منشور", color: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" },
  draft: { label: "مسودة", color: "bg-slate-500/15 text-slate-600 border-slate-500/30" },
  pending: { label: "قيد المراجعة", color: "bg-amber-500/15 text-amber-600 border-amber-500/30" },
  archived: { label: "مؤرشف", color: "bg-stone-500/15 text-stone-600 border-stone-500/30" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? statusConfig.draft;
  return <Badge variant="outline" className={`text-xs ${cfg.color}`}>{cfg.label}</Badge>;
}

function StatOverviewCard({ icon: Icon, label, value, trend, color }: {
  icon: any; label: string; value: string | number; trend?: string; color: string;
}) {
  return (
    <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 300 }}>
      <Card className="border-border/50 hover:shadow-md transition-shadow h-full">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            {trend && (
              <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                <ArrowUpRight className="w-3 h-3" />{trend}
              </span>
            )}
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function InstructorCoursesPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabKey>("courses");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [searchCourses, setSearchCourses] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<InstructorStudent | null>(null);
  const [searchStudents, setSearchStudents] = useState("");
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Assignment form
  const [assignTitle, setAssignTitle] = useState("");
  const [assignDesc, setAssignDesc] = useState("");
  const [assignDue, setAssignDue] = useState("");
  const [assignScore, setAssignScore] = useState("100");
  const [assignCourseId, setAssignCourseId] = useState("");

  // Announcement form
  const [annTitle, setAnnTitle] = useState("");
  const [annContent, setAnnContent] = useState("");
  const [annPriority, setAnnPriority] = useState<"normal" | "important" | "urgent">("normal");
  const [annCourseId, setAnnCourseId] = useState("");

  const queryClient = useQueryClient();
  const { data: courses = [], isLoading: coursesLoading } = useGetMyInstructorCourses();
  const { data: stats } = useGetMyInstructorStats();
  const { data: studentsData = [] } = useGetMyInstructorStudents();
  const { data: assignmentsData = [] } = useGetMyInstructorAssignments();
  const { data: certificatesData = [] } = useGetMyInstructorCertificates();
  const { data: announcementsData = [] } = useGetMyInstructorAnnouncements();

  const createAssignment = useCreateAssignment();
  const createAnnouncement = useCreateAnnouncement();
  const deleteCourse = useDeleteInstructorCourse();

  const filteredCourses = useMemo(() =>
    courses.filter((c: any) => {
      const matchSearch = c.title?.toLowerCase().includes(searchCourses.toLowerCase());
      const matchStatus = filterStatus === "all" || c.status === filterStatus;
      return matchSearch && matchStatus;
    }),
    [courses, searchCourses, filterStatus]
  );

  const selectedCourse = useMemo(() =>
    courses.find((c: any) => c.id === selectedCourseId),
    [courses, selectedCourseId]
  );

  const filteredStudents = useMemo(() =>
    studentsData.filter((s: any) => {
      const matchSearch = s.name.toLowerCase().includes(searchStudents.toLowerCase()) ||
        s.email.toLowerCase().includes(searchStudents.toLowerCase());
      const matchCourse = selectedCourseId ? s.courseId === selectedCourseId : true;
      return matchSearch && matchCourse;
    }),
    [studentsData, searchStudents, selectedCourseId]
  );

  const handleDeleteCourse = async (id: string) => {
    try {
      await deleteCourse.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: ["/api/me/instructor-courses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/me/instructor-stats"] });
      setDeleteConfirm(null);
      toast({ title: "✅ تم الحذف", description: "تم حذف الدورة بنجاح" });
    } catch (err: any) {
      toast({ title: "خطأ", description: err?.message || "فشل حذف الدورة", variant: "destructive" });
    }
  };

  const handlePublishAssignment = async () => {
    if (!assignTitle.trim()) { toast({ title: "خطأ", description: "أدخل عنوان الواجب", variant: "destructive" }); return; }
    if (!assignCourseId) { toast({ title: "خطأ", description: "اختر الدورة", variant: "destructive" }); return; }
    
    try {
      await createAssignment.mutateAsync({
        data: {
          title: assignTitle,
          description: assignDesc,
          courseId: assignCourseId,
          dueDate: assignDue || undefined,
          maxScore: parseInt(assignScore) || 100,
          status: "published"
        }
      });
      queryClient.invalidateQueries({ queryKey: ["getMyInstructorAssignments"] });
      setShowAssignmentModal(false);
      setAssignTitle(""); setAssignDesc(""); setAssignDue(""); setAssignScore("100"); setAssignCourseId("");
      toast({ title: "✅ تم النشر", description: "تم نشر الواجب بنجاح" });
    } catch (err) {
      toast({ title: "خطأ", description: "فشل إنشاء الواجب", variant: "destructive" });
    }
  };

  const handleSendAnnouncement = async () => {
    if (!annTitle.trim() || !annContent.trim()) { toast({ title: "خطأ", description: "أدخل العنوان والمحتوى", variant: "destructive" }); return; }
    if (!annCourseId) { toast({ title: "خطأ", description: "اختر الدورة", variant: "destructive" }); return; }
    
    try {
      await createAnnouncement.mutateAsync({
        data: {
          title: annTitle,
          content: annContent,
          courseId: annCourseId,
          priority: annPriority,
        }
      });
      queryClient.invalidateQueries({ queryKey: ["getMyInstructorAnnouncements"] });
      setShowAnnouncementModal(false);
      setAnnTitle(""); setAnnContent(""); setAnnPriority("normal"); setAnnCourseId("");
      toast({ title: "✅ تم الإرسال", description: "تم إرسال الإعلان للطلاب" });
    } catch (err) {
      toast({ title: "خطأ", description: "فشل إرسال الإعلان", variant: "destructive" });
    }
  };

  const tabs: { key: TabKey; label: string; icon: any }[] = [
    { key: "courses", label: "إدارة الدورات", icon: BookOpen },
    { key: "students", label: "الطلاب", icon: Users },
    { key: "assignments", label: "الواجبات", icon: FileText },
    { key: "certificates", label: "الشهادات", icon: Award },
    { key: "announcements", label: "الإعلانات", icon: Megaphone },
  ];

  return (
    <PageTransition>
      {/* ── Page Header ───────────────────────────────── */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-serif mb-1">مركز إدارة الدورات</h1>
        <p className="text-muted-foreground">إدارة شاملة لكل جانب من جوانب تجربتك التعليمية</p>
      </div>

      {/* ── Stats Overview ────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatOverviewCard icon={BookOpen} label="إجمالي الدورات" value={stats?.totalCourses ?? 0} color="bg-primary/10 text-primary" />
        <StatOverviewCard icon={Globe} label="منشور" value={stats?.publishedCourses ?? 0} trend="+2 هذا الشهر" color="bg-emerald-500/10 text-emerald-600" />
        <StatOverviewCard icon={Users} label="إجمالي الطلاب" value={stats?.totalStudents ?? 0} trend="+12%" color="bg-blue-500/10 text-blue-600" />
        <StatOverviewCard icon={Trophy} label="المكتملون" value={studentsData.filter((s: any) => s.progress === 100).length} color="bg-amber-500/10 text-amber-600" />
        <StatOverviewCard icon={FileText} label="الواجبات" value={assignmentsData.length} color="bg-purple-500/10 text-purple-600" />
        <StatOverviewCard icon={Clock} label="بانتظار المراجعة" value={assignmentsData.reduce((a: any, b: any) => a + (b.pending || 0), 0)} color="bg-orange-500/10 text-orange-600" />
        <StatOverviewCard icon={Award} label="الشهادات الصادرة" value={certificatesData.length} color="bg-rose-500/10 text-rose-600" />
        <StatOverviewCard icon={Megaphone} label="الإعلانات" value={announcementsData.length} color="bg-teal-500/10 text-teal-600" />
      </div>

      {/* ── Tab Navigation ────────────────────────────── */}
      <div className="flex items-center gap-1 mb-6 border-b border-border overflow-x-auto pb-px">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg whitespace-nowrap transition-colors border-b-2 -mb-px ${
              activeTab === tab.key
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════════════ */}
      {/* SECTION 1 — COURSE MANAGEMENT                   */}
      {/* ════════════════════════════════════════════════ */}
      <AnimatePresence mode="wait">
        {activeTab === "courses" && (
          <motion.div key="courses" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="ابحث عن دورة..."
                  value={searchCourses}
                  onChange={e => setSearchCourses(e.target.value)}
                  className="pr-9"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 ml-2" />
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="published">منشور</SelectItem>
                  <SelectItem value="draft">مسودة</SelectItem>
                  <SelectItem value="pending">قيد المراجعة</SelectItem>
                </SelectContent>
              </Select>
              <Link href="/instructor/courses/new">
                <Button className="gap-2 shrink-0">
                  <PlusCircle className="w-4 h-4" />
                  دورة جديدة
                </Button>
              </Link>
            </div>

            {/* Course Table */}
            {coursesLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : filteredCourses.length === 0 ? (
              <Card className="py-20 text-center">
                <CardContent>
                  <BookOpen className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                  <p className="font-medium text-muted-foreground">لا توجد دورات</p>
                  <Link href="/instructor/courses/new">
                    <Button className="mt-4 gap-2"><PlusCircle className="w-4 h-4" />أنشئ أول دورة</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredCourses.map((course: any, idx: number) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                  >
                    <Card className="border-border/50 hover:shadow-md transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          {/* Thumbnail */}
                          <div className="w-20 h-14 rounded-lg bg-gradient-to-br from-amber-600 to-stone-800 overflow-hidden shrink-0">
                            {course.thumbnailUrl ? (
                              <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-white/60" />
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="font-bold truncate">{course.title}</h3>
                              <StatusBadge status={course.status} />
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                              <span className="flex items-center gap-1"><Users className="w-3 h-3" />{course.totalStudents} طالب</span>
                              <span className="flex items-center gap-1"><BookMarked className="w-3 h-3" />{course.totalLessons} درس</span>
                              <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{course.averageRating ?? "—"}</span>
                              <span className="flex items-center gap-1 font-semibold text-primary">{course.price} ج.م</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 shrink-0">
                            <Button
                              variant="outline" size="sm" className="gap-1.5 text-xs"
                              onClick={() => { setSelectedCourseId(course.id); setActiveTab("students"); }}
                            >
                              <Users className="w-3.5 h-3.5" />الطلاب
                            </Button>
                            <Link href={`/courses/${course.id}`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8" title="معاينة">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost" size="icon"
                              className="h-8 w-8 text-destructive hover:bg-destructive/10"
                              onClick={() => setDeleteConfirm(course.id)}
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════ */}
        {/* SECTION 2 — STUDENTS                            */}
        {/* ════════════════════════════════════════════════ */}
        {activeTab === "students" && (
          <motion.div key="students" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Course selector */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <Select value={selectedCourseId ?? "all"} onValueChange={v => setSelectedCourseId(v === "all" ? null : v)}>
                <SelectTrigger className="w-60">
                  <BookOpen className="w-4 h-4 ml-2" />
                  <SelectValue placeholder="اختر دورة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الدورات</SelectItem>
                  {courses.map((c: any) => (
                    <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="ابحث عن طالب..." value={searchStudents} onChange={e => setSearchStudents(e.target.value)} className="pr-9" />
              </div>
              <Button variant="outline" className="gap-2 shrink-0">
                <Download className="w-4 h-4" />تصدير
              </Button>
            </div>

            {/* Student stats mini-cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              {[
                { label: "إجمالي المسجلين", value: filteredStudents.length, color: "text-blue-600" },
                { label: "طلاب نشطون", value: filteredStudents.filter(s => s.progress > 0 && s.progress < 100).length, color: "text-emerald-600" },
                { label: "أكملوا الدورة", value: filteredStudents.filter(s => s.progress === 100).length, color: "text-primary" },
                { label: "غير نشطين", value: filteredStudents.filter(s => s.progress === 0).length, color: "text-muted-foreground" },
              ].map((item, i) => (
                <Card key={i} className="border-border/50">
                  <CardContent className="p-3 text-center">
                    <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Student List */}
            <div className="space-y-3">
              {filteredStudents.length === 0 ? (
                <Card className="py-16 text-center">
                  <CardContent><Users className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" /><p className="text-muted-foreground">لا يوجد طلاب</p></CardContent>
                </Card>
              ) : filteredStudents.map((student, idx) => (
                <motion.div key={student.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.04 }}>
                  <Card
                    className="border-border/50 hover:shadow-md cursor-pointer transition-all"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <img src={student.avatar || undefined} alt={student.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-sm">{student.name}</p>
                            {student.progress === 100 && (
                              <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/30">مكتمل</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{student.email}</p>
                          <div className="flex items-center gap-3">
                            <Progress value={student.progress} className="h-1.5 flex-1" />
                            <span className="text-xs font-bold text-primary shrink-0">{student.progress}%</span>
                          </div>
                        </div>
                        <div className="text-left shrink-0 hidden sm:block">
                          <p className="text-xs text-muted-foreground">{student.lessonsCompleted}/{student.totalLessons} درس</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{student.lastActivity}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                          <ChevronDown className="w-4 h-4 -rotate-90" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════ */}
        {/* SECTION 3 — ASSIGNMENTS                         */}
        {/* ════════════════════════════════════════════════ */}
        {activeTab === "assignments" && (
          <motion.div key="assignments" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg">إدارة الواجبات</h2>
              <Button className="gap-2" onClick={() => setShowAssignmentModal(true)}>
                <PlusCircle className="w-4 h-4" />واجب جديد
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { label: "إجمالي الواجبات", value: assignmentsData.length, color: "text-primary" },
                { label: "إجمالي التسليمات", value: assignmentsData.reduce((a: any, b: any) => a + (b.submissions || 0), 0), color: "text-blue-600" },
                { label: "بانتظار المراجعة", value: assignmentsData.reduce((a: any, b: any) => a + (b.pending || 0), 0), color: "text-amber-600" },
                { label: "متوسط الدرجات", value: `${Math.round(assignmentsData.filter((a: any) => (a.averageScore || 0) > 0).reduce((a: any, b: any) => a + (b.averageScore || 0), 0) / Math.max(1, assignmentsData.filter((a: any) => (a.averageScore || 0) > 0).length))}%`, color: "text-emerald-600" },
              ].map((item, i) => (
                <Card key={i} className="border-border/50">
                  <CardContent className="p-3 text-center">
                    <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-3">
              {assignmentsData.map((assignment: any, idx: number) => (
                <motion.div key={assignment.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}>
                  <Card className="border-border/50 hover:shadow-md transition-all">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${assignment.status === "published" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-bold">{assignment.title}</h3>
                            <StatusBadge status={assignment.status} />
                          </div>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{assignment.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />الموعد: {assignment.dueDate}</span>
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{assignment.submissions} تسليم</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-amber-500" />{assignment.pending} بانتظار المراجعة</span>
                            {assignment.averageScore > 0 && (
                              <span className="flex items-center gap-1 text-emerald-600 font-medium"><BarChart2 className="w-3 h-3" />متوسط: {assignment.averageScore}%</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                            <Eye className="w-3.5 h-3.5" />التسليمات
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════ */}
        {/* SECTION 4 — CERTIFICATES                        */}
        {/* ════════════════════════════════════════════════ */}
        {activeTab === "certificates" && (
          <motion.div key="certificates" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg">إدارة الشهادات</h2>
              <Button className="gap-2">
                <Award className="w-4 h-4" />إصدار شهادة
              </Button>
            </div>

            {/* Certificate Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {[
                { label: "شهادات صادرة", value: certificatesData.length, icon: Award, color: "bg-amber-500/10 text-amber-600" },
                { label: "نسبة الإتمام", value: `${Math.round((studentsData.filter((s: any) => s.progress === 100).length / Math.max(1, studentsData.length)) * 100)}%`, icon: TrendingUp, color: "bg-emerald-500/10 text-emerald-600" },
                { label: "في انتظار الإتمام", value: studentsData.filter((s: any) => s.progress < 100).length, icon: Clock, color: "bg-blue-500/10 text-blue-600" },
              ].map((item, i) => (
                <Card key={i} className="border-border/50">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{item.value}</p>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Students who completed */}
            <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">الطلاب المستحقون للشهادة</h3>
            {studentsData.filter((s: any) => s.progress === 100).length === 0 ? (
              <Card className="py-16 text-center">
                <CardContent>
                  <Award className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">لا يوجد طلاب أكملوا الدورة بعد</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {studentsData.filter((s: any) => s.progress === 100).map((student: any, idx: number) => (
                  <Card key={student.id} className="border-border/50">
                    <CardContent className="p-4 flex items-center gap-4">
                      <img src={student.avatar || undefined} alt={student.name} className="w-10 h-10 rounded-full" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.email}</p>
                      </div>
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30 gap-1">
                        <Trophy className="w-3 h-3" />مؤهل للشهادة
                      </Badge>
                      <div className="flex gap-2">
                        <Button size="sm" className="gap-1.5 text-xs">
                          <Award className="w-3.5 h-3.5" />إصدار
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                          <Download className="w-3.5 h-3.5" />PDF
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════ */}
        {/* SECTION 5 — ANNOUNCEMENTS                       */}
        {/* ════════════════════════════════════════════════ */}
        {activeTab === "announcements" && (
          <motion.div key="announcements" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg">مركز الإعلانات</h2>
              <Button className="gap-2" onClick={() => setShowAnnouncementModal(true)}>
                <Megaphone className="w-4 h-4" />إعلان جديد
              </Button>
            </div>

            <div className="space-y-3">
              {announcementsData.length === 0 ? (
                <Card className="py-16 text-center">
                  <CardContent>
                    <Megaphone className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">لا توجد إعلانات</p>
                    <Button className="mt-4 gap-2" onClick={() => setShowAnnouncementModal(true)}>
                      <PlusCircle className="w-4 h-4" />أنشئ أول إعلان
                    </Button>
                  </CardContent>
                </Card>
              ) : announcementsData.map((ann: any, idx: number) => (
                <motion.div key={ann.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}>
                  <Card className="border-border/50 hover:shadow-md transition-all">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          ann.priority === "urgent" ? "bg-red-500/10 text-red-600" :
                          ann.priority === "important" ? "bg-amber-500/10 text-amber-600" :
                          "bg-primary/10 text-primary"
                        }`}>
                          {ann.priority === "urgent" ? <AlertTriangle className="w-5 h-5" /> :
                           ann.priority === "important" ? <Bell className="w-5 h-5" /> :
                           <Megaphone className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-bold">{ann.title}</h3>
                            <Badge variant="outline" className={`text-[10px] ${priorityConfig[ann.priority]?.color || priorityConfig.normal.color}`}>
                              {priorityConfig[ann.priority]?.label || "عادي"}
                            </Badge>
                            <StatusBadge status={ann.status} />
                          </div>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{ann.content}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{new Date(ann.publishedAt).toLocaleDateString("ar-EG")}</span>
                            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{ann.readCount} قراءة</span>
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════ */}
      {/* STUDENT PROFILE DRAWER                          */}
      {/* ════════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedStudent && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStudent(null)}
            />
            <motion.div
              className="fixed inset-y-0 left-0 w-full sm:w-[420px] bg-card border-r border-border z-50 overflow-y-auto shadow-2xl"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-lg">ملف الطالب</h2>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedStudent(null)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Student Info */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/50 mb-6">
                  <img src={selectedStudent.avatar || undefined} alt={selectedStudent.name} className="w-16 h-16 rounded-full object-cover border-2 border-primary/20" />
                  <div>
                    <h3 className="font-bold text-lg">{selectedStudent.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedStudent.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">آخر نشاط: {selectedStudent.lastActivity}</p>
                  </div>
                </div>

                {/* Learning Progress */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-primary" />تقدم التعلم
                  </h4>
                  <div className="p-4 rounded-xl border border-border bg-muted/20">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">الإتمام الكلي</span>
                      <span className="font-bold text-primary">{selectedStudent.progress}%</span>
                    </div>
                    <Progress value={selectedStudent.progress} className="h-2 mb-3" />
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div className="text-center p-3 rounded-lg bg-background border border-border">
                        <p className="text-xl font-bold text-primary">{selectedStudent.lessonsCompleted}</p>
                        <p className="text-xs text-muted-foreground">دروس مكتملة</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-background border border-border">
                        <p className="text-xl font-bold">{selectedStudent.totalLessons - selectedStudent.lessonsCompleted}</p>
                        <p className="text-xs text-muted-foreground">دروس متبقية</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info List */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-primary" />معلومات الاشتراك
                  </h4>
                  <div className="space-y-2">
                    {[
                      { label: "تاريخ الانضمام", value: selectedStudent.enrolledAt },
                      { label: "الحالة", value: selectedStudent.progress === 100 ? "مكتمل ✅" : "قيد الدراسة 📖" },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2.5 border-b border-border/50 last:border-0">
                        <span className="text-sm text-muted-foreground">{item.label}</span>
                        <span className="text-sm font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certificate */}
                {selectedStudent.progress === 100 && (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6">
                    <div className="flex items-center gap-3">
                      <Trophy className="w-6 h-6 text-amber-600" />
                      <div>
                        <p className="font-bold text-amber-700 dark:text-amber-400">مستحق للشهادة!</p>
                        <p className="text-xs text-amber-600/80">أكمل الطالب الدورة بنجاح</p>
                      </div>
                    </div>
                    <Button size="sm" className="mt-3 w-full gap-2 bg-amber-600 hover:bg-amber-700 text-white">
                      <Award className="w-4 h-4" />إصدار الشهادة
                    </Button>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button className="gap-2"><MessageSquare className="w-4 h-4" />إرسال رسالة</Button>
                  <Button variant="outline" className="gap-2"><Download className="w-4 h-4" />تصدير بيانات الطالب</Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════ */}
      {/* ASSIGNMENT MODAL                                 */}
      {/* ════════════════════════════════════════════════ */}
      <Dialog open={showAssignmentModal} onOpenChange={setShowAssignmentModal}>
        <DialogContent className="max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-serif">
              <FileText className="w-5 h-5 text-primary" />إنشاء واجب جديد
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">عنوان الواجب *</label>
              <Input placeholder="أدخل عنوان الواجب..." value={assignTitle} onChange={e => setAssignTitle(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">وصف وتعليمات الواجب</label>
              <Textarea placeholder="اشرح متطلبات الواجب بالتفصيل..." rows={4} className="resize-none" value={assignDesc} onChange={e => setAssignDesc(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">تاريخ التسليم</label>
                <Input type="date" value={assignDue} onChange={e => setAssignDue(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">الدرجة العظمى</label>
                <Input type="number" placeholder="100" value={assignScore} onChange={e => setAssignScore(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">الدورة المرتبطة</label>
              <Select value={assignCourseId} onValueChange={setAssignCourseId}>
                <SelectTrigger><SelectValue placeholder="اختر الدورة..." /></SelectTrigger>
                <SelectContent>
                  {courses.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowAssignmentModal(false)}>إلغاء</Button>
            <Button onClick={handlePublishAssignment} className="gap-2">
              <Send className="w-4 h-4" />نشر الواجب
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ════════════════════════════════════════════════ */}
      {/* ANNOUNCEMENT MODAL                              */}
      {/* ════════════════════════════════════════════════ */}
      <Dialog open={showAnnouncementModal} onOpenChange={setShowAnnouncementModal}>
        <DialogContent className="max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-serif">
              <Megaphone className="w-5 h-5 text-primary" />إنشاء إعلان جديد
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">عنوان الإعلان *</label>
              <Input placeholder="أدخل عنوان الإعلان..." value={annTitle} onChange={e => setAnnTitle(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">محتوى الإعلان *</label>
              <Textarea placeholder="اكتب تفاصيل الإعلان هنا..." rows={4} className="resize-none" value={annContent} onChange={e => setAnnContent(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">مستوى الأولوية</label>
                <Select value={annPriority} onValueChange={(v) => setAnnPriority(v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">عادي</SelectItem>
                    <SelectItem value="important">مهم</SelectItem>
                    <SelectItem value="urgent">عاجل</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">الدورة المستهدفة</label>
                <Select value={annCourseId} onValueChange={setAnnCourseId}>
                  <SelectTrigger><SelectValue placeholder="اختر الدورة..." /></SelectTrigger>
                  <SelectContent>
                    {courses.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowAnnouncementModal(false)}>إلغاء</Button>
            <Button onClick={handleSendAnnouncement} className="gap-2">
              <Send className="w-4 h-4" />إرسال الإعلان
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ════════════════════════════════════════════════ */}
      {/* DELETE CONFIRM DIALOG                           */}
      {/* ════════════════════════════════════════════════ */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />تأكيد الحذف
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              هل أنت متأكد أنك تريد حذف الدورة التالية؟
            </p>
            {deleteConfirm && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="font-medium text-sm text-destructive">
                  {courses.find((c: any) => c.id === deleteConfirm)?.title ?? "الدورة المحددة"}
                </p>
              </div>
            )}
            <p className="text-xs text-muted-foreground text-amber-600 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 shrink-0" />
              سيتم حذف جميع محتويات الدورة والبيانات المرتبطة بها بشكل نهائي ولا يمكن التراجع عن هذا الإجراء.
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)} disabled={deleteCourse.isPending}>إلغاء</Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDeleteCourse(deleteConfirm)}
              disabled={deleteCourse.isPending}
            >
              {deleteCourse.isPending
                ? <><Loader2 className="w-4 h-4 ml-1 animate-spin" />جارٍ الحذف...</>
                : <><Trash2 className="w-4 h-4 ml-1" />حذف نهائي</>
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
