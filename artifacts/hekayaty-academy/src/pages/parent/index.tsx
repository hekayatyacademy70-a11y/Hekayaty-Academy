import { PageTransition } from "@/components/ui/PageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/badge";
import {
  Baby, BookOpen, Clock, Award, Shield, Settings, Activity, PlusCircle
} from "lucide-react";

export default function ParentPortal() {
  return (
    <PageTransition dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif mb-1 text-primary">بوابة الآباء</h1>
          <p className="text-muted-foreground">تابع تقدم أبنائك وتحكم في إعدادات حساباتهم.</p>
        </div>
        <Button className="gap-2 font-bold">
          <PlusCircle className="w-4 h-4" /> إضافة طفل جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Child Profiles */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold font-serif flex items-center gap-2">
             <Baby className="w-5 h-5 text-primary" /> حسابات الأبناء
          </h2>
          
          {/* Child 1 */}
          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-md shrink-0 mx-auto sm:mx-0">
                  <span className="text-3xl">👦</span>
                </div>
                <div className="flex-1 text-center sm:text-right">
                  <h3 className="text-xl font-bold mb-1">ياسين</h3>
                  <p className="text-sm text-muted-foreground mb-4">العمر: 10 سنوات • المستوى: متوسط</p>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-2 bg-muted/40 rounded-lg">
                      <BookOpen className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                      <span className="text-xs font-bold">3 دورات</span>
                    </div>
                    <div className="text-center p-2 bg-muted/40 rounded-lg">
                      <Clock className="w-4 h-4 mx-auto mb-1 text-amber-500" />
                      <span className="text-xs font-bold">12 ساعة</span>
                    </div>
                    <div className="text-center p-2 bg-muted/40 rounded-lg">
                      <Award className="w-4 h-4 mx-auto mb-1 text-emerald-500" />
                      <span className="text-xs font-bold">5 شارات</span>
                    </div>
                  </div>
                </div>
                <div className="shrink-0 flex flex-col gap-2 w-full sm:w-auto">
                   <Button variant="outline" size="sm" className="w-full gap-2"><Activity className="w-4 h-4" /> تقرير مفصل</Button>
                   <Button variant="outline" size="sm" className="w-full gap-2"><Settings className="w-4 h-4" /> الإعدادات</Button>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex justify-between text-sm mb-2 font-medium">
                  <span>آخر دورة: حكايات الفضاء</span>
                  <span className="text-primary">60%</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
            </CardContent>
          </Card>
          
           {/* Child 2 */}
          <Card className="border-border hover:border-primary/20 transition-colors">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center border-4 border-white shadow-md shrink-0 mx-auto sm:mx-0">
                  <span className="text-3xl">👧</span>
                </div>
                <div className="flex-1 text-center sm:text-right">
                  <h3 className="text-xl font-bold mb-1">ليان</h3>
                  <p className="text-sm text-muted-foreground mb-4">العمر: 8 سنوات • المستوى: مبتدئ</p>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-2 bg-muted/40 rounded-lg">
                      <BookOpen className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                      <span className="text-xs font-bold">1 دورة</span>
                    </div>
                    <div className="text-center p-2 bg-muted/40 rounded-lg">
                      <Clock className="w-4 h-4 mx-auto mb-1 text-amber-500" />
                      <span className="text-xs font-bold">3 ساعات</span>
                    </div>
                    <div className="text-center p-2 bg-muted/40 rounded-lg">
                      <Award className="w-4 h-4 mx-auto mb-1 text-emerald-500" />
                      <span className="text-xs font-bold">1 شارة</span>
                    </div>
                  </div>
                </div>
                <div className="shrink-0 flex flex-col gap-2 w-full sm:w-auto">
                   <Button variant="outline" size="sm" className="w-full gap-2"><Activity className="w-4 h-4" /> تقرير مفصل</Button>
                   <Button variant="outline" size="sm" className="w-full gap-2"><Settings className="w-4 h-4" /> الإعدادات</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" /> الرقابة الأبوية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                <div>
                  <h4 className="font-bold text-sm">وقت الشاشة اليومي</h4>
                  <p className="text-xs text-muted-foreground">محدد بـ ساعتين</p>
                </div>
                <Button variant="ghost" size="sm">تعديل</Button>
              </div>
               <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                <div>
                  <h4 className="font-bold text-sm">الوصول للمجتمع</h4>
                  <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-600 mt-1">مسموح مع رقابة</Badge>
                </div>
                <Button variant="ghost" size="sm">تعديل</Button>
              </div>
               <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                <div>
                  <h4 className="font-bold text-sm">عمليات الشراء</h4>
                  <Badge variant="outline" className="text-xs border-destructive/30 text-destructive mt-1">مغلق بكلمة مرور</Badge>
                </div>
                <Button variant="ghost" size="sm">تعديل</Button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </PageTransition>
  );
}
