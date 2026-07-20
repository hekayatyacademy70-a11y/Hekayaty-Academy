import { PageTransition } from "@/components/ui/PageTransition";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, MessageSquare, Users, TrendingUp, Sparkles, PlusCircle } from "lucide-react";

const trendingTopics = [
  { id: 1, title: "كيف تبني شخصية شريرة مقنعة؟", author: "محمود س.", replies: 45, category: "نقاشات عامة" },
  { id: 2, title: "مراجعة رواية 'أولاد حارتنا'", author: "أمينة ف.", replies: 120, category: "نادي القراءة" },
  { id: 3, title: "البحث عن شركاء نقد (Beta Readers)", author: "كريم م.", replies: 18, category: "ورش العمل" },
];

const spaces = [
  { title: "نادي القراءة", members: "12.5k", description: "مناقشة الروايات والأعمال الأدبية." },
  { title: "ورش العمل", members: "8.2k", description: "تبادل النقد والمراجعات." },
  { title: "سؤال وجواب", members: "15k", description: "أسئلة سريعة حول النشر والكتابة." },
];

export default function Community() {
  return (
    <PageTransition dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif mb-2">مجتمع حكاياتي</h1>
          <p className="text-muted-foreground">تواصل مع أكثر من 50,000 كاتب وقارئ عربي.</p>
        </div>
        <Button className="gap-2 font-bold h-12 px-6 text-base">
          <PlusCircle className="w-5 h-5" /> موضوع جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Feed */}
        <div className="lg:col-span-3 space-y-6">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input className="h-14 pr-12 text-lg rounded-xl shadow-sm bg-card border-border" placeholder="ابحث في النقاشات، المساحات، أو الأعضاء..." />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
             <Badge className="bg-primary text-primary-foreground px-4 py-2 text-sm shrink-0 cursor-pointer">الأحدث</Badge>
             <Badge variant="outline" className="px-4 py-2 text-sm shrink-0 cursor-pointer hover:bg-muted">الأكثر تفاعلاً</Badge>
             <Badge variant="outline" className="px-4 py-2 text-sm shrink-0 cursor-pointer hover:bg-muted">مساحاتي</Badge>
          </div>

          <Card className="border-border">
            <CardHeader className="bg-muted/30 border-b border-border">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" /> نقاشات رائجة
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {trendingTopics.map((topic) => (
                  <div key={topic.id} className="p-5 hover:bg-muted/30 transition-colors cursor-pointer group">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <Badge variant="secondary" className="mb-2 text-xs font-medium">{topic.category}</Badge>
                        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{topic.title}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <img src={`https://i.pravatar.cc/150?u=${topic.id}`} className="w-5 h-5 rounded-full" alt={topic.author} />
                          بواسطة <span className="font-bold text-foreground">{topic.author}</span> • منذ 3 ساعات
                        </p>
                      </div>
                      <div className="flex flex-col items-center justify-center shrink-0 w-16 p-2 rounded-lg bg-muted/50">
                        <MessageSquare className="w-5 h-5 text-muted-foreground mb-1" />
                        <span className="font-bold">{topic.replies}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Spaces */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 shadow-sm">
             <CardContent className="p-6 text-center">
               <div className="w-14 h-14 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
                 <Sparkles className="w-7 h-7" />
               </div>
               <h3 className="font-bold text-lg mb-2">أنت من نخبة الأعضاء!</h3>
               <p className="text-sm text-muted-foreground mb-4">أكملت 5 دورات وساهمت في 20 نقاشاً.</p>
               <Button className="w-full font-bold">لوحة الإنجازات</Button>
             </CardContent>
          </Card>

          <div>
            <h3 className="font-bold text-lg font-serif mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> مساحات مقترحة
            </h3>
            <div className="space-y-3">
              {spaces.map((space, i) => (
                <Card key={i} className="hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <h4 className="font-bold text-base mb-1">{space.title}</h4>
                    <p className="text-xs text-muted-foreground mb-3">{space.description}</p>
                    <div className="flex items-center justify-between text-xs">
                       <span className="font-medium text-muted-foreground flex items-center gap-1">
                         <Users className="w-3.5 h-3.5" /> {space.members} عضو
                       </span>
                       <Button variant="outline" size="sm" className="h-7 text-xs">انضمام</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
