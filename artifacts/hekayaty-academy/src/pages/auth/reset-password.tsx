import { PageTransition } from "@/components/ui/PageTransition";
import { Link, useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Eye, EyeOff, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useResetPassword } from "@workspace/api-client-react";

export default function ResetPassword() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const token = params.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const resetMutation = useResetPassword();

  const getPasswordStrength = (p: string) => {
    if (p.length === 0) return { score: 0, label: "", color: "" };
    if (p.length < 6) return { score: 1, label: "ضعيفة", color: "bg-red-500" };
    if (p.length < 8) return { score: 2, label: "متوسطة", color: "bg-yellow-500" };
    if (/[A-Z]/.test(p) && /[0-9]/.test(p) && p.length >= 8) return { score: 4, label: "قوية جداً", color: "bg-green-500" };
    return { score: 3, label: "جيدة", color: "bg-blue-500" };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) { setError("يرجى ملء جميع الحقول"); return; }
    if (password.length < 8) { setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل"); return; }
    if (password !== confirmPassword) { setError("كلمة المرور وتأكيدها غير متطابقتين"); return; }
    if (!token) { setError("رابط إعادة التعيين غير صالح أو منتهي الصلاحية"); return; }
    setError("");

    resetMutation.mutate({ data: { token, password } }, {
      onSuccess: () => {
        setSuccess(true);
        setTimeout(() => navigate("/auth/login"), 3000);
      },
      onError: (err: any) => {
        setError(err.data?.error || "الرابط غير صالح أو منتهي الصلاحية. يرجى طلب رابط جديد.");
      }
    });
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background" dir="rtl">
        <div className="text-center p-8 max-w-md">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-bold mb-2">رابط غير صالح</h2>
          <p className="text-muted-foreground mb-6">هذا الرابط غير صالح أو منتهي الصلاحية.</p>
          <Link href="/auth/forgot-password">
            <Button>طلب رابط جديد</Button>
          </Link>
        </div>
      </div>
    );
  }

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
                  <Lock className="w-7 h-7 text-primary" />
                </div>
                <h1 className="text-3xl font-bold font-serif mb-2">تعيين كلمة مرور جديدة</h1>
                <p className="text-muted-foreground">
                  أدخل كلمة مرور جديدة قوية لحسابك.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">كلمة المرور الجديدة</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPass ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-12 pl-10"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPass(v => !v)}
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Password Strength Indicator */}
                  {password.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map(i => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                              i <= strength.score ? strength.color : "bg-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        قوة كلمة المرور: <span className="font-medium">{strength.label}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirm">تأكيد كلمة المرور</Label>
                  <div className="relative">
                    <Input
                      id="confirm"
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-12 pl-10"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowConfirm(v => !v)}
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-destructive">كلمتا المرور غير متطابقتين</p>
                  )}
                  {confirmPassword && password === confirmPassword && password.length >= 8 && (
                    <p className="text-xs text-green-500 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> كلمتا المرور متطابقتان
                    </p>
                  )}
                </div>

                <Button className="w-full h-12 text-base font-bold" type="submit" disabled={resetMutation.isPending}>
                  {resetMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      جارٍ التحديث...
                    </div>
                  ) : (
                    "تعيين كلمة المرور الجديدة"
                  )}
                </Button>
              </form>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-6">
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6 animate-bounce">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold font-serif mb-3">تم تغيير كلمة المرور!</h2>
              <p className="text-muted-foreground mb-6">
                تم تعيين كلمة مرورك الجديدة بنجاح. سيتم توجيهك لصفحة تسجيل الدخول خلال ثوانٍ...
              </p>
              <Link href="/auth/login">
                <Button className="w-full h-12">تسجيل الدخول الآن</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Left side */}
      <div className="hidden lg:flex flex-1 relative bg-sidebar overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1455390582262-044cdead2708?q=80&w=1200')] bg-cover bg-center opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-sidebar via-sidebar/80 to-transparent" />
        <Card className="relative z-10 max-w-lg bg-black/40 backdrop-blur-md border-white/10 text-white">
          <CardContent className="p-10 text-center">
            <Lock className="w-12 h-12 text-primary mx-auto mb-6 opacity-80" />
            <blockquote className="font-serif text-2xl leading-relaxed mb-6">
              "الأمان الرقمي مسؤوليتنا المشتركة، واختيار كلمة مرور قوية هو أولى خطواتك."
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
