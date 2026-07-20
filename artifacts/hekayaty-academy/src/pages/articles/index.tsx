import { useState } from "react";
import { PageTransition } from "@/components/ui/PageTransition";
import { SEO } from "@/components/seo/SEO";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, BookOpen } from "lucide-react";
import { useGetPublishedArticles, useGetCategories } from "@/hooks/useArticles";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function ArticlesPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

  const { data: categories } = useGetCategories();
  const { data, isLoading } = useGetPublishedArticles({
    limit: 12,
    offset: 0,
    search: debouncedSearch,
    categorySlug: selectedCategory
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedSearch(search);
  };

  const featuredArticle = data?.articles.find(a => a.featured) || data?.articles[0];
  const regularArticles = data?.articles.filter(a => a.id !== featuredArticle?.id) || [];

  return (
    <PageTransition>
      <SEO 
        title="مقالات حكاياتي Academy | دليل الكاتب المبدع"
        description="معرفة وإلهام وأفكار تساعد الكتّاب والمبدعين على تطوير مهاراتهم وبناء رحلتهم الإبداعية في عالم الكتابة والتأليف والنشر."
        keywords="كتابة إبداعية, مقالات كتابة, كيف تكتب رواية, نشر الكتب, أكاديمية حكاياتي, مقالات أدبية"
      />

      <div className="min-h-screen bg-black">
        {/* Hero Section */}
        <div className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black z-10" />
            <img 
              src="https://images.unsplash.com/photo-1455390582262-044cdead2708?auto=format&fit=crop&q=80" 
              alt="Creative Writing" 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="container mx-auto px-4 relative z-20">
            <div className="max-w-3xl text-center mx-auto mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                مقالات <span className="text-[#D4A373]">حكاياتي</span> Academy
              </h1>
              <p className="text-xl text-gray-300">
                معرفة وإلهام وأفكار تساعد الكتّاب والمبدعين على تطوير مهاراتهم وبناء رحلتهم الإبداعية.
              </p>
            </div>

            {/* Featured Article */}
            {featuredArticle && !isLoading && !debouncedSearch && !selectedCategory && (
              <div className="mb-20">
                <div className="max-w-5xl mx-auto">
                  <ArticleCard article={featuredArticle} />
                </div>
              </div>
            )}

            {/* Search & Filters */}
            <div className="max-w-4xl mx-auto mb-16 space-y-6">
              <form onSubmit={handleSearch} className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input 
                    placeholder="ابحث في المقالات..." 
                    className="w-full pl-4 pr-12 h-14 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-2xl focus:border-[#D4A373]/50 focus:ring-[#D4A373]/20"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Button type="submit" className="h-14 px-8 bg-[#D4A373] hover:bg-[#D4A373]/90 text-black rounded-2xl font-bold">
                  بحث
                </Button>
              </form>

              <div className="flex flex-wrap items-center gap-2 justify-center">
                <Button
                  variant={!selectedCategory ? "default" : "outline"}
                  onClick={() => setSelectedCategory(undefined)}
                  className={!selectedCategory ? "bg-white/10 text-white border-transparent" : "border-white/10 text-gray-400 hover:text-white hover:bg-white/5"}
                >
                  الكل
                </Button>
                {categories?.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.slug ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.slug)}
                    className={selectedCategory === category.slug ? "bg-white/10 text-white border-transparent" : "border-white/10 text-gray-400 hover:text-white hover:bg-white/5"}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="container mx-auto px-4 pb-32 relative z-20">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="space-y-4">
                  <Skeleton className="w-full aspect-[16/10] bg-white/5 rounded-xl" />
                  <Skeleton className="w-3/4 h-6 bg-white/5" />
                  <Skeleton className="w-full h-4 bg-white/5" />
                  <Skeleton className="w-full h-4 bg-white/5" />
                </div>
              ))}
            </div>
          ) : regularArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">لا توجد مقالات</h3>
              <p className="text-gray-400">لم يتم العثور على مقالات تطابق بحثك.</p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
