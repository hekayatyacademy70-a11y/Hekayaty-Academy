import { PageTransition } from "@/components/ui/PageTransition";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Mail, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useForgotPassword } from "@workspace/api-client-react";

export default function ForgotPassword() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const forgotMutation = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError("يرجى إدخال البريد الإلكتروني"); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { setError("يرجى إدخال بريد إلكتروني صحيح"); return; }
    setError("");

    forgotMutation.mutate({ data: { email } }, {
      onSuccess: () => {
        setSuccess(true);
      },
      onError: (err: any) => {
        setError(err.data?.error || "حدث خطأ. يرجى المحاولة مرة أخرى.");
      }
    });
  };

  return (
    <PageTransition className="min-h-screen flex flex-col lg:flex-row bg-background" dir="rtl">

      {/* Right side: Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 lg:px-24 py-12">
        <Link href="/" className="flex items-center gap-2 mb-12 w-fit">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="font-serif text-2xl font-bold text-foreground">حكاياتي</span>
        </Link>

        <div className="max-w-md w-full mx-auto lg:mx-0">

          {!success ? (
            <>
              <div className="mb-8">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Mail className="w-7 h-7 text-primary" />
                </div>
                <h1 className="text-3xl font-bold font-serif mb-2">نسيت كلمة المرور؟</h1>
                <p className="text-muted-foreground">
                  لا تقلق! أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="h-12"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoFocus
                  />
                </div>

                <Button className="w-full h-12 text-base font-bold" type="submit" disabled={forgotMutation.isPending}>
                  {forgotMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      جارٍ الإرسال...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>إرسال رابط الاسترداد</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </form>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-6">
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold font-serif mb-3">تم الإرسال!</h2>
              <p className="text-muted-foreground mb-2">
                تم إرسال رابط إعادة تعيين كلمة المرور إلى:
              </p>
              <p className="font-medium text-foreground mb-6 bg-muted px-4 py-2 rounded-lg inline-block">
                {email}
              </p>
              <p className="text-sm text-muted-foreground mb-8">
                يرجى مراجعة صندوق الوارد وصندوق البريد غير المرغوب فيه (Spam). 
                قد يستغرق الوصول بضع دقائق.
              </p>
              <Button
                variant="outline"
                className="w-full h-12"
                onClick={() => { setSuccess(false); setEmail(""); }}
              >
                إرسال مرة أخرى
              </Button>
            </div>
          )}

          <p className="text-center text-sm text-muted-foreground mt-8">
            تذكرت كلمة المرور؟{" "}
            <Link href="/auth/login" className="font-medium text-primary hover:underline">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>

      {/* Left side: Quote */}
      <div className="hidden lg:flex flex-1 relative bg-sidebar overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1455390582262-044cdead2708?q=80&w=1200')] bg-cover bg-center opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-sidebar via-sidebar/80 to-transparent" />
        <Card className="relative z-10 max-w-lg bg-black/40 backdrop-blur-md border-white/10 text-white">
          <CardContent className="p-10 text-center">
            <Mail className="w-12 h-12 text-primary mx-auto mb-6 opacity-80" />
            <blockquote className="font-serif text-2xl leading-relaxed mb-6">
              "الحكمة ليست في تذكر كل شيء، بل في معرفة أين تجد ما نسيته."
            </blockquote>
            <cite className="block text-sm text-white/60 font-medium">
              — أكاديمية حكاياتي
            </cite>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
