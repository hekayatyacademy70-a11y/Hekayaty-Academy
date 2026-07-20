import { Link } from "wouter";
import { PageTransition } from "@/components/ui/PageTransition";
import { useGetInstructorArticles, useSubmitInstructorArticle } from "@/hooks/useArticles";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Eye, Send, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

export default function InstructorArticlesPage() {
  const { data: articles, isLoading } = useGetInstructorArticles();
  const { mutate: submitArticle } = useSubmitInstructorArticle();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published': return <Badge className="bg-green-600">منشور</Badge>;
      case 'draft': return <Badge variant="outline">مسودة</Badge>;
      case 'pending_review': return <Badge className="bg-yellow-600">قيد المراجعة</Badge>;
      case 'approved': return <Badge className="bg-blue-600">تمت الموافقة</Badge>;
      case 'archived': return <Badge variant="secondary">مؤرشف</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">مقالاتي</h1>
            <p className="text-gray-400">اكتب وشارك مقالاتك مع مجتمع حكاياتي.</p>
          </div>
          <Link href="/instructor/articles/new">
            <Button className="bg-[#D4A373] text-black hover:bg-[#D4A373]/90">
              <Plus className="w-4 h-4 ml-2" /> مقال جديد
            </Button>
          </Link>
        </div>

        <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead className="text-right w-[400px]">العنوان</TableHead>
                <TableHead className="text-right">التصنيف</TableHead>
                <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-left">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [1, 2, 3].map(i => (
                  <TableRow key={i} className="border-white/10">
                    <TableCell><Skeleton className="h-6 w-48 bg-white/5" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 bg-white/5" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-32 bg-white/5" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 bg-white/5" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-10 bg-white/5" /></TableCell>
                  </TableRow>
                ))
              ) : articles?.length ? (
                articles.map(article => (
                  <TableRow key={article.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="font-medium text-white truncate max-w-[400px]">
                      {article.title}
                    </TableCell>
                    <TableCell className="text-gray-400">{article.category?.name || 'غير مصنف'}</TableCell>
                    <TableCell className="text-gray-400">
                      {format(new Date(article.created_at), 'd MMM yyyy', { locale: ar })}
                    </TableCell>
                    <TableCell>{getStatusBadge(article.status)}</TableCell>
                    <TableCell className="text-left">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-background border-white/10">
                          {article.status === 'published' && (
                            <DropdownMenuItem asChild>
                              <a href={`/articles/${article.slug}`} target="_blank" rel="noopener noreferrer">
                                <Eye className="w-4 h-4 ml-2" /> عرض المقال
                              </a>
                            </DropdownMenuItem>
                          )}
                          
                          {(article.status === 'draft' || article.status === 'pending_review') && (
                            <DropdownMenuItem asChild>
                              <Link href={`/instructor/articles/${article.id}`}>
                                <Edit className="w-4 h-4 ml-2" /> تحرير
                              </Link>
                            </DropdownMenuItem>
                          )}
                          
                          {article.status === 'draft' && (
                            <DropdownMenuItem onClick={() => submitArticle(article.id)}>
                              <Send className="w-4 h-4 ml-2 text-blue-500" /> إرسال للمراجعة
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-gray-500">
                    لم تقم بكتابة أي مقالات بعد. ابدأ الآن!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </PageTransition>
  );
}
