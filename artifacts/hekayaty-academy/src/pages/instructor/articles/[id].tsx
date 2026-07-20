import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { PageTransition } from "@/components/ui/PageTransition";
import { ArticleEditor } from "@/components/articles/ArticleEditor";
import { useGetCategories, useSubmitInstructorArticle } from "@/hooks/useArticles";

import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function InstructorArticleEditorPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const isNew = id === 'new';

  const { data: categories = [] } = useGetCategories();
  const { mutate: submitForReview } = useSubmitInstructorArticle();
  
  const [initialData, setInitialData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadArticle() {
      if (isNew) return;
      try {
        const token = localStorage.getItem('hekayaty-token');
        const res = await fetch(`/api/instructors/me/articles/${id}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (!res.ok) throw new Error("Failed to load article");
        const data = await res.json();

        // Check ownership
        if (data.author_id !== user?.id) {
          throw new Error("غير مصرح لك بتعديل هذا المقال");
        }

        // Cannot edit if pending or published
        if (data.status !== 'draft') {
           toast({ title: "تنبيه", description: "لا يمكنك تعديل مقال قيد المراجعة أو منشور", variant: "default" });
           setLocation('/instructor/articles');
           return;
        }

        setInitialData(data);
      } catch (error: any) {
        toast({ title: "خطأ", description: error.message || "لم نتمكن من تحميل المقال", variant: "destructive" });
        setLocation('/instructor/articles');
      } finally {
        setIsLoading(false);
      }
    }
    if (user?.id) loadArticle();
  }, [id, isNew, setLocation, toast, user?.id]);

  const handleSave = async (data: any) => {
    setIsSaving(true);
    try {
      const url = isNew ? '/api/instructors/me/articles' : `/api/instructors/me/articles/${id}`;
      const method = isNew ? 'POST' : 'PUT';

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
        description: `تم حفظ المسودة بنجاح.`,
      });

      if (isNew) {
        const saved = await res.json();
        setLocation(`/instructor/articles/${saved.id}`);
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

  const handleSubmitForReview = () => {
    if (isNew) {
      toast({ title: "تنبيه", description: "يرجى حفظ المسودة أولاً قبل إرسالها للمراجعة." });
      return;
    }
    submitForReview(id, {
      onSuccess: () => {
        toast({ title: "تم الإرسال", description: "تم إرسال المقال لفريق الأكاديمية للمراجعة." });
        setLocation('/instructor/articles');
      },
      onError: (err: any) => {
        toast({ title: "خطأ", description: err.message, variant: "destructive" });
      }
    });
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
        <Button variant="ghost" onClick={() => setLocation('/instructor/articles')} className="mb-6">
          &larr; العودة لقائمة المقالات
        </Button>
        <ArticleEditor 
          initialData={initialData || {}} 
          categories={categories}
          onSave={handleSave}
          onSubmitForReview={handleSubmitForReview}
          isLoading={isSaving}
          isInstructor={true}
        />
      </div>
    </PageTransition>
  );
}
