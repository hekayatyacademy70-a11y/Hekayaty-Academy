import { PageTransition } from "@/components/ui/PageTransition";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Clock, Users, ArrowUpRight, Flame, Medal } from "lucide-react";

const activeCompetitions = [
  { id: "comp1", title: "جائزة حكاياتي للرواية القصيرة", category: "الرواية القصيرة", prize: "50,000 جنيه", deadline: "30 أيام متبقية", participants: 1250, image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80" },
  { id: "comp2", title: "تحدي أدب الخيال العلمي", category: "خيال علمي", prize: "25,000 جنيه + عقد نشر", deadline: "15 يوم متبقي", participants: 840, image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80" }
];

const pastWinners = [
  { year: 2023, name: "سالم محمود", title: "رواية 'رماد الأيام'", category: "أدب تاريخي", avatar: "https://i.pravatar.cc/150?u=salem" },
  { year: 2023, name: "نورة القاسم", title: "مجموعة 'أطياف'", category: "القصة القصيرة", avatar: "https://i.pravatar.cc/150?u=noura" }
];

export default function Competitions() {
  return (
    <PageTransition dir="rtl">
      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden bg-primary p-10 mb-12 text-primary-foreground shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511632765486-a01c80cb8fa6?w=1200&q=80')] bg-cover bg-center mix-blend-overlay opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-transparent" />
        
        <div className="relative z-10 max-w-2xl">
          <Badge className="bg-amber-500 hover:bg-amber-600 text-white mb-6 py-1.5 px-3 text-sm border-0 font-bold gap-2">
            <Trophy className="w-4 h-4" /> الموسم الثقافي 2024
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black font-serif mb-4 leading-tight">
            أطلق العنان لقلمك <br/> وشارك في كبرى المسابقات الأدبية
          </h1>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-xl leading-relaxed">
            فرصتك لنشر أعمالك، الفوز بجوائز مالية قيمة، والوصول إلى ملايين القراء عبر دور النشر الشريكة.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold h-14 px-8 text-lg">
              تصفح المسابقات
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10 font-bold h-14 px-8 text-lg">
              شروط المشاركة
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold font-serif flex items-center gap-2">
          <Flame className="w-6 h-6 text-orange-500" /> مسابقات جارية
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {activeCompetitions.map(comp => (
          <Card key={comp.id} className="overflow-hidden hover-elevate border-border group cursor-pointer">
            <div className="h-48 relative overflow-hidden">
              <img src={comp.image} alt={comp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 right-4">
                <Badge className="bg-background/90 text-foreground backdrop-blur-sm border-0">{comp.category}</Badge>
              </div>
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold font-serif mb-2 group-hover:text-primary transition-colors">{comp.title}</h3>
              
              <div className="grid grid-cols-2 gap-4 mt-6 mb-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">الجائزة الكبرى</p>
                  <p className="font-bold text-amber-500 flex items-center gap-1.5"><Trophy className="w-4 h-4" /> {comp.prize}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">المشاركين</p>
                  <p className="font-bold flex items-center gap-1.5"><Users className="w-4 h-4 text-muted-foreground" /> {comp.participants.toLocaleString("ar-EG")}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-1.5 text-sm font-medium text-destructive">
                  <Clock className="w-4 h-4" /> {comp.deadline}
                </div>
                <Button variant="outline" size="sm" className="gap-2 font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  شارك الآن <ArrowUpRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Hall of Fame */}
      <h2 className="text-2xl font-bold font-serif mb-6 flex items-center gap-2">
        <Medal className="w-6 h-6 text-amber-500" /> لوحة الشرف
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {pastWinners.map((winner, i) => (
           <Card key={i} className="text-center bg-muted/20 border-border">
             <CardContent className="p-6">
               <div className="relative inline-block mb-4">
                 <img src={winner.avatar} alt={winner.name} className="w-20 h-20 rounded-full border-4 border-background shadow-md object-cover" />
                 <div className="absolute -bottom-2 -left-2 bg-amber-500 text-white w-8 h-8 rounded-full flex items-center justify-center border-2 border-background font-bold text-xs shadow-sm">
                   1st
                 </div>
               </div>
               <h3 className="font-bold text-lg mb-1">{winner.name}</h3>
               <p className="text-sm text-primary font-medium mb-3">{winner.title}</p>
               <Badge variant="outline" className="text-xs bg-background">{winner.category} • {winner.year}</Badge>
             </CardContent>
           </Card>
        ))}
      </div>
    </PageTransition>
  );
}
