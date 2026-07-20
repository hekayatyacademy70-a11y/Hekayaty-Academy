import { Instructor } from "@/data/instructors";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

interface InstructorCardProps {
  instructor: Instructor;
}

export function InstructorCard({ instructor }: InstructorCardProps) {
  return (
    <Link href={`/instructors/${instructor.id}`} className="block h-full group">
      <div className="relative h-full bg-card border border-border/50 rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
        
        {/* Subtle top gradient accent */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/0 via-primary/60 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="p-6 flex flex-col items-center text-center gap-3">
          {/* Avatar */}
          <div className="relative w-20 h-20 shrink-0">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 scale-110 group-hover:scale-115 transition-transform duration-300" />
            <img
              src={instructor.avatar}
              alt={instructor.name}
              className="relative w-full h-full object-cover rounded-full border-2 border-background shadow-md"
            />
          </div>

          {/* Name */}
          <div>
            <h3 className="font-bold text-base leading-tight group-hover:text-primary transition-colors duration-200">
              {instructor.name}
            </h3>
            {/* Specialty badge */}
            <span className="inline-block mt-1.5 text-xs font-medium text-primary/80 bg-primary/8 border border-primary/15 px-2.5 py-0.5 rounded-full">
              {instructor.specialty}
            </span>
          </div>

          {/* Bio */}
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 flex-1">
            {instructor.bio || "مدرب معتمد في الأكاديمية"}
          </p>

          {/* CTA */}
          <div className="flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all duration-200 mt-auto pt-1">
            <span>عرض الملف الشخصي</span>
            <ArrowLeft className="w-3 h-3" />
          </div>
        </div>
      </div>
    </Link>
  );
}
