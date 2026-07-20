import { PageTransition } from "@/components/ui/PageTransition";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRegister } from "@workspace/api-client-react";

const perks = [
  "وصول فوري لأكثر من 50 دورة",
  "مجتمع يضم 50,000+ كاتب عربي",
  "شهادات معتمدة لكل دورة",
  "استوديو الكتابة المتكامل",
];

export default function Register() {
  const [, navigate] = useLocation();
  const { setToken } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const registerMutation = useRegister();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "الاسم مطلوب";
    if (!form.email.includes("@")) e.email = "بريد إلكتروني غير صحيح";
    if (form.password.length < 8) e.password = "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    
    registerMutation.mutate({ data: { name: form.name, email: form.email, password: form.password } }, {
      onSuccess: (res) => {
        setToken(res.accessToken);
        navigate("/dashboard");
      },
      onError: (err: any) => {
        setErrors({ submit: err.data?.error || "حدث خطأ أثناء التسجيل. حاول مرة أخرى." });
      }
    });
  };

  return (
    <PageTransition className="min-h-screen flex flex-col lg:flex-row bg-background" dir="rtl">

      {/* Right side: Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 lg:px-20 py-12">
        <Link href="/" className="flex items-center gap-2 mb-10 w-fit">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="font-serif text-2xl font-bold text-foreground">حكاياتي</span>
        </Link>

        <div className="max-w-md w-full mx-auto lg:mx-0">
          <h1 className="text-3xl font-bold font-serif mb-1">أنشئ حسابك مجاناً</h1>
          <p className="text-muted-foreground mb-4">
            انضم لأكاديمية حكاياتي وابدأ رحلتك الأدبية اليوم
          </p>

          {errors.submit && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
              {errors.submit}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name">الاسم الكامل</Label>
              <Input
                id="name"
                placeholder="أدخل اسمك الكامل"
                className={`h-12 ${errors.name ? "border-destructive" : ""}`}
                value={form.name}
                onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(v => ({ ...v, name: "" })); }}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className={`h-12 ${errors.email ? "border-destructive" : ""}`}
                value={form.email}
                onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(v => ({ ...v, email: "" })); }}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  placeholder="8 أحرف على الأقل"
                  className={`h-12 pl-10 ${errors.password ? "border-destructive" : ""}`}
                  value={form.password}
                  onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(v => ({ ...v, password: "" })); }}
                />
                <button
                  type="button"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPass(v => !v)}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              {/* strength indicator */}
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      form.password.length >= i * 2
                        ? i <= 2 ? "bg-amber-500" : "bg-emerald-500"
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Terms */}
            <p className="text-xs text-muted-foreground">
              بالتسجيل توافق على{" "}
              <span className="text-primary cursor-pointer hover:underline">شروط الخدمة</span>{" "}
              و{" "}
              <span className="text-primary cursor-pointer hover:underline">سياسة الخصوصية</span>
            </p>

            <Button className="w-full h-12 text-base font-bold" type="submit" disabled={registerMutation.isPending}>
              {registerMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جارٍ إنشاء الحساب...
                </div>
              ) : (
                "ابدأ رحلتك مجاناً →"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            لديك حساب بالفعل؟{" "}
            <Link href="/auth/login" className="font-medium text-primary hover:underline">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>

      {/* Left side: Perks panel */}
      <div className="hidden lg:flex flex-1 relative bg-sidebar overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-sidebar via-sidebar/90 to-sidebar/60" />

        <div className="relative z-10 max-w-sm text-right">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mb-8">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-white mb-4 leading-snug">
            كل ما تحتاجه لتصبح كاتباً محترفاً
          </h2>
          <p className="text-sidebar-foreground/70 mb-10 leading-relaxed">
            منصة متكاملة تجمع بين التعليم، المجتمع، وأدوات الكتابة الاحترافية تحت سقف واحد.
          </p>
          <ul className="space-y-4">
            {perks.map((perk, i) => (
              <li key={i} className="flex items-center gap-3 text-sidebar-foreground/90">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm font-medium">{perk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageTransition>
  );
}
