import { useEffect } from "react";
import { useParams, Link } from "wouter";
import { PageTransition } from "@/components/ui/PageTransition";
import { SEO } from "@/components/seo/SEO";
import { useGetArticle } from "@/hooks/useArticles";
import ReactMarkdown from "react-markdown";
import { Calendar, Clock, User, ChevronRight, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function SingleArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading, error } = useGetArticle(slug || "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl space-y-8">
          <Skeleton className="w-3/4 h-12 bg-white/5 rounded-xl" />
          <Skeleton className="w-full aspect-[21/9] bg-white/5 rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="w-full h-4 bg-white/5" />
            <Skeleton className="w-full h-4 bg-white/5" />
            <Skeleton className="w-5/6 h-4 bg-white/5" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-black pt-32 pb-20 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold text-white mb-4">المقال غير موجود</h1>
        <p className="text-gray-400 mb-8">عذراً، المقال الذي تبحث عنه غير موجود أو تم حذفه.</p>
        <Link href="/articles">
          <Button className="bg-[#D4A373] text-black hover:bg-[#D4A373]/90">
            العودة للمقالات
          </Button>
        </Link>
      </div>
    );
  }

  const publishedDate = article.published_at 
    ? format(new Date(article.published_at), 'd MMMM yyyy', { locale: ar })
    : '';

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <PageTransition>
      <SEO 
        title={`${article.seo_title || article.title} | حكاياتي Academy`}
        description={article.seo_description || article.excerpt}
        ogImage={article.cover_image || undefined}
      />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": article.seo_title || article.title,
          "author": {
            "@type": "Person",
            "name": article.author?.name || "Hekayaty Academy"
          },
          "datePublished": article.published_at || article.created_at,
          "image": article.cover_image || undefined
        })}
      </script>

      <div className="min-h-screen bg-black pt-32 pb-20 font-arabic">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-gray-500 mb-8">
            <Link href="/articles">
              <a className="hover:text-[#D4A373] transition-colors">المقالات</a>
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            {article.category && (
              <>
                <Link href={`/articles?category=${article.category.slug}`}>
                  <a className="hover:text-[#D4A373] transition-colors">{article.category.name}</a>
                </Link>
                <ChevronRight className="w-4 h-4 mx-2" />
              </>
            )}
            <span className="text-gray-300 truncate">{article.title}</span>
          </nav>

          {/* Article Header */}
          <header className="mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {article.title}
            </h1>
            
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              {article.excerpt}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-white/10">
              <div className="flex items-center gap-4">
                {article.author?.avatar_url ? (
                  <img 
                    src={article.author.avatar_url} 
                    alt={article.author.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#D4A373]"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#D4A373]/20 border-2 border-[#D4A373] flex items-center justify-center">
                    <User className="w-6 h-6 text-[#D4A373]" />
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-white text-lg">{article.author?.name}</h3>
                  <p className="text-[#D4A373] text-sm">
                    {article.author_type === 'admin' ? 'فريق الأكاديمية' : 'مدرب معتمد'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{publishedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{article.reading_time} دقائق قراءة</span>
                </div>
              </div>
            </div>
          </header>

          {/* Cover Image */}
          {article.cover_image && (
            <div className="mb-16 rounded-2xl overflow-hidden aspect-[21/9] relative">
              <img 
                src={article.cover_image} 
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-[#D4A373] hover:prose-a:text-[#e3b88e] prose-img:rounded-xl mb-20">
            <ReactMarkdown>
              {article.content}
            </ReactMarkdown>
          </div>

          {/* Share & Author Footer */}
          <div className="border-t border-white/10 pt-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              
              {/* Share Links */}
              <div className="flex items-center gap-4">
                <span className="text-gray-400 font-medium">شارك المقال:</span>
                <div className="flex items-center gap-2">
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[#1877F2] hover:text-white transition-colors">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[#1DA1F2] hover:text-white transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(article.title)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[#0A66C2] hover:text-white transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Author Box */}
              <div className="bg-white/5 p-6 rounded-2xl flex items-start gap-4 max-w-md">
                {article.author?.avatar_url ? (
                  <img src={article.author.avatar_url} alt={article.author.name} className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">{article.author?.name}</h4>
                  <p className="text-sm text-[#D4A373] mb-2">{article.author_type === 'admin' ? 'فريق الأكاديمية' : 'مدرب معتمد'}</p>
                  <Link href={`/instructors`}>
                    <a className="text-sm text-gray-400 hover:text-white transition-colors">عرض جميع المدربين &larr;</a>
                  </Link>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
