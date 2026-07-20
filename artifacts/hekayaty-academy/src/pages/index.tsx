import { PageTransition } from "@/components/ui/PageTransition";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/seo/SEO";
import { useGetCourses, useGetInstructors, useGetPaths } from "@workspace/api-client-react";
import type { CourseCardData } from "@/types/course";

import { CourseCard } from "@/components/ui/CourseCard";
import { InstructorCard } from "@/components/ui/InstructorCard";
import { motion } from "framer-motion";
import { BookOpen, Star, Trophy, Users, User, PenTool, ArrowLeft, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const { data: apiCourses = [], isLoading: coursesLoading } = useGetCourses();

  const featuredCourses: CourseCardData[] = apiCourses.slice(0, 6).map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    thumbnailUrl: c.thumbnailUrl,
    instructorId: c.instructorId,
    price: c.price,
    level: c.level,
    status: c.status,
    isPremium: c.isPremium,
    category: (c as any).category,
  }));
  const { data: apiInstructors = [], isLoading: instructorsLoading } = useGetInstructors();
  const topInstructors = apiInstructors.slice(0, 4);
  const { data: apiPaths = [], isLoading: pathsLoading } = useGetPaths();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <PageTransition className="flex flex-col min-h-screen">
      <SEO title="الرئيسية" />
      {/* Hero Section */}
      <section className="relative w-full min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] flex items-center bg-black overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-[center_15%]"
            style={{ backgroundImage: "url('/hero-bg.jpg')" }}
          ></div>
          {/* Dark gradient ONLY on the right half for text readability, leaving the left side 100% clear */}
          <div className="absolute inset-y-0 right-0 w-full md:w-[70%] bg-gradient-to-l from-black/95 via-black/60 to-transparent"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center py-12 md:py-20">
          {/* Text Content - Right Aligned */}
          <div className="flex-1 text-right flex flex-col items-end">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <h2 className="text-xl md:text-3xl text-white font-serif mb-3 font-medium">أكاديمية حكاياتي</h2>
              <h3 className="text-lg md:text-2xl text-white font-serif mb-6">حيث تبدأ رحلتك لتصبح</h3>
              <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-serif font-bold text-[#D4A373] mb-8 leading-normal drop-shadow-md pt-2">
                كاتبًا محترفًا
              </h1>
              <p className="text-base md:text-lg text-white/80 mb-10 leading-relaxed text-right max-w-xl ml-auto font-medium">
                تعلم فنون الكتابة والإبداع والنشر من أفضل الخبراء. انضم إلى مجتمع الكتاب الأكبر في العالم العربي.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-end mb-12">
                <Link href="/auth/register">
                  <Button size="lg" className="w-full sm:w-auto h-12 px-10 text-base font-bold bg-[#D4A373] hover:bg-[#C69249] text-black rounded-md">
                    إبدأ رحلتك الآن
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base border-white/30 text-white hover:bg-white/10 gap-3 rounded-md">
                    <ArrowLeft className="w-4 h-4" />
                    استكشف الدورات
                  </Button>
                </Link>
              </div>
              

            </motion.div>
          </div>
          
          {/* Empty Left Side to let background shine */}
          <div className="flex-1 hidden md:block">
          </div>
        </div>


      </section>

      {/* Why Hekayaty */}
      <section className="py-24 bg-[#0e0b07] relative z-20 border-t border-[#D4A373]/10">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="w-12 h-1 bg-[#D4A373] mx-auto mb-6 rounded-full"></div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">لماذا حكاياتي؟</h2>
            <p className="text-lg text-white/60">
              بنينا منصة متكاملة تأخذ بيدك في كل خطوة من رحلتك الأدبية، بأسلوب احترافي وعصري.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { icon: BookOpen, title: "مناهج عالمية", desc: "محتوى تعليمي مصمم وفق أحدث المعايير العالمية في الكتابة الإبداعية." },
              { icon: Users, title: "مجتمع داعم", desc: "تواصل مع آلاف الكتاب المبتدئين والمحترفين لتبادل الخبرات والآراء." },
              { icon: Star, title: "نخبة المدربين", desc: "تعلم من روائيين وكتاب سيناريو حاصلين على جوائز عربية وعالمية." },
              { icon: PenTool, title: "ستوديو الكتابة", desc: "مساحة عمل متكاملة مصممة خصيصاً للروائيين للتركيز والإنجاز." },
              { icon: Trophy, title: "مسابقات وجوائز", desc: "شارك في مسابقات دورية واحصل على فرص لنشر أعمالك." },
              { icon: BookOpen, title: "شهادات معتمدة", desc: "احصل على شهادات إتمام تعزز من سيرتك الذاتية في المجال الثقافي." },
            ].map((feature, i) => (
              <motion.div key={i} variants={itemVariants} className="bg-white/5 border border-[#D4A373]/20 p-8 rounded-2xl hover:border-[#D4A373]/50 hover:bg-white/8 transition-all duration-300 group">
                <div className="w-14 h-14 rounded-xl bg-[#D4A373]/10 border border-[#D4A373]/30 flex items-center justify-center text-[#D4A373] mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-white/50 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-24 bg-[#090604] border-y border-[#D4A373]/10">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="w-12 h-1 bg-[#D4A373] mb-6 rounded-full"></div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">الدورات المميزة</h2>
              <p className="text-lg text-white/60 max-w-2xl">
                اكتشف أكثر الدورات شعبية بين طلابنا، والمصممة بعناية لصقل موهبتك.
              </p>
            </div>
            <Link href="/courses">
              <Button variant="outline" className="gap-2 border-[#D4A373]/40 text-[#D4A373] bg-transparent hover:bg-[#D4A373]/10 hover:text-[#D4A373]">
                عرض كل الدورات
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {coursesLoading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-80 bg-white/5 rounded-2xl border border-[#D4A373]/10 animate-pulse" />
              ))
            ) : featuredCourses.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-white/40">
                <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin" />
                <p>لا توجد دورات منشورة بعد</p>
              </div>
            ) : (
              featuredCourses.map((course) => (
                <motion.div key={course.id} variants={itemVariants} className="h-full">
                  <CourseCard course={course} />
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-24 bg-[#0e0b07]">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="w-12 h-1 bg-[#D4A373] mx-auto mb-6 rounded-full"></div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">مسارات تعليمية متكاملة</h2>
            <p className="text-lg text-white/60">
              لا تعرف من أين تبدأ؟ اختر المسار الذي يناسب طموحك، وسنرشدك خطوة بخطوة.
            </p>
          </div>

          {pathsLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-10 h-10 text-[#D4A373] animate-spin" />
            </div>
          ) : apiPaths.length === 0 ? (
            <div className="text-center py-20 text-white/40">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">لا توجد مسارات تعليمية متاحة حالياً</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apiPaths.map((path) => (
                <Link key={path.id} href={`/paths/${path.slug || path.id}`} className="block group">
                  <div className="relative p-8 rounded-2xl border border-[#D4A373]/20 bg-white/5 overflow-hidden hover:border-[#D4A373]/50 hover:bg-white/8 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A373]/5 rounded-bl-full -z-10 group-hover:bg-[#D4A373]/10 transition-colors"></div>
                    
                    {path.thumbnailUrl && (
                      <img src={path.thumbnailUrl} alt={path.title} className="w-full h-32 object-cover rounded-xl mb-4 opacity-80" />
                    )}

                    <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-[#D4A373] transition-colors">
                      {path.title}
                    </h3>
                    <p className="text-white/50 mb-6 line-clamp-2">
                      {path.description}
                    </p>
                    
                    <div className="flex items-center gap-3 flex-wrap text-sm font-medium">
                      {path.coursesCount !== undefined && (
                        <span className="bg-[#D4A373]/10 border border-[#D4A373]/20 px-3 py-1 rounded-md text-[#D4A373]">{path.coursesCount} دورات</span>
                      )}
                      {path.durationMonths && (
                        <span className="bg-[#D4A373]/10 border border-[#D4A373]/20 px-3 py-1 rounded-md text-[#D4A373]">{path.durationMonths} أشهر</span>
                      )}
                      {path.level && (
                        <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-md text-white/60">{path.level}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Instructors */}
      <section className="py-24 bg-[#090604] relative overflow-hidden border-t border-[#D4A373]/10">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4A373]/30 to-transparent"></div>
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#D4A373]/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="w-12 h-1 bg-[#D4A373] mb-6 rounded-full"></div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">مدربونا</h2>
              <p className="text-lg text-white/60 max-w-2xl">
                تعلم مباشرة من أفضل الروائيين وصناع المحتوى في العالم العربي.
              </p>
            </div>
            <Link href="/instructors">
              <Button variant="outline" className="gap-2 border-[#D4A373]/40 text-[#D4A373] bg-transparent hover:bg-[#D4A373]/10">
                كل المدربين
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topInstructors.map((instructor, index) => {
              const mappedInstructor = {
                ...instructor,
                // Fallback avatar if null or undefined
                avatar: instructor.avatar || `https://i.pravatar.cc/150?u=${instructor.id || index}`
              };
              return (
                <div key={instructor.id || index}>
                  <InstructorCard instructor={mappedInstructor as any} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 bg-[#050302] relative overflow-hidden border-t border-[#D4A373]/20">
        {/* Ambient golden glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#D4A373]/10 via-transparent to-[#8B6914]/10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#D4A373]/8 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <div className="w-16 h-1 bg-[#D4A373] mx-auto mb-8 rounded-full"></div>
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">
            قصتك العظيمة تبدأ هنا
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-12">
            انضم إلى أكثر من 50,000 كاتب عربي، وابدأ في كتابة روايتك الأولى اليوم بأسلوب احترافي.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="h-14 px-12 text-lg font-bold bg-[#D4A373] hover:bg-[#C69249] text-black shadow-xl shadow-[#D4A373]/20">
                إنضم للأكاديمية الآن
              </Button>
            </Link>
            <Link href="/courses">
              <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-white/20 text-white hover:bg-white/10">
                استكشف الدورات
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </PageTransition>
  );
}
