import { PageTransition } from "@/components/ui/PageTransition";
import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/ui/StatCard";
import { FileUpload } from "@/components/ui/FileUpload";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar
} from "recharts";
import {
  DollarSign, Users, BookOpen, Star, PlusCircle, Eye,
  ArrowUpRight, Clock, CheckCircle2, MessageSquare, Loader2
} from "lucide-react";
import { useGetMyInstructorCourses, useGetMyInstructorStats } from "@workspace/api-client-react";
import { useAuth } from "@/context/AuthContext";

// Static chart data (will be real in Phase E)
const revenueData = [
  { month: "يناير", revenue: 4200 }, { month: "فبراير", revenue: 5800 },
  { month: "مارس", revenue: 4900 }, { month: "أبريل", revenue: 7200 },
  { month: "مايو", revenue: 6800 }, { month: "يونيو", revenue: 9100 },
  { month: "يوليو", revenue: 8400 },
];
const enrollData = [
  { month: "يناير", students: 120 }, { month: "فبراير", students: 185 },
  { month: "مارس", students: 143 }, { month: "أبريل", students: 240 },
  { month: "مايو", students: 210 }, { month: "يونيو", students: 310 },
  { month: "يوليو", students: 280 },
];

const revenueConfig: ChartConfig = { revenue: { label: "الإيرادات", color: "hsl(var(--primary))" } };
const enrollConfig: ChartConfig = { students: { label: "الطلاب", color: "hsl(var(--primary))" } };

// Mock questions (will be wired in Phase E)
const recentQuestions = [
  { id: 1, course: "أساسيات الكتابة الإبداعية", student: "أميرة خالد", question: "هل يجب أن يكون الصراع في كل فصل؟", time: "منذ ساعة", answered: false },
  { id: 2, course: "كتابة السيناريو السينمائي", student: "سامي الحربي", question: "كيف أكتب مشهد الذروة بشكل صحيح؟", time: "منذ 3 ساعات", answered: true },
  { id: 3, course: "أساسيات الكتابة الإبداعية", student: "نور الرشيد", question: "ما الفرق بين الراوي العليم والمحدود؟", time: "منذ يوم", answered: false },
];

export default function InstructorOverview() {
  const { user } = useAuth();
  const [withdrawing, setWithdrawing] = useState(false);

  const { data: courses = [], isLoading: coursesLoading } = useGetMyInstructorCourses();
  const { data: stats, isLoading: statsLoading } = useGetMyInstructorStats();

  const totalRevenue = stats?.totalRevenue ?? 0;
  const withdrawableRevenue = Math.round(totalRevenue * 0.7);

  return (
    <PageTransition>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif mb-1">لوحة المدرب</h1>
          <p className="text-muted-foreground">مرحباً {user?.name || 'محمد'}! إليك ملخص أداء دوراتك.</p>
        </div>
        <Link href="/instructor/courses/new">
          <Button className="gap-2 font-bold">
            <PlusCircle className="w-4 h-4" />
            دورة جديدة
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="إجمالي الإيرادات"
          value={statsLoading ? "..." : `${totalRevenue.toLocaleString("ar-EG")} جنيه`}
          icon={DollarSign}
          trend="70% حصتك من المبيعات"
          trendUp
        />
        <StatCard
          title="إجمالي الطلاب"
          value={statsLoading ? "..." : (stats?.totalStudents ?? 0).toLocaleString("ar-EG")}
          icon={Users}
          trendUp
        />
        <StatCard
          title="الدورات المنشورة"
          value={statsLoading ? "..." : (stats?.publishedCourses ?? 0)}
          icon={BookOpen}
        />
        <StatCard
          title="إجمالي الدورات"
          value={statsLoading ? "..." : (stats?.totalCourses ?? 0)}
          icon={Star}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader><CardTitle className="text-base font-bold">الإيرادات الشهرية (جنيه)</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={revenueConfig} className="h-52">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="url(#revGrad)" strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base font-bold">الالتحاقات الشهرية (طالب)</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={enrollConfig} className="h-52">
              <BarChart data={enrollData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="students" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Courses */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold font-serif">دوراتي</h2>
            <Link href="/instructor/courses">
              <Button variant="ghost" size="sm" className="gap-1 text-primary">
                إدارة الكل <ArrowUpRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          {coursesLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : courses.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">لا توجد دورات بعد</p>
                <p className="text-muted-foreground mb-6">أنشئ أول دورة لك الآن</p>
                <Link href="/instructor/courses/new">
                  <Button>إنشاء دورة جديدة</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            courses.map(course => (
              <Card key={course.id} className="hover-elevate">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold line-clamp-1">{course.title}</h3>
                        <Badge
                          variant={course.status === "published" ? "default" : "outline"}
                          className={course.status === "published"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                            : ""}
                        >
                          {course.status === "published" ? "منشور" : course.status === "draft" ? "مسودة" : "أرشيف"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {course.totalStudents.toLocaleString("ar-EG")} طالب
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          {course.totalLessons} درس
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5" />
                          {course.totalRevenue.toLocaleString("ar-EG")} جنيه
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link href={`/courses/${course.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                  {course.status === "draft" && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>اكتمال المحتوى</span>
                        <span className="text-primary font-bold">
                          {course.totalLessons > 0 ? `${course.totalLessons} درس` : "لا يوجد محتوى بعد"}
                        </span>
                      </div>
                      <Progress value={course.totalLessons > 0 ? 60 : 10} className="h-1.5" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Earnings */}
          <Card className="bg-primary text-primary-foreground border-primary">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-1 opacity-80 text-sm font-medium">
                <DollarSign className="w-4 h-4" />
                رصيد قابل للسحب
              </div>
              <p className="text-4xl font-bold font-serif mb-4">
                {statsLoading ? "..." : withdrawableRevenue.toLocaleString("ar-EG")}
                {" "}<span className="text-2xl">جنيه</span>
              </p>
              <p className="text-xs opacity-70 mb-4">70% من إجمالي مبيعاتك (30% حصة المنصة)</p>
              <Button
                className="w-full bg-white text-primary hover:bg-white/90 font-bold"
                onClick={() => { setWithdrawing(true); setTimeout(() => setWithdrawing(false), 2000); }}
              >
                {withdrawing ? "جارٍ المعالجة..." : "سحب الأرباح"}
              </Button>
            </CardContent>
          </Card>

          {/* Unanswered Questions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                أسئلة تنتظر إجابة
                <Badge className="bg-destructive/10 text-destructive border-destructive/20 mr-auto">
                  {recentQuestions.filter(q => !q.answered).length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentQuestions.map(q => (
                <div key={q.id} className={`p-3 rounded-lg border ${q.answered ? "border-emerald-500/20 bg-emerald-500/5" : "border-border bg-muted/30"}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-primary truncate">{q.course}</span>
                    {q.answered
                      ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      : <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                  </div>
                  <p className="text-sm font-medium line-clamp-2">{q.question}</p>
                  <p className="text-xs text-muted-foreground mt-1">{q.student} • {q.time}</p>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full">عرض كل الأسئلة</Button>
            </CardContent>
          </Card>

          {/* Quick Upload */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">رفع سريع للملفات</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload
                category="misc"
                visibility="private"
                maxSizeMB={50}
                onUploadSuccess={(id, key) => {
                  console.log("Uploaded successfully:", id, key);
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
