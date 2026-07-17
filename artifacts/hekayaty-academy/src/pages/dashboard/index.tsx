import { PageTransition } from "@/components/ui/PageTransition";
import { useAuth } from "@/context/AuthContext";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Trophy, Award, Flame, PlayCircle } from "lucide-react";
import { mockCourses } from "@/data/courses";
import { CourseCard } from "@/components/ui/CourseCard";

export default function StudentDashboard() {
  const { user } = useAuth();
  const inProgressCourses = mockCourses.slice(0, 3);

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-serif mb-2">أهلاً بك، {user?.name || 'متدرب'}! 👋</h1>
        <p className="text-muted-foreground">استمر في إبداعك، العالم بانتظار حكايتك القادمة.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="الدورات النشطة" value={3} icon={BookOpen} trend="2 هذا الشهر" trendUp />
        <StatCard title="سلسلة الأيام" value="12 يوم" icon={Flame} trend="أنت في القمة!" trendUp className="border-amber-500/30" />
        <StatCard title="نقاط الخبرة (XP)" value="4,250" icon={Trophy} trend="+350 الأسبوع الماضي" trendUp />
        <StatCard title="الشهادات المكتسبة" value={2} icon={Award} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold font-serif">متابعة التعلم</h2>
            </div>
            <div className="space-y-4">
              {inProgressCourses.map((course, idx) => (
                <Card key={course.id} className="hover-elevate cursor-pointer overflow-hidden border-border/50 shadow-sm">
                  <div className="flex flex-col sm:flex-row h-full">
                    <div className={`w-full sm:w-48 h-32 sm:h-auto bg-gradient-to-br ${course.thumbnailColor} relative flex-shrink-0 flex items-center justify-center`}>
                      <PlayCircle className="w-12 h-12 text-white/50" />
                    </div>
                    <CardContent className="p-5 flex-1 flex flex-col justify-center">
                      <h3 className="font-bold text-lg mb-1 line-clamp-1">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">الوحدة {idx + 2}: تقنيات متقدمة</p>
                      <div className="mt-auto flex items-center gap-4">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${(idx + 1) * 25}%` }}></div>
                        </div>
                        <span className="text-sm font-bold">{(idx + 1) * 25}%</span>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">المهام القادمة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: "تسليم المسودة الأولى", course: "بناء العوالم الخيالية", date: "غداً" },
                { title: "قراءة الفصل الثالث", course: "أساسيات الكتابة الإبداعية", date: "بعد 3 أيام" },
                { title: "المشاركة في النقاش", course: "كتابة السيناريو", date: "الخميس القادم" },
              ].map((task, i) => (
                <div key={i} className="flex gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1">{task.title}</h4>
                    <p className="text-xs text-muted-foreground">{task.course}</p>
                    <p className="text-xs text-primary font-medium mt-1">{task.date}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground border-primary">
            <CardContent className="p-6 text-center">
              <Trophy className="w-12 h-12 mx-auto mb-4 opacity-80" />
              <h3 className="font-bold text-xl mb-2">تحدي هذا الأسبوع!</h3>
              <p className="text-primary-foreground/80 text-sm mb-4">اكتب قصة من 500 كلمة باستخدام 3 شخصيات فقط.</p>
              <button className="bg-white text-primary px-4 py-2 rounded-md font-bold text-sm w-full hover:bg-white/90 transition-colors">
                شارك الآن
              </button>
            </CardContent>
          </Card>
        </div>

      </div>
    </PageTransition>
  );
}
