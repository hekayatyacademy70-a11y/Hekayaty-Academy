import { Link } from "wouter";
import { BookOpen, Twitter, Facebook, Instagram, Youtube, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground pt-16 pb-8 border-t border-secondary-border">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded bg-primary flex items-center justify-center text-primary-foreground">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="font-serif text-3xl font-bold text-white">
                حكاياتي
              </span>
            </Link>
            <p className="text-secondary-foreground/70 mb-6 max-w-sm leading-relaxed text-sm">
              المنصة العربية الأولى المتخصصة في تعليم الكتابة الإبداعية وصناعة النشر. نبني جيلاً من الرواة القادرين على صياغة حكايات تلهم العالم.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-lg border-b border-secondary-foreground/20 pb-2 inline-block">الأكاديمية</h4>
            <ul className="space-y-3 text-sm text-secondary-foreground/80">
              <li><Link href="/about" className="hover:text-primary transition-colors">عن حكاياتي</Link></li>
              <li><Link href="/courses" className="hover:text-primary transition-colors">تصفح الدورات</Link></li>
              <li><Link href="/paths" className="hover:text-primary transition-colors">المسارات التعليمية</Link></li>
              <li><Link href="/instructors" className="hover:text-primary transition-colors">المدربون</Link></li>
              <li><Link href="/certificates" className="hover:text-primary transition-colors">الشهادات والاعتمادات</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-lg border-b border-secondary-foreground/20 pb-2 inline-block">مجتمع الكتاب</h4>
            <ul className="space-y-3 text-sm text-secondary-foreground/80">
              <li><Link href="/community" className="hover:text-primary transition-colors">المنتديات</Link></li>
              <li><Link href="/events" className="hover:text-primary transition-colors">الفعاليات المباشرة</Link></li>
              <li><Link href="/competitions" className="hover:text-primary transition-colors">المسابقات</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">المدونة الثقافية</Link></li>
              <li><Link href="/ai-lab" className="hover:text-primary transition-colors">مختبر الذكاء الاصطناعي</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-lg border-b border-secondary-foreground/20 pb-2 inline-block">تواصل معنا</h4>
            <ul className="space-y-3 text-sm text-secondary-foreground/80 mb-6">
              <li><a href="#" className="hover:text-primary transition-colors">مركز المساعدة</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">الشروط والأحكام</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">سياسة الخصوصية</a></li>
            </ul>
            <a href="mailto:hello@hekayaty.com" className="flex items-center gap-2 text-primary font-bold hover:text-white transition-colors">
              <Mail className="w-4 h-4" />
              hello@hekayaty.com
            </a>
          </div>

        </div>

        <div className="border-t border-secondary-foreground/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-secondary-foreground/60">
          <p>© {new Date().getFullYear()} أكاديمية حكاياتي. جميع الحقوق محفوظة.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span>صُنع بشغف للحرف العربي</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
