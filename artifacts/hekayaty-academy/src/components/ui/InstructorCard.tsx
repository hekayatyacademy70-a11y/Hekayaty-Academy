import { Instructor } from "@/data/instructors";
import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "@/components/ui/StarRating";
import { Link } from "wouter";

interface InstructorCardProps {
  instructor: Instructor;
}

export function InstructorCard({ instructor }: InstructorCardProps) {
  return (
    <Link href={`/instructors/${instructor.id}`} className="block h-full group">
      <Card className="text-center hover:shadow-md transition-shadow h-full bg-card hover-elevate">
        <CardContent className="pt-6 pb-6 px-4 flex flex-col h-full">
          <div className="relative mx-auto w-24 h-24 mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 scale-110 group-hover:scale-100 group-hover:border-primary transition-all duration-300" />
            <img 
              src={instructor.avatar} 
              alt={instructor.name} 
              className="w-full h-full object-cover rounded-full z-10 relative bg-muted"
            />
          </div>
          
          <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{instructor.name}</h3>
          <p className="text-sm text-primary mb-3 font-medium">{instructor.specialty}</p>
          
          <div className="flex justify-center mb-3">
            <StarRating rating={instructor.rating} />
          </div>
          
          <p className="text-xs text-muted-foreground line-clamp-3 mb-4 flex-1">
            {instructor.bio}
          </p>
          
          <div className="flex items-center justify-center gap-4 text-xs font-medium text-foreground bg-muted/50 rounded-lg p-2 mt-auto">
            <div>
              <span className="block text-lg font-bold text-primary">{instructor.courses}</span>
              <span className="text-muted-foreground">دورات</span>
            </div>
            <div className="w-px h-8 bg-border" />
            <div>
              <span className="block text-lg font-bold text-primary">{(instructor.students / 1000).toFixed(1)}k</span>
              <span className="text-muted-foreground">طالب</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
