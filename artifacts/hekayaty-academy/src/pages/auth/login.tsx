import { PageTransition } from "@/components/ui/PageTransition";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Eye, EyeOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLogin } from "@workspace/api-client-react";

export default function Login() {
  const [, navigate] = useLocation();
  const { setToken } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const loginMutation = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("يرجى ملء جميع الحقول"); return; }
    setError("");
    
    loginMutation.mutate({ data: { email, password } }, {
      onSuccess: (res) => {
        setToken(res.accessToken);
        navigate("/dashboard");
      },
      onError: (err: any) => {
        setError(err.data?.error || "فشل تسجيل الدخول. يرجى التحقق من بياناتك.");
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
          <h1 className="text-3xl font-bold font-serif mb-2">مرحباً بعودتك!</h1>
          <p className="text-muted-foreground mb-8">
            قم بتسجيل الدخول لمواصلة رحلتك الإبداعية
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
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
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">كلمة المرور</Label>
                <Link href="/auth/forgot-password" className="text-sm font-medium text-primary hover:underline">
                  نسيت كلمة المرور؟
                </Link>
              </div>
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
            </div>

            <Button className="w-full h-12 text-base font-bold" type="submit" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جارٍ التحقق...
                </div>
              ) : (
                "تسجيل الدخول"
              )}
            </Button>
          </form>



          <p className="text-center text-sm text-muted-foreground mt-8">
            ليس لديك حساب؟{" "}
            <Link href="/auth/register" className="font-medium text-primary hover:underline">
              أنشئ حساباً جديداً
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
            <BookOpen className="w-12 h-12 text-primary mx-auto mb-6 opacity-80" />
            <blockquote className="font-serif text-2xl leading-relaxed mb-6">
              "الكتابة ليست مجرد صف كلمات، بل هي بناء عوالم بأكملها تظل حية حتى بعد أن نطوي الصفحة الأخيرة."
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
