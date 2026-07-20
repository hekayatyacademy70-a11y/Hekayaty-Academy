import { useEffect, useState } from "react";
import { PageTransition } from "@/components/ui/PageTransition";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Loader2, Star, BookOpen, CheckCircle2, Award, ChevronRight } from "lucide-react";
import { Link } from "wouter";

function useMyPaths() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("hekayaty-token");
    if (!token) { setLoading(false); return; }
    fetch("/api/me/paths", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}

export default function DashboardPathsPage() {
  const { data: enrolled, loading } = useMyPaths();

  const active = enrolled.filter(e => e.status === "active");
  const completed = enrolled.filter(e => e.status === "completed");

  return (
    <PageTransition dir="rtl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-serif text-foreground">مساراتي التعليمية</h1>
        <p className="text-muted-foreground mt-1">تابع تقدمك في المسارات التعليمية التي انضممت إليها</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : enrolled.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground border-2 border-dashed border-border rounded-2xl">
          <Star className="w-14 h-14 mx-auto mb-4 opacity-20" />
          <h2 className="text-xl font-bold mb-2 text-foreground">لم تنضم إلى أي مسار بعد</h2>
          <p className="mb-6">استعرض مساراتنا التعليمية المتخصصة واختر ما يناسبك</p>
          <Link href="/paths">
            <Button className="gap-2">استعرض المسارات <ChevronRight className="w-4 h-4" /></Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Active Paths */}
          {active.length > 0 && (
            <div>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" /> المسارات النشطة ({active.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {active.map((enrollment, i) => (
                  <PathEnrollmentCard key={enrollment.id} enrollment={enrollment} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* Completed Paths */}
          {completed.length > 0 && (
            <div>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" /> المسارات المكتملة ({completed.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {completed.map((enrollment, i) => (
                  <PathEnrollmentCard key={enrollment.id} enrollment={enrollment} index={i} completed />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </PageTransition>
  );
}

function PathEnrollmentCard({ enrollment, index, completed = false }: { enrollment: any; index: number; completed?: boolean }) {
  const path = enrollment.path || {};
  const progress = enrollment.progressPercent || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-200"
    >
      {/* Thumbnail strip */}
      <div className="relative h-32 bg-muted overflow-hidden">
        {path.thumbnailUrl ? (
          <img src={path.thumbnailUrl} alt={path.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            <Star className="w-10 h-10 text-primary/30" />
          </div>
        )}
        {completed && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30 gap-1">
              <CheckCircle2 className="w-3 h-3" /> مكتمل
            </Badge>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-foreground mb-2">{path.title || "مسار تعليمي"}</h3>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>التقدم</span>
            <span className="font-semibold text-primary">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <Link href={`/paths/${path.slug}`}>
            <Button size="sm" variant="outline" className="gap-1.5 text-xs">
              <BookOpen className="w-3.5 h-3.5" /> متابعة التعلم
            </Button>
          </Link>
          {completed && (
            <Button size="sm" variant="outline" className="gap-1.5 text-xs text-amber-600 border-amber-500/30">
              <Award className="w-3.5 h-3.5" /> تحميل الشهادة
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
