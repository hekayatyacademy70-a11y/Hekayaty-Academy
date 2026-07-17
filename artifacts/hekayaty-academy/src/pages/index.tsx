import { PageTransition } from "@/components/ui/PageTransition";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { mockCourses } from "@/data/courses";
import { mockPaths } from "@/data/paths";
import { mockInstructors } from "@/data/instructors";
import { CourseCard } from "@/components/ui/CourseCard";
import { InstructorCard } from "@/components/ui/InstructorCard";
import { motion } from "framer-motion";
import { BookOpen, Star, Trophy, Users, PenTool, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const featuredCourses = mockCourses.slice(0, 6);
  const topInstructors = mockInstructors.slice(0, 4);

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
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center bg-sidebar overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-sidebar via-sidebar/80 to-transparent"></div>
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center gap-12 pt-20">
          <div className="flex-1 text-right">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-primary/30 mb-6 text-sm px-4 py-1.5">
                المنصة العربية الأولى للكتابة الإبداعية
              </Badge>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 leading-[1.2] drop-shadow-lg">
                اكتب قصتك <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-300">
                  التي سيقرأها العالم
                </span>
              </h1>
              <p className="text-lg md:text-xl text-sidebar-foreground/80 mb-10 max-w-2xl leading-relaxed">
                انضم إلى أكبر مجتمع للمؤلفين وصناع المحتوى في العالم العربي. تعلم على يد نخبة من الكتاب والروائيين، وطور مهاراتك من الفكرة حتى النشر.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/register">
                  <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-bold shadow-lg shadow-primary/25">
                    ابدأ رحلتك مجاناً
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg border-white/20 text-white hover:bg-white/10">
                    استعرض الدورات
                  </Button>
                </Link>
              </div>
              
              <div className="mt-12 flex items-center gap-8 text-white/60 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span>+50,000 كاتب</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  <span>4.8 متوسط التقييم</span>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="flex-1 hidden md:block">
            {/* Abstract representation of a book/writing */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative w-full max-w-lg mx-auto aspect-[4/5] perspective-1000"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-amber-900/30 rounded-3xl transform rotate-3 blur-sm"></div>
              <div className="absolute inset-0 bg-sidebar border border-white/10 rounded-3xl transform -rotate-2 overflow-hidden shadow-2xl flex flex-col items-center justify-center p-8 text-center relative z-10">
                <PenTool className="w-24 h-24 text-primary mb-8 opacity-80" />
                <h3 className="text-3xl font-serif text-white font-bold mb-4">أكاديمية حكاياتي</h3>
                <p className="text-sidebar-foreground/60 leading-loose">
                  "الكلمة هي بداية كل شيء عظيم... نحن هنا لنعلمك كيف تجعل كلماتك خالدة."
                </p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Hekayaty */}
      <section className="py-24 bg-background relative z-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6">لماذا حكاياتي؟</h2>
            <p className="text-lg text-muted-foreground">
              بنينا منصة متكاملة تأخذ بيدك في كل خطوة من رحلتك الأدبية، بأسلوب احترافي وعصري.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              { icon: BookOpen, title: "مناهج عالمية", desc: "محتوى تعليمي مصمم وفق أحدث المعايير العالمية في الكتابة الإبداعية." },
              { icon: Users, title: "مجتمع داعم", desc: "تواصل مع آلاف الكتاب المبتدئين والمحترفين لتبادل الخبرات والآراء." },
              { icon: Star, title: "نخبة المدربين", desc: "تعلم من روائيين وكتاب سيناريو حاصلين على جوائز عربية وعالمية." },
              { icon: PenTool, title: "ستوديو الكتابة", desc: "مساحة عمل متكاملة مصممة خصيصاً للروائيين للتركيز والإنجاز." },
              { icon: Trophy, title: "مسابقات وجوائز", desc: "شارك في مسابقات دورية واحصل على فرص لنشر أعمالك." },
              { icon: BookOpen, title: "شهادات معتمدة", desc: "احصل على شهادات إتمام تعزز من سيرتك الذاتية في المجال الثقافي." },
            ].map((feature, i) => (
              <motion.div key={i} variants={itemVariants} className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow group hover-elevate">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-24 bg-muted/50 border-y border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4">الدورات المميزة</h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                اكتشف أكثر الدورات شعبية بين طلابنا، والمصممة بعناية لصقل موهبتك.
              </p>
            </div>
            <Link href="/courses">
              <Button variant="outline" className="gap-2 bg-background hover:bg-muted">
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
            {featuredCourses.map(course => (
              <motion.div key={course.id} variants={itemVariants} className="h-full">
                <CourseCard course={course} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6">مسارات تعليمية متكاملة</h2>
            <p className="text-lg text-muted-foreground">
              لا تعرف من أين تبدأ؟ اختر المسار الذي يناسب طموحك، وسنرشدك خطوة بخطوة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockPaths.map((path, i) => (
              <Link key={path.id} href={`/paths/${path.id}`} className="block group">
                <div className="relative p-8 rounded-2xl border border-border bg-card overflow-hidden hover-elevate transition-all duration-300">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:bg-primary/10 transition-colors"></div>
                  
                  <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                    {path.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 h-12">
                    {path.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm font-medium">
                    <span className="bg-muted px-3 py-1 rounded-md text-foreground">{path.coursesCount} دورات</span>
                    <span className="bg-muted px-3 py-1 rounded-md text-foreground">{path.duration}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Instructors */}
      <section className="py-24 bg-sidebar text-sidebar-foreground relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">أسياد الكلمة</h2>
              <p className="text-lg text-sidebar-foreground/80 max-w-2xl">
                تعلم مباشرة من أفضل الروائيين وصناع المحتوى في العالم العربي.
              </p>
            </div>
            <Link href="/instructors">
              <Button variant="outline" className="gap-2 border-white/20 text-white hover:bg-white/10 hover:text-white bg-transparent">
                كل المدربين
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topInstructors.map(instructor => (
              <div key={instructor.id}>
                <InstructorCard instructor={instructor} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1455390582262-044cdead2708?q=80&w=2000')] bg-cover bg-center opacity-10 mix-blend-multiply"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-primary-foreground mb-6">
            قصتك العظيمة تبدأ هنا
          </h2>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-10">
            انضم إلى أكثر من 50,000 كاتب عربي، وابدأ في كتابة روايتك الأولى اليوم بأسلوب احترافي.
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="h-16 px-10 text-xl font-bold bg-white text-primary hover:bg-white/90 shadow-xl shadow-black/10">
              انضم للأكاديمية الآن
            </Button>
          </Link>
        </div>
      </section>

    </PageTransition>
  );
}
