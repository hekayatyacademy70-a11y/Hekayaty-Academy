import { PageTransition } from "@/components/ui/PageTransition";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Palette, PenTool, Book, Star, Gift, Crown, Rocket } from "lucide-react";
import { motion } from "framer-motion";

const kidsCourses = [
  { id: "k1", title: "مغامرات الحروف", level: "مبتدئ", progress: 60, icon: Palette, color: "bg-pink-500", border: "border-pink-500/30" },
  { id: "k2", title: "حكايات الفضاء", level: "متوسط", progress: 20, icon: Rocket, color: "bg-violet-500", border: "border-violet-500/30" },
  { id: "k3", title: "مصنع الأبطال الخارقين", level: "متقدم", progress: 0, icon: Crown, color: "bg-amber-500", border: "border-amber-500/30" }
];

export default function KidsAcademy() {
  return (
    <PageTransition dir="rtl">
      {/* Playful Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 p-8 mb-10 text-white shadow-xl">
        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4">
             <Sparkles className="w-10 h-10 text-yellow-300 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
            أكاديمية حكاياتي للأطفال
          </h1>
          <p className="text-lg md:text-xl font-medium text-white/90 mb-8">
            أطلق العنان لخيالك واصنع قصصك الخاصة!
          </p>
          <div className="flex gap-4">
            <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-black rounded-full h-14 px-8 text-lg border-2 border-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.5)]">
              ابدأ المغامرة!
            </Button>
          </div>
        </div>
        
        {/* Decorative elements */}
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute top-10 right-10 text-6xl opacity-30">🚀</motion.div>
        <motion.div animate={{ y: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute bottom-10 left-10 text-6xl opacity-30">🦄</motion.div>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} className="absolute top-1/2 right-1/4 text-5xl opacity-20">⭐</motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="bg-gradient-to-br from-emerald-100 to-teal-50 border-emerald-200 shadow-md">
           <CardContent className="p-6 flex flex-col items-center text-center">
             <div className="w-16 h-16 bg-emerald-400 rounded-2xl flex items-center justify-center mb-4 text-3xl shadow-lg shadow-emerald-400/40">📚</div>
             <h3 className="text-xl font-bold text-emerald-800 mb-2 font-serif">مكتبة القصص</h3>
             <p className="text-emerald-600/80 text-sm">اقرأ قصصاً ممتعة وتفاعلية.</p>
           </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-100 to-orange-50 border-amber-200 shadow-md">
           <CardContent className="p-6 flex flex-col items-center text-center">
             <div className="w-16 h-16 bg-amber-400 rounded-2xl flex items-center justify-center mb-4 text-3xl shadow-lg shadow-amber-400/40">🎨</div>
             <h3 className="text-xl font-bold text-amber-800 mb-2 font-serif">المرسم السحري</h3>
             <p className="text-amber-600/80 text-sm">ارسم شخصياتك وصمم غلاف كتابك.</p>
           </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-fuchsia-100 to-pink-50 border-fuchsia-200 shadow-md">
           <CardContent className="p-6 flex flex-col items-center text-center">
             <div className="w-16 h-16 bg-fuchsia-400 rounded-2xl flex items-center justify-center mb-4 text-3xl shadow-lg shadow-fuchsia-400/40">🏆</div>
             <h3 className="text-xl font-bold text-fuchsia-800 mb-2 font-serif">صالة الأبطال</h3>
             <p className="text-fuchsia-600/80 text-sm">اجمع الشارات والجوائز.</p>
           </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-black text-foreground mb-6 font-serif">مغامراتي التعليمية</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {kidsCourses.map(course => (
          <Card key={course.id} className={`border-2 ${course.border} hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-xl`}>
            <CardContent className="p-5">
              <div className={`w-12 h-12 rounded-xl ${course.color} text-white flex items-center justify-center mb-4 shadow-lg`}>
                <course.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-1">{course.title}</h3>
              <Badge variant="outline" className="mb-4">{course.level}</Badge>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>التقدم</span>
                  <span>{course.progress}%</span>
                </div>
                <Progress value={course.progress} className={`h-2 [&>div]:${course.color}`} />
              </div>
              
              <Button className={`w-full mt-6 rounded-xl font-bold text-white ${course.color} hover:opacity-90`}>
                {course.progress > 0 ? "أكمل اللعب!" : "ابدأ الآن!"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageTransition>
  );
}
