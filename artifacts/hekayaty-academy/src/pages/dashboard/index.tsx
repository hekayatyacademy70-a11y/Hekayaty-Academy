import { PageTransition } from "@/components/ui/PageTransition";
import { useAuth } from "@/context/AuthContext";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Trophy, Award, Flame, PlayCircle, Loader2, ArrowRight, Clock } from "lucide-react";
import { useGetMyEnrollments, useGetMyStats } from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare } from "lucide-react";

export default function StudentDashboard() {
  const { user } = useAuth();
  const { data: enrollments = [], isLoading: enrollmentsLoading } = useGetMyEnrollments();
  const { data: stats, isLoading: statsLoading } = useGetMyStats();
  
  const { data: assignments = [], isLoading: assignmentsLoading } = useQuery({
    queryKey: ["me", "assignments"],
    queryFn: async () => {
      const token = localStorage.getItem("hekayaty-token");
      const res = await fetch("/api/me/assignments", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch assignments");
      return res.json();
    }
  });

  const isLoading = enrollmentsLoading || statsLoading || assignmentsLoading;
  const whatsappCourses = enrollments.filter((e: any) => e.course?.whatsappLink);

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-serif mb-2">أهلاً بك، {user?.name || 'متدرب'}! 👋</h1>
        <p className="text-muted-foreground">استمر في إبداعك، العالم بانتظار حكايتك القادمة.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="الدورات النشطة"
          value={statsLoading ? "..." : (stats?.totalEnrollments ?? 0)}
          icon={BookOpen}
          trend={`${stats?.totalEnrollments ?? 0} دورة مسجّلة`}
          trendUp
        />
        <StatCard
          title="سلسلة الأيام"
          value={statsLoading ? "..." : `${stats?.currentStreakDays ?? 0} يوم`}
          icon={Flame}
          trend="استمر على الوتيرة!"
          trendUp
          className="border-amber-500/30"
        />
        <StatCard
          title="الدروس المكتملة"
          value={statsLoading ? "..." : (stats?.totalLessonsCompleted ?? 0)}
          icon={Trophy}
          trend="إجمالي الدروس"
          trendUp
        />
        <StatCard
          title="الدورات المكتملة"
          value={statsLoading ? "..." : (stats?.completedCourses ?? 0)}
          icon={Award}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main Column: Enrollments */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold font-serif">متابعة التعلم</h2>
              <Link href="/courses">
                <Button variant="ghost" size="sm" className="gap-1 text-primary">
                  اكتشف المزيد <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : enrollments.length === 0 ? (
              <Card className="text-center py-16">
                <CardContent>
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">لم تنضم إلى أي دورة بعد</p>
                  <p className="text-muted-foreground mb-6">ابدأ رحلتك الإبداعية اليوم</p>
                  <Link href="/courses">
                    <Button>تصفح الدورات</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {enrollments.map((enrollment, idx) => (
                  <motion.div
                    key={enrollment.enrollmentId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                  >
                    <Link href={`/courses/${enrollment.course.id}`}>
                      <Card className="hover-elevate cursor-pointer overflow-hidden border-border/50 shadow-sm">
                        <div className="flex flex-col sm:flex-row h-full">
                          {/* Thumbnail */}
                          <div className="w-full sm:w-48 h-32 sm:h-auto bg-gradient-to-br from-amber-600 to-stone-900 relative flex-shrink-0 flex items-center justify-center overflow-hidden">
                            {enrollment.course.thumbnailUrl ? (
                              <img
                                src={enrollment.course.thumbnailUrl}
                                alt={enrollment.course.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <PlayCircle className="w-12 h-12 text-white/50" />
                            )}
                          </div>
                          <CardContent className="p-5 flex-1 flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                {enrollment.course.level}
                              </Badge>
                            </div>
                            <h3 className="font-bold text-lg mb-3 line-clamp-1">{enrollment.course.title}</h3>
                            <div className="mt-auto">
                              <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                                <span>{enrollment.completedLessons} / {enrollment.totalLessons} درس</span>
                                <span className="font-bold text-primary">{enrollment.progressPercent}%</span>
                              </div>
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary transition-all"
                                  style={{ width: `${enrollment.progressPercent}%` }}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                المهام القادمة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {assignmentsLoading ? (
                <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
              ) : assignments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">لا توجد مهام قادمة حالياً</p>
              ) : assignments.map((task: any) => (
                <div key={task.id} className="flex items-start gap-3 pb-4 border-b border-border/50 last:border-0 last:pb-0">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{task.courseTitle}</p>
                    {task.dueDate && <p className="text-xs text-amber-500 font-medium mt-0.5">موعد التسليم: {new Date(task.dueDate).toLocaleDateString("ar-EG")}</p>}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* WhatsApp Groups */}
          {whatsappCourses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#25D366]" />
                  جروبات الواتساب
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {whatsappCourses.map((e: any) => (
                  <a key={e.enrollmentId} href={e.course.whatsappLink} target="_blank" rel="noreferrer" className="block">
                    <Button variant="outline" className="w-full justify-start gap-2 border-[#25D366]/30 hover:border-[#25D366] hover:bg-[#25D366]/5">
                      <MessageSquare className="w-4 h-4 text-[#25D366]" />
                      {e.course.title}
                    </Button>
                  </a>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">روابط سريعة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/courses">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <BookOpen className="w-4 h-4" /> اكتشف دورات جديدة
                </Button>
              </Link>
              <Link href="/workspace">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Trophy className="w-4 h-4" /> اذهب إلى المساحة الإبداعية
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
