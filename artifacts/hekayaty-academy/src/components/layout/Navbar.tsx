import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Menu, User, BookOpen, Search } from "lucide-react";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, role, isAuthenticated, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

  const navLinks = [
    { label: "الرئيسية", path: "/" },
    { label: "الأكاديمية", path: "/academy" },
    { label: "الدورات", path: "/courses" },
    { label: "المقالات", path: "/articles" },
    { label: "الأطفال", path: "/kids" },
    { label: "المسابقات", path: "/competitions" },
  ];

  const getDashboardPath = () => {
    switch(role) {
      case 'student': return '/dashboard';
      case 'instructor': return '/instructor';
      case 'reviewer': return '/reviewer';
      case 'parent': return '/parent';
      case 'admin': return '/admin';
      case 'superadmin': return '/superadmin';
      default: return '/auth/login';
    }
  };

  // Navbar background: always use global styling
  const navBg = isDark
      ? "sticky top-0 bg-black/90 backdrop-blur-md border-b border-[#D4A373]/20 text-white"
      : "sticky top-0 bg-white/95 backdrop-blur-md border-b border-black/10 text-foreground shadow-sm";

  const logoTextColor = isDark ? "text-white" : "text-gray-900";

  const linkBase = isDark ? "text-white/80" : "text-gray-700";

  const linkActive = isDark ? "text-[#D4A373] border-[#D4A373]" : "text-[#C49040] border-[#C49040]";

  return (
    <nav className={`w-full z-50 transition-all duration-300 ${navBg}`}>
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-20">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-[#D4A373]" />
            <div className="flex flex-col">
              <span className={`font-serif text-lg leading-none ${logoTextColor}`}>
                أكاديمية حكاياتي
              </span>
              <span className="text-[0.55rem] tracking-[0.3em] text-[#D4A373] mt-1 uppercase">
                - HEKAYATY ACADEMY -
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex flex-1 justify-center items-center gap-4 lg:gap-6 font-medium">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              href={link.path}
              className={`text-[13px] hover:text-[#D4A373] transition-colors whitespace-nowrap pb-1 border-b-2 ${
                location === link.path ? linkActive : `${linkBase} border-transparent`
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">

          {/* Theme Toggle */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={`gap-2 ${isDark ? "text-white hover:bg-white/10" : "text-gray-800 hover:bg-black/5"}`}>
                  <div className="w-8 h-8 rounded-full bg-muted overflow-hidden flex items-center justify-center">
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <span className="hidden sm:inline-block font-medium">{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 font-sans">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={() => logout()}
                  className="text-xs justify-center cursor-pointer col-span-2 text-destructive"
                >
                  تسجيل الخروج
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={getDashboardPath()} className="cursor-pointer font-bold">لوحة التحكم</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/workspace" className="cursor-pointer">ستوديو الكتابة</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <button className={`transition-colors ${isDark ? "text-white/80 hover:text-white" : "text-gray-500 hover:text-gray-800"}`}>
                <Search className="w-5 h-5" />
              </button>
              <Link href="/auth/login">
                <Button
                  variant="outline"
                  className={`font-medium px-5 rounded-md h-9 text-sm ${
                    isDark
                      ? "border-white/30 text-white bg-transparent hover:bg-white/10"
                      : "border-gray-300 text-gray-800 bg-transparent hover:bg-black/5"
                  }`}
                >
                  تسجيل الدخول
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="font-bold bg-[#D4A373] hover:bg-[#C49040] text-black px-6 rounded-md h-9 text-sm">
                  إنضم الآن
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className={`md:hidden ${isDark ? "text-white" : "text-gray-900"}`}>
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className={`w-[300px] sm:w-[400px] ${isDark ? "bg-black/95 text-white border-white/10" : "bg-white text-gray-900"}`}>
              <SheetHeader>
                <SheetTitle className={`font-serif text-right ${logoTextColor}`}>أكاديمية حكاياتي</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-lg font-medium py-2 border-b transition-colors ${
                      location === link.path ? linkActive : `${isDark ? "border-white/10 hover:text-[#D4A373] text-white/80" : "border-gray-100 hover:text-[#C49040] text-gray-700"}`
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                
                {!isAuthenticated && (
                  <div className="flex flex-col gap-3 mt-4">
                    <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className={`w-full justify-start ${isDark ? "border-white/30 text-white" : "border-gray-300 text-gray-800"}`}>تسجيل الدخول</Button>
                    </Link>
                    <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full justify-start bg-[#D4A373] text-black hover:bg-[#C49040]">إنضم الآن</Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

