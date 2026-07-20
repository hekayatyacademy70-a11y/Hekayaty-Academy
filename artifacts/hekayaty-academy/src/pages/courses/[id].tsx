import { PageTransition } from "@/components/ui/PageTransition";
import { Link, useParams, useLocation } from "wouter";
import { useGetCourseById, useEnrollInCourse, getGetCourseByIdQueryKey } from "@workspace/api-client-react";
import { SEO } from "@/components/seo/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  PlayCircle, Lock, Clock, Users, Award, BookOpen, ChevronLeft,
  Loader2, CreditCard, CheckCircle2, AlertCircle, Upload, X, ExternalLink,
  Smartphone, MessageSquare
} from "lucide-react";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const levelLabels: Record<string, string> = {
  beginner: "مبتدئ",
  intermediate: "متوسط",
  advanced: "متقدم",
  all: "الجميع",
};

// ─── InstaPay Config ───
const INSTAPAY_CONFIG = {
  accountNumber: "01272404623",
  instructions: [
    "افتح تطبيق البنك الخاص بك وابحث عن تحويل InstaPay",
    "أدخل الرقم المذكور أعلاه",
    "أدخل المبلغ المطلوب بالضبط",
    "احتفظ بصورة من إيصال التحويل",
    "أدخل رقم المعاملة وارفع الإيصال هنا",
  ],
};

