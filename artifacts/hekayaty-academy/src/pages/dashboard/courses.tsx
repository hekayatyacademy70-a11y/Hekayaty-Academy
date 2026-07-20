import { PageTransition } from "@/components/ui/PageTransition";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, PlayCircle, Loader2 } from "lucide-react";
import { useGetMyEnrollments } from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function StudentCourses() {
  const { user } = useAuth();
  const { data: enrollments = [], isLoading } = useGetMyEnrollments();

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-serif mb-2">دوراتي</h1>
        <p className="text-muted-foreground">مركز التعلم الخاص بك. تابع جميع الدورات التي اشتركت بها من هنا.</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : enrollments.length === 0 ? (
        <Card className="text-center py-20">
          <CardContent>
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-bold mb-2">لا توجد دورات بعد</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              لم تقم بالاشتراك في أي دورة حتى الآن. تصفح مكتبة الدورات لاكتشاف ما يثير اهتمامك.
            </p>
            <Link href="/courses">
              <Button size="lg">تصفح مكتبة الدورات</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment: any, idx: number) => (
            <motion.div
              key={enrollment.enrollmentId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link href={`/courses/${enrollment.course.id}`}>
                <Card className="hover-elevate cursor-pointer overflow-hidden border-border/50 shadow-sm h-full flex flex-col group">
                  {/* Thumbnail */}
                  <div className="w-full h-48 bg-gradient-to-br from-amber-600 to-stone-900 relative flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {enrollment.course.thumbnailUrl ? (
                      <img
                        src={enrollment.course.thumbnailUrl}
                        alt={enrollment.course.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <PlayCircle className="w-12 h-12 text-white/50" />
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-white/90 text-foreground hover:bg-white backdrop-blur-sm border-none shadow-sm">
                        {enrollment.progressPercent === 100 ? 'مكتملة' : 'قيد الدراسة'}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-[10px] font-normal">
                        {enrollment.course.level}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-lg mb-4 line-clamp-2 leading-tight">
                      {enrollment.course.title}
                    </h3>
                    
                    <div className="mt-auto pt-4">
                      <div className="flex justify-between text-xs text-muted-foreground mb-2">
                        <span>{enrollment.completedLessons} / {enrollment.totalLessons} درس</span>
                        <span className="font-bold text-primary">{enrollment.progressPercent}%</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-500 ease-out"
                          style={{ width: `${enrollment.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </PageTransition>
  );
}
