import { Link } from "wouter";
import { BookOpen, Twitter, Facebook, Instagram, Youtube, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black text-white/90 pt-16 pb-8 border-t border-white/10">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded bg-[#D4A373] flex items-center justify-center text-black">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="font-serif text-3xl font-bold text-white">
                أكاديمية حكاياتي
              </span>
            </Link>
            <p className="text-white/60 mb-6 max-w-sm leading-relaxed text-sm">
              المنصة العربية الأولى المتخصصة في تعليم الكتابة الإبداعية وصناعة النشر. نبني جيلاً من الرواة القادرين على صياغة حكايات تلهم العالم.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#D4A373] hover:text-black transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#D4A373] hover:text-black transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#D4A373] hover:text-black transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#D4A373] hover:text-black transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-lg border-b border-white/20 pb-2 inline-block">الأكاديمية</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li><Link href="/academy" className="hover:text-[#D4A373] transition-colors">عن حكاياتي</Link></li>
              <li><Link href="/courses" className="hover:text-[#D4A373] transition-colors">تصفح الدورات</Link></li>
              <li><Link href="/paths" className="hover:text-[#D4A373] transition-colors">المسارات التعليمية</Link></li>
              <li><Link href="/instructors" className="hover:text-[#D4A373] transition-colors">المدربون</Link></li>
              <li><Link href="/certificates" className="hover:text-[#D4A373] transition-colors">الشهادات والاعتمادات</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-lg border-b border-white/20 pb-2 inline-block">مجتمع الكتاب</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li><Link href="/community" className="hover:text-[#D4A373] transition-colors">المنتديات</Link></li>
              <li><Link href="/events" className="hover:text-[#D4A373] transition-colors">الفعاليات المباشرة</Link></li>
              <li><Link href="/competitions" className="hover:text-[#D4A373] transition-colors">المسابقات</Link></li>
              <li><Link href="/blog" className="hover:text-[#D4A373] transition-colors">المدونة الثقافية</Link></li>
              <li><Link href="/ai-lab" className="hover:text-[#D4A373] transition-colors">مختبر الذكاء الاصطناعي</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-lg border-b border-white/20 pb-2 inline-block">تواصل معنا</h4>
            <ul className="space-y-3 text-sm text-white/70 mb-6">
              <li><a href="#" className="hover:text-[#D4A373] transition-colors">مركز المساعدة</a></li>
              <li><a href="#" className="hover:text-[#D4A373] transition-colors">الشروط والأحكام</a></li>
              <li><a href="#" className="hover:text-[#D4A373] transition-colors">سياسة الخصوصية</a></li>
            </ul>
            <a href="mailto:hello@hekayaty.com" className="flex items-center gap-2 text-[#D4A373] font-bold hover:text-white transition-colors">
              <Mail className="w-4 h-4" />
              hello@hekayaty.com
            </a>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-white/50">
          <p>© {new Date().getFullYear()} أكاديمية حكاياتي. جميع الحقوق محفوظة.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span>صُنع بشغف للحرف العربي</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