// ─── API helpers ───
async function apiCall(method: string, path: string, body?: any) {
  const token = localStorage.getItem("hekayaty-token");
  const res = await fetch(`/api${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Request failed");
  return data;
}

// ─── Upload receipt to Cloudinary ───
async function uploadReceiptToCloudinary(file: File): Promise<{ url: string; publicId: string }> {
  const token = localStorage.getItem("hekayaty-token");
  const formData = new FormData();
  formData.append("file", file);
  
  const res = await fetch(`/api/assets/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Image upload failed");
  return { url: data.url, publicId: data.publicId };
}

// ─────────────────────────────────────────────
// INSTAPAY PURCHASE MODAL
// ─────────────────────────────────────────────
type ModalStep = "instructions" | "upload" | "success";

function InstapayModal({
  course,
  purchaseRequestId,
  onClose,
  onComplete,
}: {
  course: { id: string; title: string; price: number };
  purchaseRequestId: string;
  onClose: () => void;
  onComplete: () => void;
}) {
  const [step, setStep] = useState<ModalStep>("instructions");
  const [transactionId, setTransactionId] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReceiptFile(file);
    setReceiptPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!transactionId.trim()) { setError("أدخل رقم المعاملة"); return; }
    if (!receiptFile) { setError("ارفع صورة الإيصال"); return; }
    setLoading(true);
    setError(null);
    try {
      const { url, publicId } = await uploadReceiptToCloudinary(receiptFile);
      await apiCall("POST", `/payments/${purchaseRequestId}/submit`, {
        transactionId: transactionId.trim(),
        receiptImageUrl: url,
        receiptImagePublicId: publicId,
      });
      setStep("success");
      onComplete();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">الدفع عبر InstaPay</h2>
              <p className="text-xs text-muted-foreground">{course.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step: Instructions */}
        {step === "instructions" && (
          <div className="p-5 space-y-4">
            {/* Amount */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">المبلغ المطلوب</p>
              <p className="text-4xl font-bold text-primary font-serif">{course.price}</p>
              <p className="text-sm text-muted-foreground">جنيه مصري</p>
            </div>

            {/* Account Number */}
            <div className="bg-muted/40 rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">رقم InstaPay</p>
              <p className="text-2xl font-bold text-foreground font-mono tracking-widest">{INSTAPAY_CONFIG.accountNumber}</p>
            </div>

            {/* Steps */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">خطوات الدفع:</p>
              <ol className="space-y-2">
                {INSTAPAY_CONFIG.instructions.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <Button className="w-full h-12 font-bold" onClick={() => setStep("upload")}>
              لقد أجريت التحويل — ارفع الإيصال
            </Button>
          </div>
        )}

        {/* Step: Upload */}
        {step === "upload" && (
          <div className="p-5 space-y-4">
            <div>
              <Label htmlFor="tid" className="text-sm font-semibold">رقم المعاملة (Transaction ID)</Label>
              <Input
                id="tid"
                className="mt-1.5"
                placeholder="مثال: TXN123456789"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                dir="ltr"
              />
            </div>

            <div>
              <Label className="text-sm font-semibold">صورة الإيصال</Label>
              <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
              {receiptPreview ? (
                <div className="mt-1.5 relative rounded-xl overflow-hidden border border-border">
                  <img src={receiptPreview} alt="receipt" className="w-full h-40 object-cover" />
                  <button
                    className="absolute top-2 left-2 bg-black/50 rounded-full p-1"
                    onClick={() => { setReceiptFile(null); setReceiptPreview(null); }}
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ) : (
                <div
                  className="mt-1.5 border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">اضغط لرفع صورة الإيصال</p>
                </div>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 px-3 py-2 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep("instructions")}>رجوع</Button>
              <Button className="flex-1 h-11 font-bold" onClick={handleSubmit} disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "إرسال للمراجعة"}
              </Button>
            </div>
          </div>
        )}

        {/* Step: Success */}
        {step === "success" && (
          <div className="p-8 text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto"
            >
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </motion.div>
            <h3 className="text-xl font-bold text-foreground">تم إرسال طلب الدفع!</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              سيقوم المدرب بمراجعة إيصالك وتفعيل اشتراكك في غضون ٢٤ ساعة.
              ستتلقى إشعاراً فور الموافقة.
            </p>
            <Link href="/dashboard/purchases">
              <Button className="w-full" onClick={onClose}>
                متابعة طلبات الشراء
              </Button>
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PURCHASE CTA BUTTON
// ─────────────────────────────────────────────
function PurchaseCTA({ course }: { course: any }) {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [accessInfo, setAccessInfo] = useState<{
    hasAccess: boolean; isFree: boolean; purchaseStatus: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [initiating, setInitiating] = useState(false);
  const [purchaseRequestId, setPurchaseRequestId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const enrollMutation = useEnrollInCourse();

  useEffect(() => {
    if (!isAuthenticated || course.price === 0) {
      setAccessInfo({ hasAccess: course.price === 0, isFree: course.price === 0, purchaseStatus: null });
      return;
    }
    const fetchAccess = async () => {
      try {
        const data = await apiCall("GET", `/payments/access/${course.id}`);
        setAccessInfo(data);
        if (data.purchaseStatus === "pending_payment" || data.purchaseStatus === "pending_verification") {
          // Fetch the existing request ID
          const purchases = await apiCall("GET", "/payments/my");
          const existing = purchases.purchases?.find((p: any) => p.course.id === course.id);
          if (existing) setPurchaseRequestId(existing.id);
        }
      } catch {}
    };
    fetchAccess();
  }, [course.id, isAuthenticated]);

  const firstLesson = course.sections?.[0]?.lessons?.[0];

  const handlePurchase = async () => {
    if (!isAuthenticated) { navigate("/auth/login"); return; }
    setInitiating(true);
    try {
      const result = await apiCall("POST", "/payments/initiate", { courseId: course.id });
      setPurchaseRequestId(result.purchaseRequestId);
      setAccessInfo((prev) => ({ ...prev!, purchaseStatus: result.status }));
      if (result.status === "pending_payment") {
        setShowModal(true);
      } else if (result.status === "pending_verification") {
        setShowModal(true);
      }
    } catch (e: any) {
      console.error(e.message);
    } finally {
      setInitiating(false);
    }
  };

  if (!accessInfo) {
    return <Button size="lg" className="w-full h-14 text-lg font-bold" disabled><Loader2 className="animate-spin" /></Button>;
  }

  // Free course
  if (accessInfo.isFree || course.price === 0) {
    if (firstLesson) {
      return (
        <Link href={`/courses/${course.id}/lessons/${firstLesson.id}`}>
          <Button size="lg" className="w-full h-14 text-lg font-bold">ابدأ التعلم الآن ←</Button>
        </Link>
      );
    }
    return (
      <Button size="lg" className="w-full h-14 text-lg font-bold"
        onClick={() => enrollMutation.mutate({ data: { courseId: course.id } })}
        disabled={enrollMutation.isPending}>
        {enrollMutation.isPending ? <Loader2 className="animate-spin w-5 h-5" /> : "سجّل في الدورة ←"}
      </Button>
    );
  }

  // Has access (paid & approved)
  if (accessInfo.hasAccess && firstLesson) {
    return (
      <div className="space-y-3">
        <Link href={`/courses/${course.id}/lessons/${firstLesson.id}`}>
          <Button size="lg" className="w-full h-14 text-lg font-bold bg-emerald-600 hover:bg-emerald-700">
            <CheckCircle2 className="w-5 h-5 ml-2" /> ادخل إلى الدورة
          </Button>
        </Link>
        {(course as any).whatsappLink && (
          <a href={(course as any).whatsappLink} target="_blank" rel="noreferrer" className="block">
            <Button size="lg" variant="outline" className="w-full h-14 text-lg font-bold border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10">
              <MessageSquare className="w-5 h-5 ml-2" /> الانضمام لجروب الواتساب
            </Button>
          </a>
        )}
      </div>
    );
  }

  // Pending verification
  if (accessInfo.purchaseStatus === "pending_verification") {
    return (
      <div className="space-y-3">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-center">
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">طلبك قيد المراجعة</p>
          <p className="text-xs text-muted-foreground mt-1">سيتم تفعيل اشتراكك فور موافقة المدرب</p>
        </div>
        <Link href="/dashboard/purchases">
          <Button variant="outline" className="w-full">متابعة الطلب</Button>
        </Link>
      </div>
    );
  }

  // Pending payment (initiated but not submitted)
  if (accessInfo.purchaseStatus === "pending_payment") {
    return (
      <>
        <Button size="lg" className="w-full h-14 text-lg font-bold"
          onClick={() => setShowModal(true)} disabled={initiating}>
          <CreditCard className="w-5 h-5 ml-2" />
          أكمل الدفع
        </Button>
        {showModal && purchaseRequestId && (
          <InstapayModal
            course={course}
            purchaseRequestId={purchaseRequestId}
            onClose={() => setShowModal(false)}
            onComplete={() => setAccessInfo((prev) => ({ ...prev!, purchaseStatus: "pending_verification" }))}
          />
        )}
      </>
    );
  }

  // Default: not purchased yet
  return (
    <>
      <Button size="lg" className="w-full h-14 text-lg font-bold"
        onClick={handlePurchase} disabled={initiating}>
        {initiating ? <Loader2 className="animate-spin w-5 h-5" /> : (
          <><CreditCard className="w-5 h-5 ml-2" />اشتر الدورة — {course.price} ج.م</>
        )}
      </Button>
      {showModal && purchaseRequestId && (
        <InstapayModal
          course={course}
          purchaseRequestId={purchaseRequestId}
          onClose={() => setShowModal(false)}
          onComplete={() => setAccessInfo((prev) => ({ ...prev!, purchaseStatus: "pending_verification" }))}
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────────
// MAIN COURSE DETAIL PAGE
// ─────────────────────────────────────────────
export default function CourseDetail() {
  const { id } = useParams();

  const { data: course, isLoading, isError } = useGetCourseById(id ?? "", {
    query: { queryKey: getGetCourseByIdQueryKey(id ?? ""), enabled: !!id }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (isError || !course) return <NotFound />;

  const levelLabel = levelLabels[course.level] ?? course.level;
  const instructorName = course.instructor?.name ?? "مدرب حكاياتي";

  return (
    <PageTransition className="min-h-screen bg-background pb-20">
      <SEO 
        title={course.title} 
        description={course.description || undefined} 
        ogImage={course.thumbnailUrl || undefined}
      />
      {/* Course Hero */}
      <section 
        className="bg-gradient-to-br from-amber-700 to-stone-900 py-16 text-white relative"
        style={course.thumbnailUrl ? {
          backgroundImage: `url(${course.thumbnailUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : undefined}
      >
        <div className={`absolute inset-0 ${course.thumbnailUrl ? 'bg-black/70' : 'bg-black/40 mix-blend-overlay'}`}></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="flex items-center gap-2 text-white/70 text-sm mb-6">
            <Link href="/courses" className="hover:text-white transition-colors">الدورات</Link>
            <ChevronLeft className="w-4 h-4" />
            <span>{levelLabel}</span>
          </div>

          <div className="max-w-3xl">
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-none mb-4">{levelLabel}</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight text-white shadow-sm">
              {course.title}
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl leading-relaxed">
              {course.description || "استكشف هذا البرنامج التدريبي المصمم خصيصاً لتطوير مهاراتك بشكل عملي واحترافي."}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/20 overflow-hidden flex items-center justify-center">
                  <img src={`https://i.pravatar.cc/150?u=${course.instructorId}`} alt={instructorName} />
                </div>
                <span>{instructorName}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Left Column (Content) */}
          <div className="flex-1 w-full">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="w-full justify-start h-14 bg-transparent border-b border-border rounded-none p-0">
                <TabsTrigger value="content" className="h-14 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none text-base px-6">المحتوى</TabsTrigger>
                <TabsTrigger value="instructor" className="h-14 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none text-base px-6">المدرب</TabsTrigger>
                <TabsTrigger value="faq" className="h-14 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none text-base px-6">الأسئلة الشائعة</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="mt-8">
                <h3 className="text-2xl font-bold font-serif mb-6">منهاج الدورة</h3>
                {course.sections && course.sections.length > 0 ? (
                  <Accordion type="multiple" className="w-full space-y-4" defaultValue={[course.sections[0]?.id]}>
                    {course.sections.map((section) => (
                      <AccordionItem key={section.id} value={section.id} className="border border-border rounded-lg bg-card px-4">
                        <AccordionTrigger className="hover:no-underline py-4 text-lg font-bold">
                          <div className="flex justify-between w-full pr-4">
                            <span>{section.title}</span>
                            <span className="text-sm font-normal text-muted-foreground">
                              {section.lessons?.length ?? 0} دروس
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 pb-4">
                          <div className="space-y-2 pl-4">
                            {section.lessons?.map((lesson) => (
                              <div key={lesson.id} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-md transition-colors">
                                <div className="flex items-center gap-3">
                                  {lesson.isFreePreview
                                    ? <PlayCircle className="w-5 h-5 text-primary opacity-80" />
                                    : <Lock className="w-4 h-4 text-muted-foreground opacity-60" />
                                  }
                                  <span className="font-medium">{lesson.title}</span>
                                  {lesson.isFreePreview && (
                                    <Badge variant="outline" className="text-xs border-primary/30 text-primary">مجاني</Badge>
                                  )}
                                </div>
                                {lesson.duration && (
                                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {Math.floor(lesson.duration / 60)} دقيقة
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="text-center py-12 bg-muted/30 rounded-2xl border border-dashed border-border">
                    <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
                    <p className="text-muted-foreground">لم يُضف المدرب محتوى بعد.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="instructor" className="mt-8">
                <h3 className="text-2xl font-bold font-serif mb-6">عن المدرب</h3>
                <div className="flex flex-col sm:flex-row gap-6 p-6 rounded-2xl bg-card border border-border">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden flex-shrink-0 bg-muted">
                    <img src={`https://i.pravatar.cc/150?u=${course.instructorId}`} alt={instructorName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">{instructorName}</h4>
                    <p className="text-primary font-medium mb-4">مدرب محترف في منصة حكاياتي</p>
                    <p className="text-muted-foreground leading-relaxed">
                      روائي وصانع محتوى لديه أكثر من 15 عاماً من الخبرة في مجال الكتابة والنشر.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="faq" className="mt-8">
                <h3 className="text-2xl font-bold font-serif mb-6">الأسئلة الشائعة</h3>
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {[
                    "هل هذه الدورة مناسبة للمبتدئين؟",
                    "هل أحصل على شهادة بعد إتمام الدورة؟",
                    "كيف أستطيع التواصل مع المدرب؟",
                    "ما هي سياسة الاسترداد؟"
                  ].map((q, i) => (
                    <AccordionItem key={i} value={`q-${i}`} className="border border-border rounded-lg bg-card px-4">
                      <AccordionTrigger className="hover:no-underline font-bold text-base py-4">{q}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        نعم، نحن نقدم محتوى متكامل يبدأ معك من الصفر وحتى الاحتراف.
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column (Sticky Sidebar) */}
          <aside className="w-full lg:w-96 flex-shrink-0 relative">
            <div className="sticky top-24">
              <Card className="border-border shadow-xl hover-elevate">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold font-serif text-primary mb-1 block">
                      {course.price === 0 ? "مجاني" : `${course.price} ج.م`}
                    </span>
                    {course.price > 0 && (
                      <span className="text-sm text-muted-foreground">دفع مرة واحدة فقط</span>
                    )}
                  </div>

                  <PurchaseCTA course={course} />

                  <Button variant="outline" size="lg" className="w-full h-12 mt-3 border-dashed">
                    إضافة إلى قائمة الأمنيات
                  </Button>

                  <div className="space-y-4 pt-6 mt-4 border-t border-border">
                    <h4 className="font-bold text-foreground">تتضمن هذه الدورة:</h4>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{course.sections?.reduce((acc, s) => acc + (s.lessons?.length ?? 0), 0) ?? 0} درس</span>
                      </li>
                      <li className="flex items-center gap-3 text-sm text-muted-foreground">
                        <BookOpen className="w-4 h-4 text-primary" />
                        <span>15 ملف تدريبي قابل للتحميل</span>
                      </li>
                      <li className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Users className="w-4 h-4 text-primary" />
                        <span>دخول دائم لمجتمع المتدربين</span>
                      </li>
                      <li className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Award className="w-4 h-4 text-primary" />
                        <span>شهادة إتمام معتمدة</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>

        </div>
      </section>
    </PageTransition>
  );
}
