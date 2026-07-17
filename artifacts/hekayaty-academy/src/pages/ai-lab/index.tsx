import { PageTransition } from "@/components/ui/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayCircle, Cpu, UserCheck, BookOpen, Map, Sparkles, MessageSquare } from "lucide-react";
import { Link } from "wouter";

const aiTools = [
  {
    id: "idea-generator",
    title: "مولد الأفكار والحبكات",
    desc: "احصل على عشرات الأفكار القصصية الجاهزة للتطوير بناءً على النوع الأدبي المفضل لديك.",
    icon: Sparkles,
    color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
  },
  {
    id: "character-generator",
    title: "مطور الشخصيات المتقدم",
    desc: "أنشئ شخصيات عميقة بمعتقدات، مخاوف، وأهداف واضحة مع اقتراحات للخلفية الدرامية.",
    icon: UserCheck,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
  },
  {
    id: "world-builder",
    title: "مهندس العوالم",
    desc: "ابنِ عوالم خيالية متكاملة بأنظمة سحر، جغرافيا، وثقافات فريدة لروايتك القادمة.",
    icon: Map,
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
  },
  {
    id: "plot-generator",
    title: "هيكلة الحبكة (الأبواب الخمسة)",
    desc: "خطط مسار روايتك وفقاً للأنظمة السردية الكلاسيكية والحديثة بدقة متناهية.",
    icon: BookOpen,
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
  },
  {
    id: "marketing-assistant",
    title: "مساعد التسويق",
    desc: "اكتب وصفاً جذاباً للغلاف الخلفي لروايتك، واصنع خطة تسويقية لإطلاق كتابك.",
    icon: MessageSquare,
    color: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"
  }
];

export default function AiLabHome() {
  return (
    <PageTransition className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-sidebar py-20 text-sidebar-foreground relative overflow-hidden border-b border-sidebar-border">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary mb-6 border border-primary/20">
            <Cpu className="w-4 h-4" />
            <span className="text-sm font-bold tracking-wider">مختبر حكاياتي الذكي</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
            عزز إبداعك بقوة <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-300">
              الذكاء الاصطناعي
            </span>
          </h1>
          <p className="text-lg text-sidebar-foreground/80 leading-relaxed mb-8">
            أدوات متقدمة مصممة خصيصاً للكتاب والمؤلفين العرب. نحن لا نكتب بدلاً عنك، بل نلهمك ونسرع من وتيرة إبداعك لتنجز أكثر.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-16 container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-serif mb-4">أدوات المختبر</h2>
          <p className="text-muted-foreground">اختر الأداة التي تحتاجها لبدء الإلهام</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {aiTools.map((tool) => (
            <Link key={tool.id} href={`/ai-lab/${tool.id}`} className="block h-full group">
              <Card className="h-full hover:shadow-lg transition-all border-border hover:border-primary/50 hover-elevate">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${tool.color}`}>
                    <tool.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{tool.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {tool.desc}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
          
          <Card className="h-full border border-dashed border-border bg-muted/30 flex flex-col items-center justify-center p-8 text-center">
            <Sparkles className="w-12 h-12 text-muted-foreground opacity-30 mb-4" />
            <h3 className="text-lg font-bold mb-2">المزيد قادم قريباً</h3>
            <p className="text-muted-foreground text-sm">نقوم بتطوير أدوات جديدة باستمرار</p>
          </Card>
        </div>
      </section>
    </PageTransition>
  );
}
