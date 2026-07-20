import { useState, useEffect } from "react";
import { PageTransition } from "@/components/ui/PageTransition";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Clock, CheckCircle2, XCircle, AlertCircle, BookOpen,
  Loader2, ExternalLink, RefreshCw, CreditCard,
} from "lucide-react";
import { motion } from "framer-motion";

async function apiCall(method: string, path: string) {
  const token = localStorage.getItem("hekayaty-token");
  const res = await fetch(`/api${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

const STATUS_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  pending_payment: {
    label: "بانتظار الدفع",
    icon: CreditCard,
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  pending_verification: {
    label: "قيد المراجعة",
    icon: Clock,
    color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  completed: {
    label: "مفعّل",
    icon: CheckCircle2,
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  rejected: {
    label: "مرفوض",
    icon: XCircle,
    color: "bg-destructive/10 text-destructive border-destructive/20",
  },
  cancelled: {
    label: "ملغي",
    icon: AlertCircle,
    color: "bg-muted text-muted-foreground border-border",
  },
};

export default function MyPurchases() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPurchases = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiCall("GET", "/payments/my");
      setPurchases(data.purchases ?? []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPurchases(); }, []);

  return (
    <PageTransition dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-serif text-foreground">مشترياتي</h1>
          <p className="text-muted-foreground text-sm mt-1">تتبع طلبات الدفع والاشتراكات</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={fetchPurchases}>
          <RefreshCw className="w-4 h-4" />
          تحديث
        </Button>
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="text-center py-16">
          <AlertCircle className="w-10 h-10 mx-auto mb-3 text-destructive opacity-60" />
          <p className="text-destructive">{error}</p>
        </div>
      )}

      {!loading && !error && purchases.length === 0 && (
        <div className="text-center py-20">
          <BookOpen className="w-14 h-14 mx-auto mb-4 text-muted-foreground opacity-30" />
          <h3 className="font-bold text-lg text-foreground mb-2">لا توجد مشتريات بعد</h3>
          <p className="text-muted-foreground mb-6">تصفح الدورات وابدأ رحلة التعلم</p>
          <Link href="/courses">
            <Button>استكشف الدورات</Button>
          </Link>
        </div>
      )}

      {!loading && purchases.length > 0 && (
        <div className="space-y-4">
          {purchases.map((purchase: any, idx: number) => {
            const statusCfg = STATUS_CONFIG[purchase.status] ?? STATUS_CONFIG.cancelled;
            const StatusIcon = statusCfg.icon;

            return (
              <motion.div
                key={purchase.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="border-border bg-card hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Course Thumbnail */}
                      <div className="w-16 h-16 rounded-xl bg-muted overflow-hidden shrink-0 flex items-center justify-center">
                        {purchase.course?.thumbnailUrl
                          ? <img src={purchase.course.thumbnailUrl} alt={purchase.course.title} className="w-full h-full object-cover" />
                          : <BookOpen className="w-7 h-7 text-muted-foreground" />
                        }
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground truncate">{purchase.course?.title}</h3>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span>{purchase.amountPaid} ج.م</span>
                          {purchase.submittedAt && (
                            <span>رُفع: {new Date(purchase.submittedAt).toLocaleDateString("ar-EG")}</span>
                          )}
                          {purchase.instapayTransactionId && (
                            <span className="font-mono">#{purchase.instapayTransactionId}</span>
                          )}
                        </div>
                        {purchase.rejectionReason && (
                          <p className="text-xs text-destructive mt-1.5 bg-destructive/5 px-2 py-1 rounded-lg">
                            سبب الرفض: {purchase.rejectionReason}
                          </p>
                        )}
                      </div>

                      {/* Status + Actions */}
                      <div className="flex items-center gap-3 shrink-0">
                        <Badge
                          variant="outline"
                          className={`gap-1.5 px-3 py-1 ${statusCfg.color}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusCfg.label}
                        </Badge>

                        {purchase.status === "completed" && purchase.course?.id && (
                          <Link href={`/courses/${purchase.course.id}`}>
                            <Button size="sm" variant="outline" className="gap-1.5">
                              <ExternalLink className="w-3.5 h-3.5" />
                              ادخل
                            </Button>
                          </Link>
                        )}

                        {purchase.status === "pending_payment" && (
                          <Link href={`/courses/${purchase.course.id}`}>
                            <Button size="sm" className="gap-1.5">
                              <CreditCard className="w-3.5 h-3.5" />
                              أكمل الدفع
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Receipt Preview */}
                    {purchase.receiptImageUrl && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <p className="text-xs text-muted-foreground mb-2">إيصال الدفع:</p>
                        <a href={purchase.receiptImageUrl} target="_blank" rel="noopener noreferrer">
                          <img
                            src={purchase.receiptImageUrl}
                            alt="receipt"
                            className="h-20 w-auto rounded-lg border border-border object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </PageTransition>
  );
}
