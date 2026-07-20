import { memo } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import type { Article } from "@/types/article";

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard = memo(function ArticleCard({ article }: ArticleCardProps) {
  const publishedDate = article.published_at 
    ? format(new Date(article.published_at), 'd MMMM yyyy', { locale: ar })
    : '';

  return (
    <Link href={`/articles/${article.slug}`}>
      <a className="block group h-full">
        <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 border-white/5 bg-black/40 backdrop-blur-sm group-hover:-translate-y-1">
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src={article.cover_image || 'https://images.unsplash.com/photo-1455390582262-044cdead2708?auto=format&fit=crop&q=80'}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {article.category && (
              <Badge className="absolute top-4 right-4 bg-[#D4A373] text-black hover:bg-[#D4A373]/90">
                {article.category.name}
              </Badge>
            )}
          </div>
          
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-[#D4A373] transition-colors">
              {article.title}
            </h3>
            
            <p className="text-gray-400 mb-6 line-clamp-3 text-sm leading-relaxed">
              {article.excerpt}
            </p>
            
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                {article.author?.avatar_url ? (
                  <img 
                    src={article.author.avatar_url} 
                    alt={article.author.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-400" />
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">{article.author?.name}</span>
                  <span className="text-xs text-[#D4A373]">
                    {article.author_type === 'admin' ? 'فريق الأكاديمية' : 'مدرب معتمد'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{publishedDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{article.reading_time} دقائق قراءة</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </a>
    </Link>
  );
});
