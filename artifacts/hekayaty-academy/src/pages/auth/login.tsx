import { PageTransition } from "@/components/ui/PageTransition";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Github, Twitter } from "lucide-react";

export default function Login() {
  return (
    <PageTransition className="min-h-screen flex flex-col lg:flex-row bg-background">
      
      {/* Left side: Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 lg:px-24 py-12">
        <Link href="/" className="flex items-center gap-2 mb-12 w-fit">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="font-serif text-2xl font-bold text-foreground">
            حكاياتي
          </span>
        </Link>

        <div className="max-w-md w-full mx-auto lg:mx-0">
          <h1 className="text-3xl font-bold font-serif mb-2">مرحباً بعودتك!</h1>
          <p className="text-muted-foreground mb-8">
            قم بتسجيل الدخول لمواصلة رحلتك الإبداعية
          </p>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" type="email" placeholder="اسم@example.com" className="h-12" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">كلمة المرور</Label>
                <Link href="/auth/forgot-password" className="text-sm font-medium text-primary hover:underline">
                  نسيت كلمة المرور؟
                </Link>
              </div>
              <Input id="password" type="password" placeholder="••••••••" className="h-12" />
            </div>

            <Button className="w-full h-12 text-base font-bold" type="submit">
              تسجيل الدخول
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">أو الدخول بواسطة</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-12 gap-2 bg-background hover:bg-muted text-foreground">
              <Twitter className="w-4 h-4" />
              Twitter
            </Button>
            <Button variant="outline" className="h-12 gap-2 bg-background hover:bg-muted text-foreground">
              <Github className="w-4 h-4" />
              Google
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            ليس لديك حساب؟{" "}
            <Link href="/auth/register" className="font-medium text-primary hover:underline">
              أنشئ حساباً جديداً
            </Link>
          </p>
        </div>
      </div>

      {/* Right side: Image/Quote */}
      <div className="hidden lg:flex flex-1 relative bg-sidebar overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1455390582262-044cdead2708?q=80&w=1200')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-sidebar via-sidebar/80 to-transparent"></div>
        
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
