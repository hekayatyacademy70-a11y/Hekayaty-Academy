import { useEffect, useState } from "react";
import { PageTransition } from "@/components/ui/PageTransition";
import { SEO } from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Loader2, Star, Clock, BookOpen, Search, Filter } from "lucide-react";
import { Link } from "wouter";

const SKILL_LABELS: Record<string, string> = {
  beginner: "مبتدئ", intermediate: "متوسط", advanced: "متقدم", kids: "أطفال"
};
const SKILL_COLORS: Record<string, string> = {
  beginner: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  intermediate: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  advanced: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  kids: "bg-yellow-400/10 text-yellow-600 border-yellow-400/20",
};

export default function PathsCatalogPage() {
  const [paths, setPaths] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");

  useEffect(() => {
    fetch("/api/paths")
      .then(r => r.json())
      .then(setPaths)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = paths.filter(p => {
    const matchSearch = !search || p.title?.toLowerCase().includes(search.toLowerCase());
    const matchLevel = levelFilter === "all" || p.skillLevel === levelFilter;
    return matchSearch && matchLevel;
  });

  return (
    <PageTransition className="flex flex-col min-h-screen">
      <SEO 
        title="مسارات التعلم" 
        description="استكشف مسارات التعلم المتكاملة في أكاديمية حكاياتي وابدأ رحلتك من البداية وحتى الاحتراف في كتابة الروايات." 
      />
      {/* Header */}
      <section className="bg-black text-white pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <div className="w-12 h-1 bg-primary mx-auto mb-6 rounded-full" />
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">مسارات التعلم</h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            رحلات تعليمية متكاملة تأخذك من المبتدئ إلى المحترف في كتابة الروايات وصناعة المحتوى.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-background border-b border-border sticky top-0 z-10 backdrop-blur-sm bg-background/90">
        <div className="container mx-auto px-4 md:px-8 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث..." className="pr-10" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", "beginner", "intermediate", "advanced", "kids"].map(level => (
              <button
                key={level}
                onClick={() => setLevelFilter(level)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  levelFilter === level
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/40"
                }`}
              >
                {level === "all" ? "الكل" : SKILL_LABELS[level]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 bg-background flex-1">
        <div className="container mx-auto px-4 md:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Star className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>لا توجد مسارات بهذه المواصفات</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((path, i) => (
                <motion.div
                  key={path.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/paths/${path.slug}`} className="block group">
                    <div className="bg-card border border-border/50 rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300">
                      {/* Thumbnail */}
                      <div className="relative h-44 bg-muted overflow-hidden">
                        {path.thumbnailUrl ? (
                          <img
                            src={path.thumbnailUrl}
                            alt={path.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                            <Star className="w-12 h-12 text-primary/30" />
                          </div>
                        )}
                        <div className="absolute top-3 right-3">
                          <Badge variant="outline" className={`text-xs ${SKILL_COLORS[path.skillLevel] || ""}`}>
                            {SKILL_LABELS[path.skillLevel] || path.skillLevel}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                          {path.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {path.shortDescription}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                          <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{path.coursesCount || 0} كورس</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{path.totalHours || 0} ساعة</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            {path.discountPrice ? (
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-xl font-bold text-primary">{path.discountPrice} ج.م</span>
                                <span className="text-sm text-muted-foreground line-through">{path.regularPrice} ج.م</span>
                              </div>
                            ) : (
                              <span className="text-xl font-bold text-primary">{path.regularPrice || 0} ج.م</span>
                            )}
                          </div>
                          <span className="text-xs text-primary font-semibold group-hover:underline">عرض المسار ←</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
