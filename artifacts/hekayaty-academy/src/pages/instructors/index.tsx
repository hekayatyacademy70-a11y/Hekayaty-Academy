import { PageTransition } from "@/components/ui/PageTransition";
import { InstructorCard } from "@/components/ui/InstructorCard";
import { useGetInstructors } from "@workspace/api-client-react";
import { Loader2 } from "lucide-react";

export default function InstructorsPage() {
  const { data: apiInstructors = [], isLoading } = useGetInstructors();

  return (
    <PageTransition className="flex flex-col min-h-screen">
      {/* Header */}
      <section className="bg-black text-white pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="container mx-auto relative z-10 text-center">
          <div className="w-12 h-1 bg-primary mx-auto mb-6 rounded-full"></div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">فريق المدربين</h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            نخبة من أفضل الكُتاب، الروائيين، وصناع المحتوى في العالم العربي لتقديم خبراتهم الممتدة إليك مباشرة.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20 bg-background flex-1">
        <div className="container mx-auto px-4 md:px-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {apiInstructors.map((instructor, i) => {
                const mappedInstructor = {
                  ...instructor,
                  avatar: instructor.avatar || `https://i.pravatar.cc/150?u=${instructor.id || i}`,
                };
                return (
                  <div key={instructor.id || i}>
                    <InstructorCard instructor={mappedInstructor as any} />
                  </div>
                );
              })}
            </div>
          )}
          
          {!isLoading && apiInstructors.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              لا يوجد مدربين حالياً.
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
