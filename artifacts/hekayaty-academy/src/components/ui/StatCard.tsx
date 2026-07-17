import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: any;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export function StatCard({ title, value, icon: Icon, trend, trendUp, className }: StatCardProps) {
  return (
    <Card className={cn("bg-card hover-elevate overflow-hidden", className)}>
      <CardContent className="p-6 relative">
        <div className="absolute left-6 top-6 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Icon className="w-6 h-6" />
        </div>
        <div className="pr-2">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-bold font-serif text-foreground">{value}</h3>
          
          {trend && (
            <p className={cn("text-xs font-medium mt-2 flex items-center gap-1", trendUp ? "text-emerald-500" : "text-destructive")}>
              <span className="text-lg leading-none">{trendUp ? "↑" : "↓"}</span>
              {trend}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
