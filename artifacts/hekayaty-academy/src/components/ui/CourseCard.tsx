import { memo } from "react";
import { Link } from "wouter";
import type { CourseCardData } from "@/types/course";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/StarRating";
import { Users, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

// Maps DB level enum to Arabic label
const levelLabels: Record<string, string> = {
  beginner: "مبتدئ",
  intermediate: "متوسط",
  advanced: "متقدم",
  all: "الجميع",
};

// Fallback gradient colors based on course id (so UI stays beautiful even without thumbnailColor)
const gradients = [
  "from-amber-600 to-amber-900",
  "from-blue-600 to-indigo-900",
  "from-stone-600 to-stone-900",
  "from-emerald-600 to-teal-900",
  "from-red-600 to-rose-900",
  "from-violet-600 to-purple-900",
  "from-pink-500 to-rose-700",
  "from-cyan-500 to-blue-700",
  "from-orange-500 to-red-700",
  "from-teal-600 to-emerald-900",
];

function getGradient(id: string, override?: string) {
  if (override) return override;
  const index = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % gradients.length;
  return gradients[index];
}

interface CourseCardProps {
  course: CourseCardData;
}

export const CourseCard = memo(function CourseCard({ course }: CourseCardProps) {
  const gradient = getGradient(course.id, course.thumbnailColor);
  const levelLabel = levelLabels[course.level] ?? course.level;

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-border bg-card flex flex-col h-full hover-elevate">
      {/* Thumbnail */}
      <div className={`h-40 w-full bg-gradient-to-br ${gradient} relative overflow-hidden`}>
        {course.thumbnailUrl ? (
          <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
        ) : null}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        {course.category && (
          <Badge className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white border-none hover:bg-white/30">
            {course.category}
          </Badge>
        )}
        <Badge variant="outline" className="absolute top-4 left-4 bg-black/40 backdrop-blur-md text-white border-white/20">
          {levelLabel}
        </Badge>
      </div>

      <CardContent className="p-5 flex-1 flex flex-col">
        {course.rating !== undefined && (
          <div className="flex justify-between items-start mb-2">
            <StarRating rating={course.rating} />
            <span className="text-xs text-muted-foreground font-medium">{course.rating.toFixed(1)}</span>
          </div>
        )}

        <h3 className="font-bold text-lg mb-2 text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
          {course.title}
        </h3>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {course.description || "استكشف هذا البرنامج التدريبي المصمم خصيصاً لتطوير مهاراتك بشكل عملي واحترافي."}
        </p>

        <div className="mt-auto">
          {course.instructorName && (
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                <img src={`https://i.pravatar.cc/150?u=${course.instructorId}`} alt={course.instructorName} />
              </div>
              <span className="text-sm font-medium text-foreground">{course.instructorName}</span>
            </div>
          )}

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {course.students !== undefined && (
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>{course.students.toLocaleString("ar-EG")} طالب</span>
              </div>
            )}
            {course.duration && (
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{course.duration}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 flex items-center justify-between border-t border-border/50 mt-4 pt-4">
        <span className="font-bold text-lg text-primary">
          {course.price === 0 ? "مجاني" : `${course.price} جنيه`}
        </span>
        <Link href={`/courses/${course.id}`} className="inline-block">
          <Button size="sm" className="text-xs font-bold px-4">ابدأ التعلم الآن ←</Button>
        </Link>
      </CardFooter>
    </Card>
  );
});
