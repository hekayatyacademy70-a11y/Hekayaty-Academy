import { Link } from "wouter";
import { Course } from "@/data/courses";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/StarRating";
import { Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-border bg-card flex flex-col h-full hover-elevate">
      <div className={`h-40 w-full bg-gradient-to-br ${course.thumbnailColor} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        <Badge className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white border-none hover:bg-white/30">
          {course.category}
        </Badge>
        <Badge variant="outline" className="absolute top-4 left-4 bg-black/40 backdrop-blur-md text-white border-white/20">
          {course.level}
        </Badge>
      </div>
      <CardContent className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <StarRating rating={course.rating} />
          <span className="text-xs text-muted-foreground font-medium">{course.rating.toFixed(1)}</span>
        </div>
        
        <h3 className="font-bold text-lg mb-2 text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {course.description || "استكشف هذا البرنامج التدريبي المصمم خصيصاً لتطوير مهاراتك بشكل عملي واحترافي."}
        </p>

        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              <img src={`https://i.pravatar.cc/150?u=${course.instructorId}`} alt={course.instructorName} />
            </div>
            <span className="text-sm font-medium text-foreground">{course.instructorName}</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>{course.students.toLocaleString('ar-EG')} طالب</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{course.duration}</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-5 pt-0 flex items-center justify-between border-t border-border/50 mt-4 pt-4">
        <span className="font-bold text-lg text-primary">${course.price}</span>
        <div className="flex gap-2">
          <Link href={`/courses/${course.id}`} className="inline-block">
            <Button variant="outline" size="sm" className="text-xs w-full sm:w-auto">التفاصيل</Button>
          </Link>
          <Button size="sm" className="text-xs">إضافة للسلة</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
