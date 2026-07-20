import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { PageTransition } from "@/components/ui/PageTransition";
import { ArticleEditor } from "@/components/articles/ArticleEditor";
import { useGetCategories } from "@/hooks/useArticles";

import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminArticleEditorPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const isNew = id === 'new';

  const { data: categories = [] } = useGetCategories();
  
  const [initialData, setInitialData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadArticle() {
      if (isNew) return;
      try {
        const token = localStorage.getItem('hekayaty-token');
        const res = await fetch(`/api/admin/articles/${id}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (!res.ok) throw new Error("Failed to load article");
        const data = await res.json();
        setInitialData(data);
      } catch (error: any) {
        toast({ title: "خطأ", description: "لم نتمكن من تحميل المقال", variant: "destructive" });
        setLocation('/admin/articles');
      } finally {
        setIsLoading(false);
      }
    }
    loadArticle();
  }, [id, isNew, setLocation, toast]);

  const handleSave = async (data: any) => {
    setIsSaving(true);
    try {
      const url = isNew ? '/api/admin/articles' : `/api/admin/articles/${id}`;
      const method = isNew ? 'POST' : 'PUT';

      // Use absolute URL or local path
      const token = localStorage.getItem('hekayaty-token');

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error(await res.text());

      toast({
        title: "تم الحفظ بنجاح",
        description: `تم ${isNew ? 'إنشاء' : 'تحديث'} المقال وحالته الآن: ${data.status === 'published' ? 'منشور' : 'مسودة'}`,
      });

      if (isNew) {
        const saved = await res.json();
        setLocation(`/admin/articles/${saved.id}`);
      }
    } catch (error: any) {
      toast({
        title: "خطأ في الحفظ",
        description: error.message || "حدث خطأ غير متوقع",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4A373]" />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto">
        <Button variant="ghost" onClick={() => setLocation('/admin/articles')} className="mb-6">
          &larr; العودة لقائمة المقالات
        </Button>
        <ArticleEditor 
          initialData={initialData || {}} 
          categories={categories}
          onSave={handleSave}
          isLoading={isSaving}
          isInstructor={false}
        />
      </div>
    </PageTransition>
  );
}
