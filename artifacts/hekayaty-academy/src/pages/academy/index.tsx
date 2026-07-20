import { PageTransition } from "@/components/ui/PageTransition";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";
import {
  BookOpen,
  Feather,
  Sparkles,
  Users,
  Target,
  PenTool,
  ArrowLeft,
  ChevronLeft,
  Award,
  BookMarked,
  Globe,
  Star,
  Brain,
  Rocket,
  Trophy
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

export default function AcademyPage() {
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <PageTransition className="flex flex-col min-h-screen bg-background" dir="rtl">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[calc(100vh-5rem)] flex items-center overflow-hidden bg-black">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-[center_top] opacity-40 transition-opacity duration-1000"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=2070&auto=format&fit=crop')" }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
          <div className="absolute inset-y-0 right-0 w-full md:w-[70%] bg-gradient-to-l from-black/90 via-black/60 to-transparent"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 md:px-8 py-20 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#D4A373]/20 flex items-center justify-center mb-8 border border-[#D4A373]/30 backdrop-blur-sm">
              <Feather className="w-8 h-8 text-[#D4A373]" />
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight">
              نبني الجيل القادم من <span className="text-[#D4A373]">الكتّاب العرب</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl leading-relaxed font-medium">
              حكاياتي Academy ليست مجرد منصة تعليمية، بل منظومة متكاملة لاكتشاف المواهب وتطوير الكتّاب وتمكينهم من تحويل أفكارهم إلى أعمال حقيقية تصل إلى القراء.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/auth/register">
                <Button size="lg" className="w-full sm:w-auto h-14 px-10 text-base font-bold bg-[#D4A373] hover:bg-[#C69249] text-black rounded-full">
                  ابدأ رحلتك
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-10 text-base border-white/20 text-white hover:bg-white/10 rounded-full gap-2">
                  استكشف البرامج
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. OUR STORY SECTION */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">قصة حكاياتي</h2>
            <div className="w-20 h-1 bg-[#D4A373] mx-auto rounded-full mb-6"></div>
          </motion.div>

          <div className="relative border-r border-[#D4A373]/30 pr-8 md:pr-12 space-y-12">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="relative">
              <div className="absolute -right-[41px] md:-right-[57px] top-1 w-5 h-5 rounded-full bg-background border-2 border-[#D4A373]"></div>
              <h3 className="text-xl font-bold mb-3 text-[#D4A373]">كيف بدأت الفكرة؟</h3>
              <p className="text-muted-foreground leading-relaxed">
                ولدت الفكرة من رحم التحديات التي يواجهها الكتّاب الطامحون في العالم العربي. لاحظنا غياب المسارات التعليمية الممنهجة التي تأخذ بيد الكاتب من الفكرة وحتى النشر.
              </p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="relative">
              <div className="absolute -right-[41px] md:-right-[57px] top-1 w-5 h-5 rounded-full bg-background border-2 border-[#D4A373]"></div>
              <h3 className="text-xl font-bold mb-3 text-[#D4A373]">الحاجة لبيئة داعمة</h3>
              <p className="text-muted-foreground leading-relaxed">
                اكتشفنا أن التعليم وحده لا يكفي؛ فالكاتب يحتاج إلى مجتمع حيوي، فرص للممارسة، وتوجيه مستمر. معظم المواهب تتلاشى بسبب الإحباط أو غياب الإرشاد الصحيح.
              </p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="relative">
              <div className="absolute -right-[41px] md:-right-[57px] top-1 w-5 h-5 rounded-full bg-[#D4A373] shadow-[0_0_15px_rgba(212,163,115,0.5)]"></div>
              <h3 className="text-xl font-bold mb-3 text-foreground">الحل الشامل</h3>
              <p className="text-muted-foreground leading-relaxed">
                لذلك، تم تأسيس "حكاياتي Academy" لتكون منصة متكاملة توفر التعليم، التوجيه، المجتمع، وفرص النمو لجميع الكتّاب في كل المستويات.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. VISION & 4. MISSION */}
      <section className="py-24 bg-muted/30 relative">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              className="bg-card rounded-2xl p-8 lg:p-12 border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="absolute -right-12 -top-12 w-32 h-32 bg-[#D4A373]/10 rounded-full blur-2xl group-hover:bg-[#D4A373]/20 transition-colors"></div>
              <Target className="w-10 h-10 text-[#D4A373] mb-6" />
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">رؤيتنا</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                أن تصبح حكاياتي Academy الوجهة العربية الرائدة لتعليم الكتابة الإبداعية وصناعة المؤلفين وبناء مجتمع عربي مزدهر من المبدعين.
              </p>
            </motion.div>

            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              className="bg-card rounded-2xl p-8 lg:p-12 border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="absolute -left-12 -top-12 w-32 h-32 bg-[#D4A373]/10 rounded-full blur-2xl group-hover:bg-[#D4A373]/20 transition-colors"></div>
              <Sparkles className="w-10 h-10 text-[#D4A373] mb-6" />
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">رسالتنا</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                تمكين الكتّاب العرب من تطوير مهاراتهم وتحويل أفكارهم إلى أعمال إبداعية حقيقية من خلال:
              </p>
              <ul className="grid grid-cols-2 gap-3 text-sm font-medium">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D4A373]" />التعليم</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D4A373]" />الإبداع</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D4A373]" />التطوير</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D4A373]" />المجتمع</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D4A373]" />الفرص</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. CORE VALUES */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">قيمنا الجوهرية</h2>
            <div className="w-20 h-1 bg-[#D4A373] mx-auto rounded-full mb-6"></div>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6"
          >
            {[
              { icon: Sparkles, title: "الإبداع", desc: "نؤمن بقوة الأفكار الجديدة والخيال المفتوح." },
              { icon: BookOpen, title: "التعلم المستمر", desc: "كل كاتب قادر على التطور والنمو اللانهائي." },
              { icon: Users, title: "المجتمع", desc: "الموهبة تزدهر دائماً داخل بيئة داعمة وإيجابية." },
              { icon: Award, title: "الجودة", desc: "نلتزم بتقديم تجربة تعليمية احترافية بمعايير عالمية." },
              { icon: Globe, title: "التأثير", desc: "نهدف إلى صناعة أثر حقيقي في حياة المبدعين والمجتمع." }
            ].map((value, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="bg-card/50 border border-border p-6 rounded-2xl hover:bg-muted/50 transition-colors text-center group">
                <div className="w-12 h-12 mx-auto bg-[#D4A373]/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <value.icon className="w-6 h-6 text-[#D4A373]" />
                </div>
                <h3 className="font-bold mb-2 text-lg">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 6. WHAT MAKES US DIFFERENT (JOURNEY) */}
      <section className="py-24 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">لماذا حكاياتي Academy؟</h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">نحن لا نكتفي بتقديم الدروس، بل نرافقك في رحلة متكاملة لصناعة كاتب محترف.</p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center max-w-5xl mx-auto relative">
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-[#D4A373]/50 to-transparent -translate-y-1/2 z-0"></div>
            
            {[
              { step: "1", title: "تعلّم", desc: "مسارات تعليمية" },
              { step: "2", title: "تدرّب", desc: "تطبيقات عملية" },
              { step: "3", title: "طوّر", desc: "مراجعة وإرشاد" },
              { step: "4", title: "انشر", desc: "فرص أدبية" },
              { step: "5", title: "تألق", desc: "نمو مستمر" }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative z-10 flex flex-col items-center mb-8 md:mb-0 group"
              >
                <div className="w-16 h-16 rounded-full bg-black border-2 border-[#D4A373] flex items-center justify-center text-xl font-bold text-[#D4A373] mb-4 group-hover:bg-[#D4A373] group-hover:text-black transition-colors shadow-[0_0_15px_rgba(212,163,115,0.2)]">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                <p className="text-sm text-white/50">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. ECOSYSTEM */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">منظومة حكاياتي الإبداعية</h2>
            <div className="w-20 h-1 bg-[#D4A373] mx-auto rounded-full mb-6"></div>
            <p className="text-muted-foreground max-w-2xl mx-auto">حكاياتي ليست موقعاً واحداً، بل نظام بيئي كامل مصمم لدعم المبدع في كل مراحل عمله.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { icon: BookMarked, title: "Hekayaty Academy", desc: "التعليم والتطوير وبناء الأساس المعرفي للكتّاب." },
              { icon: Users, title: "Hekayaty Community", desc: "مجتمع الكتّاب والمبدعين للتبادل المعرفي والدعم." },
              { icon: Trophy, title: "Hekayaty Competitions", desc: "المسابقات والتحديات الإبداعية لاختبار المواهب." },
              { icon: PenTool, title: "Publishing Programs", desc: "برامج دعم النشر والتطوير الأدبي للمتميزين." },
              { icon: Brain, title: "AI Writing Tools", desc: "أدوات الذكاء الاصطناعي المساعدة والمحفزة للإلهام." },
              { icon: Sparkles, title: "Writing Workspace", desc: "بيئة متكاملة للعمل على المشاريع الأدبية وإدارتها." }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full bg-card/40 backdrop-blur-sm border-border hover:border-[#D4A373]/50 transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 mx-auto bg-[#D4A373]/10 rounded-xl flex items-center justify-center mb-4 text-[#D4A373]">
                      <feature.icon className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 font-serif">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. HEKAYATY KIDS */}
      <section className="py-24 bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] dark:from-background dark:to-muted/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <div className="inline-block px-4 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 font-bold text-sm mb-6 border border-orange-200 dark:border-orange-800">
                مساحة مخصصة للأطفال
              </div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-slate-800 dark:text-white">
                حكاياتي <span className="text-orange-500">Kids</span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                نؤمن أن الإبداع يبدأ في سن مبكرة. يستحق الأطفال بيئة آمنة وملهمة لاكتشاف عالم القصص والخيال، وتطوير مهارات التعبير عن أفكارهم.
              </p>
              <ul className="space-y-4">
                {[
                  "ورش كتابة إبداعية مخصصة للأطفال",
                  "برامج قراءة تفاعلية لتنمية الخيال",
                  "مسابقات إبداعية للمواهب الشابة",
                  "مسارات تعليمية مقسمة حسب الفئات العمرية"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-200 font-medium">
                    <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
                      <Star className="w-3 h-3 fill-current" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1 relative"
            >
              <div className="aspect-square max-w-md mx-auto relative">
                <div className="absolute inset-0 bg-orange-400/20 rounded-full blur-3xl animate-pulse"></div>
                <img 
                  src="https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2098&auto=format&fit=crop" 
                  alt="Hekayaty Kids" 
                  className="rounded-3xl object-cover w-full h-full shadow-2xl relative z-10 border-8 border-white dark:border-slate-800"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 9. COMPANY BEHIND (Clickers Creations) */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-3xl p-8 md:p-16 border border-border shadow-lg flex flex-col md:flex-row items-center gap-12"
          >
            <div className="flex-1 text-center md:text-right">
              <h3 className="text-sm font-bold tracking-widest text-muted-foreground uppercase mb-2">من يقف خلف حكاياتي؟</h3>
              <h2 className="text-3xl font-serif font-bold mb-6">Clickers Creations</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                هي الشركة التقنية والإبداعية المسؤولة عن بناء وتطوير منصة "حكاياتي Academy" والمبادرات الرقمية المرافقة لها.
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <span className="px-3 py-1 bg-muted rounded-full text-xs font-medium">الابتكار التكنولوجي</span>
                <span className="px-3 py-1 bg-muted rounded-full text-xs font-medium">تطوير التعليم</span>
                <span className="px-3 py-1 bg-muted rounded-full text-xs font-medium">المنتجات الرقمية</span>
                <span className="px-3 py-1 bg-muted rounded-full text-xs font-medium">الاستدامة</span>
              </div>
            </div>
            <div className="w-48 h-48 md:w-64 md:h-64 shrink-0 rounded-2xl bg-muted/50 flex flex-col items-center justify-center p-8 border border-border">
              <Rocket className="w-16 h-16 text-[#D4A373] mb-4 opacity-80" />
              <span className="font-bold text-xl tracking-wider text-foreground">CLICKERS</span>
              <span className="text-sm text-muted-foreground">CREATIONS</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 10. TRUST & CREDIBILITY */}
      <section className="py-20 bg-[#D4A373] text-black">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold mb-4">لماذا يثق بنا المبدعون؟</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center">
            {[
              { num: "+١٠,٠٠٠", label: "مبدع وكاتب" },
              { num: "+١٥٠", label: "دورة وبرنامج" },
              { num: "+٥٠", label: "خبير ومدرب" },
              { num: "+٥٠٠", label: "مشروع أدبي منجز" }
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="text-4xl md:text-5xl font-bold font-serif">{stat.num}</div>
                <div className="text-sm md:text-base font-medium opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. ROADMAP */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">رحلة النمو والمستقبل</h2>
            <div className="w-20 h-1 bg-[#D4A373] mx-auto rounded-full"></div>
          </div>

          <div className="relative border-r-2 border-muted pr-8 space-y-12">
            {[
              { year: "2026", title: "إطلاق الأكاديمية", desc: "افتتاح المنصة رسمياً للكتّاب وإطلاق الدفعة الأولى من البرامج التعليمية الأساسية." },
              { year: "2027", title: "توسيع البرامج", desc: "إطلاق مسارات متخصصة للرواية، السيناريو، المحتوى الرقمي، وبرامج الأطفال." },
              { year: "2028", title: "منظومة النشر", desc: "تأسيس شراكات مع دور النشر لإطلاق أعمال المتميزين من خريجي الأكاديمية." },
              { year: "2029", title: "مبادرات إقليمية", desc: "توسيع نطاق التأثير من خلال مؤتمرات ومسابقات كبرى على مستوى العالم العربي." },
              { year: "2030", title: "أكبر مجتمع أدبي", desc: "الوصول إلى مجتمع حيوي يضم مئات الآلاف من المبدعين وصنّاع التأثير." }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className={`absolute -right-[41px] top-1 w-4 h-4 rounded-full border-2 border-background ${i === 0 ? "bg-[#D4A373]" : "bg-muted-foreground"}`}></div>
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 mb-2">
                  <span className={`text-2xl font-bold font-serif ${i === 0 ? "text-[#D4A373]" : "text-muted-foreground"}`}>{step.year}</span>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. FAQ */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">الأسئلة الشائعة</h2>
            <div className="w-20 h-1 bg-[#D4A373] mx-auto rounded-full"></div>
          </div>

          <Accordion type="single" collapsible className="w-full bg-card rounded-2xl border border-border px-6 py-2 shadow-sm">
            {[
              { q: "هل الأكاديمية مناسبة للمبتدئين؟", a: "نعم بالتأكيد! صممنا مسارات تعليمية تبدأ من الصفر وصولاً إلى المستويات المتقدمة والاحترافية." },
              { q: "هل توجد شهادات عند إتمام الدورات؟", a: "نعم، يحصل المتدرب على شهادة إتمام موثقة من الأكاديمية عند استكمال المتطلبات واجتياز التقييمات." },
              { q: "هل توجد مسابقات أو فرص حقيقية؟", a: "نعم، ننظم مسابقات دورية توفر فرصاً حقيقية للترشيح للنشر والعمل مع خبراء المجال." },
              { q: "هل يوجد مجتمع للكتّاب؟", a: "الأكاديمية مرتبطة بـ Hekayaty Community وهو مساحة آمنة وداعمة لتبادل الأفكار وتلقي التقييمات." },
              { q: "هل يوجد برامج للأطفال؟", a: "نعم، لدينا قسم Hekayaty Kids المخصص لتنمية مواهب الأطفال في التخيل والكتابة الإبداعية." },
              { q: "كيف أبدأ رحلتي؟", a: "يمكنك إنشاء حساب مجاني الآن واستكشاف الدورات المتاحة والبدء فوراً في المسار الذي يناسبك." }
            ].map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-border">
                <AccordionTrigger className="text-right font-medium text-base hover:text-[#D4A373] transition-colors">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* 13. FINAL CTA */}
      <section className="py-24 bg-black text-white relative overflow-hidden text-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#D4A373]/10 blur-3xl rounded-full scale-150 -translate-y-1/2"></div>
        </div>
        <div className="container relative z-10 mx-auto px-4 md:px-8 max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-[#D4A373]">
              ابدأ رحلتك الإبداعية اليوم
            </h2>
            <p className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed max-w-2xl mx-auto">
              انضم إلى مجتمع من الكتّاب والمبدعين الذين يعملون يوميًا على تطوير مهاراتهم وتحويل أفكارهم إلى قصص ومشاريع حقيقية.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="w-full sm:w-auto h-14 px-10 text-base font-bold bg-[#D4A373] hover:bg-[#C69249] text-black rounded-full">
                  انضم إلى الأكاديمية
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-10 text-base border-white/20 text-white hover:bg-white/10 rounded-full">
                  استكشف البرامج
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
    </PageTransition>
  );
}
