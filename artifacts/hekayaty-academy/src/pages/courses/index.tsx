import { PageTransition } from "@/components/ui/PageTransition";
import { SEO } from "@/components/seo/SEO";
import { useGetCourses } from "@workspace/api-client-react";
import { CourseCard } from "@/components/ui/CourseCard";
import type { CourseCardData } from "@/types/course";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, BookOpen, Loader2 } from "lucide-react";
import { useState } from "react";

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const CATEGORIES = ["الرواية", "القصة القصيرة", "السيناريو", "الشعر", "النشر"];

  const { data: apiCourses = [], isLoading, isError } = useGetCourses();

  // Map API data to CourseCardData shape
  const courses: CourseCardData[] = apiCourses.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    thumbnailUrl: c.thumbnailUrl,
    instructorId: c.instructorId,
    price: c.price,
    level: c.level,
    status: c.status,
    isPremium: c.isPremium,
    category: (c as any).category,
  }));

  const categories = Array.from(new Set(courses.map((c) => c.category).filter(Boolean)));

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? course.category === selectedCategory : true;
    const matchesLevel = selectedLevel ? course.level === selectedLevel : true;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <PageTransition className="min-h-screen flex flex-col bg-background">
      <SEO 
        title="مكتبة الدورات" 
        description="تصفح جميع الدورات المتاحة في أكاديمية حكاياتي، وتعلم فنون الكتابة الإبداعية وصناعة النشر من أفضل الخبراء في العالم العربي." 
      />
      {/* Header */}
      <section className="bg-sidebar py-16 text-sidebar-foreground border-b border-sidebar-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 text-primary mb-4">
              <BookOpen className="w-6 h-6" />
              <span className="font-bold tracking-wider">مكتبة الدورات</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
              تعلم فنون الكتابة من <br className="hidden md:block"/>
              <span className="text-primary">أفضل الخبراء في العالم العربي</span>
            </h1>
            <p className="text-lg text-sidebar-foreground/80 leading-relaxed mb-8">
              أكثر من 50 دورة تدريبية تغطي كافة مجالات الكتابة الإبداعية وصناعة النشر. اختر ما يناسب شغفك وابدأ التعلم الآن.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="ابحث عن دورة أو مدرب..."
                  className="h-14 pr-12 pl-4 text-base bg-white text-black border-white/20 placeholder:text-gray-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button className="h-14 px-8 text-base font-bold whitespace-nowrap">
                بحث
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 flex-1">
        <div className="container mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-8">

          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary" />
                التصنيفات
              </h3>
              <div className="flex flex-wrap lg:flex-col gap-2">
                <Badge
                  variant={selectedCategory === null ? "default" : "outline"}
                  className="cursor-pointer justify-start py-2 px-4 hover-elevate"
                  onClick={() => setSelectedCategory(null)}
                >
                  الكل
                </Badge>
                {categories.map((cat) => (
                  <Badge
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    className="cursor-pointer justify-start py-2 px-4 hover-elevate"
                    onClick={() => setSelectedCategory(cat ?? null)}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Category Dropdown Filter */}
            <div>
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                التصنيف
              </h3>
              <select
                value={selectedCategory ?? ""}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
              >
                <option value="">اختر...</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Level Filter */}
            <div>
              <h3 className="font-bold text-lg mb-4 border-t border-border pt-6">المستوى</h3>
              <div className="space-y-2">
                {[
                  { en: "beginner", ar: "مبتدئ" },
                  { en: "intermediate", ar: "متوسط" },
                  { en: "advanced", ar: "متقدم" },
                ].map(({ en, ar }) => (
                  <label key={en} className="flex items-center gap-3 p-2 hover:bg-muted rounded-md cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-primary rounded border-input cursor-pointer"
                      checked={selectedLevel === en}
                      onChange={() => setSelectedLevel(selectedLevel === en ? null : en)}
                    />
                    <span className="text-sm font-medium">{ar}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold font-serif">
                {selectedCategory ? selectedCategory : "جميع الدورات"}
              </h2>
              {!isLoading && (
                <span className="text-sm text-muted-foreground font-medium bg-muted px-3 py-1 rounded-full">
                  {filteredCourses.length} دورة
                </span>
              )}
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
            )}

            {/* Error State */}
            {isError && !isLoading && (
              <div className="text-center py-24 bg-muted/30 rounded-2xl border border-border border-dashed">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">تعذّر تحميل الدورات</h3>
                <p className="text-muted-foreground">تأكد من تشغيل السيرفر وإعادة المحاولة.</p>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !isError && filteredCourses.length === 0 && (
              <div className="text-center py-24 bg-muted/30 rounded-2xl border border-border border-dashed">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">لم نجد أية دورات</h3>
                <p className="text-muted-foreground">حاول تغيير كلمات البحث أو التصنيفات المحددة.</p>
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() => { setSearchTerm(""); setSelectedCategory(null); }}
                >
                  إعادة ضبط الفلاتر
                </Button>
              </div>
            )}

            {/* Course Grid */}
            {!isLoading && !isError && filteredCourses.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
