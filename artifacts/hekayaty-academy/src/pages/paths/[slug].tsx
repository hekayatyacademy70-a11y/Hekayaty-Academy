import { useEffect, useState } from "react";
import { PageTransition } from "@/components/ui/PageTransition";
import { SEO } from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Loader2, Star, Clock, BookOpen, Users, ChevronDown, ChevronUp, Award } from "lucide-react";
import { Link, useParams } from "wouter";

const SKILL_LABELS: Record<string, string> = {
  beginner: "مبتدئ", intermediate: "متوسط", advanced: "متقدم", kids: "أطفال"
};

export default function PathLandingPage() {
  const params = useParams<{ slug: string }>();
  const [path, setPath] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/paths/${params.slug}`)
      .then(r => r.json())
      .then(setPath)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.slug]);

  const handleEnroll = async () => {
    const token = localStorage.getItem("hekayaty-token");
    if (!token) { window.location.href = "/auth/login"; return; }
    setEnrolling(true);
    try {
      const res = await fetch(`/api/paths/${path.id}/enroll`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) alert("تم التسجيل في المسار بنجاح! 🎉");
      else alert("حدث خطأ أثناء التسجيل");
    } finally { setEnrolling(false); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  if (!path) return (
    <div className="min-h-screen flex items-center justify-center text-muted-foreground">
      المسار غير موجود
    </div>
  );

  const displayPrice = path.discountPrice || path.regularPrice;
  const hasDiscount = path.discountPrice && path.discountPrice < path.regularPrice;
  const courses = path.courses || [];

  return (
    <PageTransition className="min-h-screen">
      <SEO 
        title={path.title} 
        description={path.shortDescription || undefined} 
        ogImage={path.bannerUrl || undefined}
      />
      {/* ─── Hero ─────────────────────────────────── */}
      <section className="relative min-h-[70vh] flex items-center bg-black overflow-hidden">
        {path.bannerUrl && (
          <div className="absolute inset-0">
            <img src={path.bannerUrl} alt={path.title} className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black" />
        <div className="container mx-auto px-4 md:px-8 relative z-10 py-24">
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge className="bg-primary/20 text-primary border-primary/30 text-sm px-3 py-1">
                {SKILL_LABELS[path.skillLevel] || path.skillLevel}
              </Badge>
              {path.skillLevel === "kids" && (
                <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30 text-sm px-3 py-1">
                  🧒 مناسب للأطفال
                </Badge>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-5 leading-tight">{path.title}</h1>
            <p className="text-lg text-white/70 mb-8 leading-relaxed">{path.shortDescription}</p>

            <div className="flex flex-wrap gap-6 text-white/60 text-sm mb-10">
              <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-primary" />{courses.length} كورس</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" />{path.totalHours} ساعة</span>
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-primary" />{path.studentsCount || 0} طالب</span>
            </div>

            <div className="flex items-center gap-6">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-primary">{displayPrice} ج.م</span>
                  {hasDiscount && (
                    <span className="text-xl text-white/40 line-through">{path.regularPrice} ج.م</span>
                  )}
                </div>
                {hasDiscount && (
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 mt-1">
                    خصم {Math.round((1 - displayPrice / path.regularPrice) * 100)}%
                  </Badge>
                )}
              </div>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-6 text-base rounded-xl"
                onClick={handleEnroll}
                disabled={enrolling}
              >
                {enrolling ? <Loader2 className="w-5 h-5 animate-spin" /> : "سجّل الآن ←"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Learning Journey Timeline ────────────── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="w-12 h-1 bg-primary mb-6 rounded-full" />
          <h2 className="text-3xl font-serif font-bold mb-12">رحلة التعلم</h2>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute right-[22px] top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-6">
              {courses.map((course: any, idx: number) => (
                <motion.div
                  key={course.courseId}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex gap-6 relative"
                >
                  {/* Dot */}
                  <div className="w-11 h-11 rounded-full bg-primary/10 border-2 border-primary/40 flex items-center justify-center shrink-0 font-bold text-primary text-sm z-10">
                    {idx + 1}
                  </div>
                  {/* Card */}
                  <div className="flex-1 bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-lg bg-muted overflow-hidden shrink-0">
                      {course.thumbnailUrl
                        ? <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                        : <BookOpen className="w-5 h-5 m-auto mt-4.5 text-muted-foreground" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{course.title}</p>
                      <p className="text-sm text-muted-foreground">{course.instructorName}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Full Description ─────────────────────── */}
      {path.fullDescription && (
        <section className="py-16 bg-muted/30 border-t border-border">
          <div className="container mx-auto px-4 md:px-8 max-w-3xl">
            <h2 className="text-2xl font-serif font-bold mb-6">عن هذا المسار</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{path.fullDescription}</p>
          </div>
        </section>
      )}

      {/* ─── Certificate CTA ─────────────────────── */}
      <section className="py-20 bg-background border-t border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-8 text-center max-w-2xl mx-auto">
            <Award className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-serif font-bold mb-3">احصل على شهادة الإتمام</h2>
            <p className="text-muted-foreground mb-6">أكمل جميع كورسات المسار واحصل على شهادة معتمدة من أكاديمية حكاياتي.</p>
            <Button size="lg" onClick={handleEnroll} disabled={enrolling}>
              {enrolling ? <Loader2 className="w-4 h-4 animate-spin" /> : "سجّل وابدأ رحلتك ←"}
            </Button>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
