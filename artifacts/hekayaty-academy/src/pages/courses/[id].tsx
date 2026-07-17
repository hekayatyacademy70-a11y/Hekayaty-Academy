import { PageTransition } from "@/components/ui/PageTransition";
import { Link, useParams } from "wouter";
import { mockCourses } from "@/data/courses";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/StarRating";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PlayCircle, Clock, Users, Award, BookOpen, ChevronLeft } from "lucide-react";
import NotFound from "@/pages/not-found";

export default function CourseDetail() {
  const { id } = useParams();
  const course = mockCourses.find(c => c.id === id);

  if (!course) return <NotFound />;

  return (
    <PageTransition className="min-h-screen bg-background pb-20">
      {/* Course Hero */}
      <section className={`bg-gradient-to-br ${course.thumbnailColor} py-16 text-white relative`}>
        <div className="absolute inset-0 bg-black/40 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="flex items-center gap-2 text-white/70 text-sm mb-6">
            <Link href="/courses" className="hover:text-white transition-colors">الدورات</Link>
            <ChevronLeft className="w-4 h-4" />
            <span>{course.category}</span>
          </div>

          <div className="max-w-3xl">
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-none mb-4">
              {course.level}
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight text-white shadow-sm">
              {course.title}
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl leading-relaxed">
              {course.description || "استكشف هذا البرنامج التدريبي المصمم خصيصاً لتطوير مهاراتك بشكل عملي واحترافي."}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/20 overflow-hidden flex items-center justify-center">
                  <img src={`https://i.pravatar.cc/150?u=${course.instructorId}`} alt={course.instructorName} />
                </div>
                <span>{course.instructorName}</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <StarRating rating={course.rating} className="text-amber-400" />
                <span>{course.rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Users className="w-5 h-5" />
                <span>{course.students.toLocaleString('ar-EG')} طالب</span>
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
                <TabsTrigger value="reviews" className="h-14 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none text-base px-6">التقييمات</TabsTrigger>
                <TabsTrigger value="faq" className="h-14 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none text-base px-6">الأسئلة الشائعة</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="mt-8">
                <h3 className="text-2xl font-bold font-serif mb-6">منهاج الدورة</h3>
                <Accordion type="multiple" className="w-full space-y-4" defaultValue={["item-1"]}>
                  {[1, 2, 3, 4, 5].map((chapter) => (
                    <AccordionItem key={chapter} value={`item-${chapter}`} className="border border-border rounded-lg bg-card px-4">
                      <AccordionTrigger className="hover:no-underline py-4 text-lg font-bold">
                        <div className="flex justify-between w-full pr-4">
                          <span>الوحدة {chapter}: أساسيات البناء السردي</span>
                          <span className="text-sm font-normal text-muted-foreground">3 دروس • 45 دقيقة</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4">
                        <div className="space-y-2 pl-4">
                          {[1, 2, 3].map((lesson) => (
                            <div key={lesson} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-md transition-colors cursor-pointer">
                              <div className="flex items-center gap-3">
                                <PlayCircle className="w-5 h-5 text-primary opacity-80" />
                                <span className="font-medium">الدرس {lesson}: مقدمة في تقنيات السرد</span>
                              </div>
                              <span className="text-sm text-muted-foreground">15:00</span>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>

              <TabsContent value="instructor" className="mt-8">
                <h3 className="text-2xl font-bold font-serif mb-6">عن المدرب</h3>
                <div className="flex flex-col sm:flex-row gap-6 p-6 rounded-2xl bg-card border border-border">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden flex-shrink-0 bg-muted">
                    <img src={`https://i.pravatar.cc/150?u=${course.instructorId}`} alt={course.instructorName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">{course.instructorName}</h4>
                    <p className="text-primary font-medium mb-4">مدرب محترف في منصة حكاياتي</p>
                    <p className="text-muted-foreground leading-relaxed">
                      روائي وصانع محتوى لديه أكثر من 15 عاماً من الخبرة في مجال الكتابة والنشر. 
                      صدرت له العديد من المؤلفات التي تصدرت قوائم المبيعات في العالم العربي.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-8">
                <h3 className="text-2xl font-bold font-serif mb-6">التقييمات</h3>
                <div className="text-center p-12 border border-dashed border-border rounded-2xl bg-muted/30">
                  <Star className="w-12 h-12 text-muted-foreground opacity-50 mx-auto mb-4" />
                  <p className="text-lg font-medium">قريباً</p>
                  <p className="text-muted-foreground">نعمل على إضافة نظام تقييم متقدم</p>
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
                        نعم، نحن نقدم محتوى متكامل يبدأ معك من الصفر وحتى الاحتراف. جميع دوراتنا تتضمن شهادة إتمام وتتيح لك التواصل المباشر مع المدرب عبر منصة المنتدى الخاصة بالدورة.
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
                    <span className="text-4xl font-bold font-serif text-primary mb-1 block">${course.price}</span>
                    <span className="text-sm text-muted-foreground">دفع مرة واحدة فقط</span>
                  </div>

                  <Button size="lg" className="w-full h-14 text-lg font-bold mb-4">
                    التحق بالدورة الآن
                  </Button>
                  <Button variant="outline" size="lg" className="w-full h-12 mb-6 border-dashed">
                    إضافة إلى قائمة الأمنيات
                  </Button>

                  <div className="space-y-4 pt-6 border-t border-border">
                    <h4 className="font-bold text-foreground">تتضمن هذه الدورة:</h4>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{course.duration} من المحتوى المرئي</span>
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
