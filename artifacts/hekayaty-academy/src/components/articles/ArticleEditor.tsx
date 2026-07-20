import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Image, Save, Eye, Send, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { Article, ArticleCategory } from "@/types/article";

interface ArticleEditorProps {
  initialData?: Partial<Article>;
  categories: ArticleCategory[];
  onSave: (data: Partial<Article>) => void;
  onSubmitForReview?: () => void;
  isLoading?: boolean;
  isInstructor?: boolean;
}

export function ArticleEditor({ initialData, categories, onSave, onSubmitForReview, isLoading, isInstructor }: ArticleEditorProps) {
  const [formData, setFormData] = useState<Partial<Article>>({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    cover_image: initialData?.cover_image || "",
    category_id: initialData?.category_id || "",
    seo_title: initialData?.seo_title || "",
    seo_description: initialData?.seo_description || "",
    featured: initialData?.featured || false,
    status: initialData?.status || "draft"
  });

  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  const handleChange = (field: keyof Article, value: any) => {
    setFormData(prev => {
      const next = { ...prev, [field]: value };
      // auto generate slug from title if slug is empty
      if (field === 'title' && !prev.slug && typeof value === 'string') {
        next.slug = value.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      return next;
    });
  };

  const handleSaveDraft = () => {
    onSave({ ...formData, status: "draft" });
  };

  const handlePublish = () => {
    onSave({ ...formData, status: "published" });
  };

  return (
    <div className="space-y-8 pb-32">
      {/* Editor Header Actions */}
      <div className="flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur-md z-10 py-4 border-b">
        <h2 className="text-2xl font-bold">{initialData?.id ? 'تعديل المقال' : 'مقال جديد'}</h2>
        <div className="flex gap-4">
          <Button variant="outline" onClick={handleSaveDraft} disabled={isLoading}>
            <Save className="w-4 h-4 ml-2" /> حفظ كمسودة
          </Button>
          
          {isInstructor && formData.status === 'draft' && onSubmitForReview && (
            <Button onClick={onSubmitForReview} disabled={isLoading} className="bg-[#D4A373] text-black">
              <Send className="w-4 h-4 ml-2" /> إرسال للمراجعة
            </Button>
          )}

          {!isInstructor && (
            <Button onClick={handlePublish} disabled={isLoading} className="bg-green-600 text-white hover:bg-green-700">
              <Send className="w-4 h-4 ml-2" /> نشر المقال
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <Label>عنوان المقال</Label>
            <Input 
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="اكتب عنواناً جذاباً..."
              className="text-xl font-bold h-14"
            />
          </div>

          <div className="space-y-2">
            <Label>المحتوى (يدعم Markdown)</Label>
            <div className="flex border-b mb-4">
              <button 
                className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'write' ? 'border-[#D4A373] text-[#D4A373]' : 'border-transparent text-muted-foreground'}`}
                onClick={() => setActiveTab('write')}
              >
                كتابة
              </button>
              <button 
                className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'preview' ? 'border-[#D4A373] text-[#D4A373]' : 'border-transparent text-muted-foreground'}`}
                onClick={() => setActiveTab('preview')}
              >
                معاينة
              </button>
            </div>
            
            {activeTab === 'write' ? (
              <Textarea 
                value={formData.content}
                onChange={(e) => handleChange('content', e.target.value)}
                placeholder="ابدأ بكتابة مقالك هنا..."
                className="min-h-[500px] font-mono text-base resize-y"
              />
            ) : (
              <div className="min-h-[500px] p-6 border rounded-md prose prose-invert max-w-none">
                <ReactMarkdown>{formData.content || "*لا يوجد محتوى لمعاينته*"}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Settings Area */}
        <div className="space-y-6">
          
          <div className="bg-muted/50 p-6 rounded-xl space-y-6 border border-border/50">
            <h3 className="font-bold text-lg border-b pb-2">إعدادات النشر</h3>
            
            <div className="space-y-2">
              <Label>رابط المقال (Slug)</Label>
              <Input 
                value={formData.slug || ""}
                onChange={(e) => handleChange('slug', e.target.value)}
                className="font-mono text-left"
                dir="ltr"
              />
              <p className="text-xs text-muted-foreground">يجب أن يكون فريداً وباللغة الإنجليزية يفضل للـ SEO.</p>
            </div>

            <div className="space-y-2">
              <Label>التصنيف</Label>
              <Select value={formData.category_id} onValueChange={(val) => handleChange('category_id', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر تصنيفاً..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>نبذة مختصرة (Excerpt)</Label>
              <Textarea 
                value={formData.excerpt || ""}
                onChange={(e) => handleChange('excerpt', e.target.value)}
                className="h-24 resize-none"
                placeholder="ملخص قصير يظهر في بطاقة المقال..."
              />
            </div>

            <div className="space-y-2">
              <Label>رابط صورة الغلاف</Label>
              <div className="flex gap-2">
                <Input 
                  value={formData.cover_image || ""}
                  onChange={(e) => handleChange('cover_image', e.target.value)}
                  placeholder="https://..."
                  dir="ltr"
                />
                <Button size="icon" variant="outline"><Image className="w-4 h-4" /></Button>
              </div>
              {formData.cover_image && (
                <div className="mt-2 aspect-video rounded-md overflow-hidden bg-muted">
                  <img src={formData.cover_image} alt="Cover Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {!isInstructor && (
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="space-y-0.5">
                  <Label>مقال مميز</Label>
                  <p className="text-xs text-muted-foreground">عرض المقال في بداية الصفحة</p>
                </div>
                <Switch 
                  checked={formData.featured}
                  onCheckedChange={(val) => handleChange('featured', val)}
                />
              </div>
            )}
          </div>

          <div className="bg-muted/50 p-6 rounded-xl space-y-6 border border-border/50">
            <h3 className="font-bold text-lg border-b pb-2">محركات البحث (SEO)</h3>
            
            <div className="space-y-2">
              <Label>عنوان SEO</Label>
              <Input 
                value={formData.seo_title || ""}
                onChange={(e) => handleChange('seo_title', e.target.value)}
                placeholder="العنوان الذي يظهر في جوجل..."
              />
            </div>

            <div className="space-y-2">
              <Label>وصف SEO</Label>
              <Textarea 
                value={formData.seo_description || ""}
                onChange={(e) => handleChange('seo_description', e.target.value)}
                className="h-24 resize-none"
                placeholder="وصف جذاب لمحركات البحث..."
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
