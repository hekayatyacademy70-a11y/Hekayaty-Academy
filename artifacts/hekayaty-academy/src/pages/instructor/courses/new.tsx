import { PageTransition } from "@/components/ui/PageTransition";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  PlusCircle, GripVertical, Trash2, Video, FileText,
  Save, Eye, ArrowRight, Upload, CheckCircle2, Loader2, Image as ImageIcon, AlertCircle
} from "lucide-react";
import { Link, useLocation } from "wouter";

interface LessonDraft {
  id: string;
  title: string;
  type: "video" | "text" | "quiz";
  youtubeVideoId?: string;
}

const initLessons: LessonDraft[] = [
  { id: "l1", title: "مرحباً بك في الدورة", type: "video" },
  { id: "l2", title: "ما ستتعلمه؟", type: "video" },
];

let idCounter = 10;

export default function CourseBuilder() {
  const [lessons, setLessons] = useState<LessonDraft[]>(initLessons);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [price, setPrice] = useState("");
  const [whatsappLink, setWhatsappLink] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [published, setPublished] = useState(false);
  const [, navigate] = useLocation();

  // Image Upload State
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addLesson = () => {
    setLessons(l => [...l, { id: `l${++idCounter}`, title: "فيديو جديد", type: "video" }]);
  };

  const removeLesson = (lessonId: string) => {
    setLessons(l => l.filter(lesson => lesson.id !== lessonId));
  };

  const updateLessonTitle = (lessonId: string, title: string) => {
    setLessons(l => l.map(lesson => lesson.id === lessonId ? { ...lesson, title } : lesson));
  };

  const updateLessonYoutubeId = (lessonId: string, youtubeVideoId: string) => {
    setLessons(l => l.map(lesson => lesson.id === lessonId ? { ...lesson, youtubeVideoId } : lesson));
  };

  const extractYoutubeId = (input: string) => {
    if (!input) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = input.match(regExp);
    return (match && match[2].length === 11) ? match[2] : input;
  };

  const handlePublish = async () => {
    if (!courseTitle.trim()) {
      setPublishError("يرجى إدخال عنوان الدورة");
      return;
    }
    setPublishError(null);
    setIsPublishing(true);
    try {
      const token = localStorage.getItem("hekayaty-token");
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: courseTitle,
          description: courseDesc,
          thumbnailUrl,
          price,
          level,
          category,
          whatsappLink,
          lessons: lessons.map(l => ({
            title: l.title,
            youtubeVideoId: extractYoutubeId(l.youtubeVideoId || ""),
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.error || "حدث خطأ أثناء النشر");
      } else {
        setPublished(true);
        setTimeout(() => navigate("/instructor"), 1500);
      }
    } catch {
      setPublishError("فشل الاتصال بالخادم");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    const token = localStorage.getItem("hekayaty-token");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/assets/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      if (data.url) {
        setThumbnailUrl(data.url);
      } else {
        alert("فشل رفع الصورة");
      }
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء الرفع");
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <PageTransition dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/instructor">
          <Button variant="ghost" size="icon"><ArrowRight className="w-5 h-5" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-serif">منشئ الدورات</h1>
          <p className="text-muted-foreground text-sm">أنشئ دورتك ببساطة</p>
        </div>
        <div className="mr-auto flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2"><Eye className="w-4 h-4" />معاينة</Button>
          <Button size="sm" className="gap-2" onClick={handlePublish} disabled={isPublishing || published}>
            {published ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {published ? "تم النشر!" : "نشر"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Curriculum Builder */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">فيديوهات الدورة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {lessons.map((lesson, index) => (
                <div key={lesson.id} className="flex flex-col gap-2 p-3 rounded-xl border border-border bg-card hover:bg-muted/30 group">
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab shrink-0" />
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      {lesson.type === "video"
                        ? <Video className="w-4 h-4 text-primary" />
                        : <FileText className="w-4 h-4 text-primary" />}
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <span className="text-xs text-muted-foreground font-medium shrink-0">عنوان الفيديو:</span>
                      <Input
                        value={lesson.title}
                        onChange={e => updateLessonTitle(lesson.id, e.target.value)}
                        className="h-9 border border-input bg-background px-3 rounded-md text-sm font-bold focus-visible:ring-1 focus-visible:ring-primary flex-1"
                        placeholder="أدخل عنوان الفيديو..."
                      />
                    </div>
                    <Button
                      variant="ghost" size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive transition-all"
                      onClick={() => removeLesson(lesson.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {lesson.type === "video" && (
                    <div className="pl-11 flex items-center gap-2 mt-1">
                      <div className="w-full flex items-center bg-muted/50 rounded-lg overflow-hidden px-3 border border-border focus-within:border-primary/50 transition-colors">
                        <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">YouTube ID:</span>
                        <Input
                          placeholder="مثال: dQw4w9WgXcQ"
                          value={lesson.youtubeVideoId || ""}
                          onChange={e => updateLessonYoutubeId(lesson.id, e.target.value)}
                          className="h-9 text-sm border-0 bg-transparent focus-visible:ring-0"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              <Button 
                variant="outline" 
                className="w-full gap-2 border-dashed h-12 mt-4 hover:bg-primary/5 hover:text-primary hover:border-primary/50 transition-colors" 
                onClick={addLesson}
              >
                <PlusCircle className="w-5 h-5" />
                إضافة فيديو جديد
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right: Course Metadata */}
        <div className="space-y-5">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">معلومات الدورة</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>عنوان الدورة</Label>
                <Input
                  placeholder="أدخل عنواناً جذاباً..."
                  value={courseTitle}
                  onChange={e => setCourseTitle(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>وصف الدورة</Label>
                <Textarea
                  placeholder="صف ما سيتعلمه الطلاب..."
                  rows={4}
                  className="resize-none"
                  value={courseDesc}
                  onChange={e => setCourseDesc(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>التصنيف</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger><SelectValue placeholder="اختر..." /></SelectTrigger>
                    <SelectContent>
                      {["الرواية", "القصة القصيرة", "السيناريو", "الشعر", "النشر"].map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>المستوى</Label>
                  <Select value={level} onValueChange={setLevel}>
                    <SelectTrigger><SelectValue placeholder="اختر..." /></SelectTrigger>
                    <SelectContent>
                      {[
                        { label: "مبتدئ", value: "beginner" },
                        { label: "متوسط", value: "intermediate" },
                        { label: "متقدم", value: "advanced" }
                      ].map(l => (
                        <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>السعر (جنيه)</Label>
                  <Input type="number" placeholder="مثال: 199" value={price} onChange={e => setPrice(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>رابط جروب الواتساب</Label>
                  <Input type="url" placeholder="https://chat.whatsapp.com/..." value={whatsappLink} onChange={e => setWhatsappLink(e.target.value)} dir="ltr" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thumbnail upload */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">صورة الغلاف</CardTitle></CardHeader>
            <CardContent>
              <div 
                className="relative aspect-video rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-3 bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors overflow-hidden group"
                onClick={handleUploadClick}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                
                {thumbnailUrl ? (
                  <>
                    <img src={thumbnailUrl} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ImageIcon className="w-8 h-8 text-white mb-2" />
                      <p className="text-white text-sm font-medium">تغيير الصورة</p>
                    </div>
                  </>
                ) : isUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-sm text-muted-foreground">جاري الرفع...</p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-muted-foreground opacity-50" />
                    <p className="text-sm text-muted-foreground">اسحب أو انقر للرفع</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG حتى 5MB</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {publishError && (
            <div className="flex items-center gap-2 text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{publishError}</span>
            </div>
          )}
          <Button
            className="w-full font-bold h-12"
            onClick={handlePublish}
            disabled={isPublishing || published}
          >
            {published ? (
              <><CheckCircle2 className="w-4 h-4 ml-2" />تم النشر بنجاح!</>
            ) : isPublishing ? (
              <><Loader2 className="w-4 h-4 ml-2 animate-spin" />جاري النشر...</>
            ) : (
              "نشر الدورة"
            )}
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}
