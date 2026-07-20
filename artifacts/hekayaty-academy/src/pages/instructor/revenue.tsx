import { useState, useEffect } from "react";
import { PageTransition } from "@/components/ui/PageTransition";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/ui/StatCard";
import {
  Wallet, DollarSign, CheckCircle2, XCircle, Clock, ExternalLink,
  ArrowUpRight, AlertCircle, RefreshCw, Loader2
} from "lucide-react";
import { motion } from "framer-motion";

async function apiCall(method: string, path: string, body?: any) {
  const token = localStorage.getItem("hekayaty-token");
  const res = await fetch(`/api${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export default function InstructorRevenue() {
  const [wallet, setWallet] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [walletData, reqData] = await Promise.all([
        apiCall("GET", "/payments/wallet"),
        apiCall("GET", "/payments/instructor/requests")
      ]);
      setWallet(walletData);
      setRequests(reqData.requests ?? []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleApprove = async (id: string) => {
    if (!confirm("تأكيد استلام الدفعة وتفعيل الاشتراك للطالب؟")) return;
    setActionLoading(id);
    try {
      await apiCall("PUT", `/payments/${id}/approve`);
      await fetchData();
    } catch (e: any) {
      alert("خطأ: " + e.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt("يرجى إدخال سبب الرفض (مثال: الإيصال غير واضح أو رقم المعاملة غير صحيح):");
    if (!reason) return;
    setActionLoading(id);
    try {
      await apiCall("PUT", `/payments/${id}/reject`, { reason });
      await fetchData();
    } catch (e: any) {
      alert("خطأ: " + e.message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <PageTransition dir="rtl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">المدفوعات والأرباح</h1>
          <p className="text-muted-foreground mt-1">إدارة طلبات الشراء ومتابعة محفظتك المالية</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={fetchData}>
          <RefreshCw className="w-4 h-4" />
          تحديث
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <AlertCircle className="w-10 h-10 mx-auto mb-3 text-destructive opacity-60" />
          <p className="text-destructive">{error}</p>
        </div>
      ) : (
        <>
          {/* Wallet Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            <StatCard
              title="الرصيد المتاح"
              value={`${wallet?.availableBalance ?? 0} ج.م`}
              icon={Wallet}
              trend="جاهز للسحب"
              trendUp
            />
            <StatCard
              title="أرباحك الإجمالية"
              value={`${wallet?.lifetimeEarnings ?? 0} ج.م`}
              icon={DollarSign}
            />
            <StatCard
              title="طلبات قيد المراجعة"
              value={requests.length}
              icon={Clock}
              trend="تحتاج إلى مراجعة"
              trendUp={false}
            />
          </div>

          <Tabs defaultValue="requests" className="w-full">
            <TabsList className="mb-6 bg-transparent border-b border-border rounded-none w-full justify-start h-auto p-0">
              <TabsTrigger value="requests" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none text-base px-6 py-3">
                طلبات الشراء (InstaPay)
                {requests.length > 0 && (
                  <Badge variant="default" className="ml-2 bg-primary text-primary-foreground">{requests.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="ledger" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none text-base px-6 py-3">
                سجل المحفظة
              </TabsTrigger>
            </TabsList>

            <TabsContent value="requests">
              {requests.length === 0 ? (
                <div className="text-center py-16 bg-card border border-border rounded-xl">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500/50 mx-auto mb-3" />
                  <h3 className="font-bold text-lg mb-1">لا توجد طلبات معلقة</h3>
                  <p className="text-muted-foreground text-sm">لقد قمت بمراجعة جميع طلبات الدفع.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map((req: any, idx: number) => (
                    <motion.div key={req.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                      <Card className="border-border">
                        <CardContent className="p-5">
                          <div className="flex flex-col lg:flex-row gap-6">
                            
                            {/* Receipt Image */}
                            <div className="w-full lg:w-48 h-48 lg:h-32 bg-muted rounded-xl overflow-hidden shrink-0 border border-border relative group">
                              {req.receiptImageUrl ? (
                                <a href={req.receiptImageUrl} target="_blank" rel="noopener noreferrer">
                                  <img src={req.receiptImageUrl} alt="إيصال الدفع" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <ExternalLink className="text-white w-6 h-6" />
                                  </div>
                                </a>
                              ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground">لا توجد صورة</div>
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center justify-between">
                                <h3 className="font-bold text-lg">{req.course.title}</h3>
                                <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-none">
                                  قيد المراجعة
                                </Badge>
                              </div>
                              <p className="text-sm font-medium">الطالب: <span className="text-muted-foreground">{req.student.name} ({req.student.email})</span></p>
                              
                              <div className="flex flex-wrap items-center gap-4 pt-2">
                                <div className="bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10">
                                  <span className="text-xs text-muted-foreground block mb-0.5">المبلغ المدفوع</span>
                                  <span className="font-bold font-serif text-primary">{req.amountPaid} ج.م</span>
                                </div>
                                <div className="bg-muted/50 px-3 py-1.5 rounded-lg border border-border">
                                  <span className="text-xs text-muted-foreground block mb-0.5">رقم المعاملة (InstaPay)</span>
                                  <span className="font-mono text-sm">{req.instapayTransactionId || "—"}</span>
                                </div>
                                <div className="bg-muted/50 px-3 py-1.5 rounded-lg border border-border">
                                  <span className="text-xs text-muted-foreground block mb-0.5">وقت الإرسال</span>
                                  <span className="text-sm">{new Date(req.submittedAt).toLocaleDateString("ar-EG")}</span>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex lg:flex-col gap-2 shrink-0 lg:w-40 justify-center">
                              <Button 
                                className="w-full bg-emerald-600 hover:bg-emerald-700" 
                                onClick={() => handleApprove(req.id)}
                                disabled={!!actionLoading}
                              >
                                {actionLoading === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                  <><CheckCircle2 className="w-4 h-4 ml-1.5" /> قبول وتفعيل</>
                                )}
                              </Button>
                              <Button 
                                variant="outline" 
                                className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
                                onClick={() => handleReject(req.id)}
                                disabled={!!actionLoading}
                              >
                                {actionLoading === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                  <><XCircle className="w-4 h-4 ml-1.5" /> رفض الدفعة</>
                                )}
                              </Button>
                            </div>

                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="ledger">
              <Card className="border-border">
                <CardContent className="p-0">
                  {wallet?.transactions?.length > 0 ? (
                    <div className="divide-y divide-border">
                      {wallet.transactions.map((tx: any) => (
                        <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                              tx.type === 'credit' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-destructive/10 text-destructive'
                            }`}>
                              {tx.type === 'credit' ? <ArrowUpRight className="w-5 h-5" /> : <Wallet className="w-5 h-5" />}
                            </div>
                            <div>
                              <p className="font-medium">{tx.description || (tx.type === 'credit' ? 'أرباح دورة' : 'سحب أرباح')}</p>
                              <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleString("ar-EG")}</p>
                            </div>
                          </div>
                          <span className={`font-bold font-serif ${
                            tx.type === 'credit' ? 'text-emerald-600' : 'text-foreground'
                          }`}>
                            {tx.type === 'credit' ? '+' : '-'}{tx.amount} ج.م
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">لا توجد حركات مالية مسجلة بعد.</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </PageTransition>
  );
}
