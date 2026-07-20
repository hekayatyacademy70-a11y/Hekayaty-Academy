import { useEffect, useState } from "react";
import { PageTransition } from "@/components/ui/PageTransition";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Loader2, Star, BookOpen, Users, DollarSign, BarChart3 } from "lucide-react";
import { Link } from "wouter";

// This endpoint will be added to /api/me routes
function useInstructorPaths() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("hekayaty-token");
    if (!token) { setLoading(false); return; }
    fetch("/api/me/instructor-paths", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}

export default function InstructorPathsPage() {
  const { data: paths, loading } = useInstructorPaths();

  return (
    <PageTransition dir="rtl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-serif text-foreground">مشاركتي في المسارات</h1>
        <p className="text-muted-foreground mt-1">المسارات التعليمية التي تشمل دوراتك، وإحصاءات مشاركتك فيها</p>
      </div>

      {/* Info Banner */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-8 text-sm flex items-start gap-3">
        <Star className="w-5 h-5 text-primary mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold text-foreground mb-1">معلومة عن نظام المسارات</p>
          <p className="text-muted-foreground">
            يتحكم المسؤولون في إنشاء المسارات التعليمية وتسعيرها. تظهر أرباحك من كل مسار بناءً على النسبة المئوية المخصصة لدوراتك داخل المسار.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : paths.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground border-2 border-dashed border-border rounded-2xl">
          <Star className="w-14 h-14 mx-auto mb-4 opacity-20" />
          <h2 className="text-xl font-bold mb-2 text-foreground">لا توجد مسارات تشمل دوراتك بعد</h2>
          <p>سيضيف المسؤولون دوراتك إلى مسارات تعليمية قريباً</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {paths.map((path, i) => (
            <motion.div
              key={path.pathId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200"
            >
              {/* Thumbnail */}
              <div className="relative h-32 bg-muted overflow-hidden">
                {path.thumbnailUrl ? (
                  <img src={path.thumbnailUrl} alt={path.pathTitle} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <Star className="w-10 h-10 text-primary/30" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <Badge
                    variant="outline"
                    className={path.status === "published"
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs"
                      : "bg-gray-500/10 text-gray-500 border-gray-500/20 text-xs"
                    }
                  >
                    {path.status === "published" ? "منشور" : "مسودة"}
                  </Badge>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-foreground mb-3">{path.pathTitle}</h3>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-muted/50 rounded-lg p-2.5 text-center">
                    <Users className="w-4 h-4 text-primary mx-auto mb-1" />
                    <p className="text-lg font-bold text-foreground">{path.enrollments || 0}</p>
                    <p className="text-xs text-muted-foreground">طالب</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-2.5 text-center">
                    <BarChart3 className="w-4 h-4 text-primary mx-auto mb-1" />
                    <p className="text-lg font-bold text-foreground">{path.revenueWeight || 0}%</p>
                    <p className="text-xs text-muted-foreground">نسبتك</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-2.5 text-center">
                    <DollarSign className="w-4 h-4 text-primary mx-auto mb-1" />
                    <p className="text-lg font-bold text-foreground">{path.earnings || 0}</p>
                    <p className="text-xs text-muted-foreground">ج.م ربح</p>
                  </div>
                </div>

                {/* Courses in this path */}
                {path.courses && path.courses.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">دوراتك في هذا المسار:</p>
                    <div className="space-y-1">
                      {path.courses.map((course: any) => (
                        <div key={course.courseId} className="flex items-center gap-2 text-xs">
                          <BookOpen className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="truncate text-foreground">{course.title}</span>
                          <span className="text-muted-foreground shrink-0">({course.revenueWeight}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </PageTransition>
  );
}
