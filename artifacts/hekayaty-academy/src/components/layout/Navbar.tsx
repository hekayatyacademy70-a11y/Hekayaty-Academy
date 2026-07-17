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
import { Moon, Sun, Menu, User, BookOpen, Crown } from "lucide-react";
import { Role } from "@/context/AuthContext";

export function Navbar() {
  const [location] = useLocation();
  const { role, setRole, isAuthenticated, user } = useAuth();
  const { theme, setTheme } = useTheme();

  const isDashboard = location.startsWith("/dashboard") || 
                      location.startsWith("/instructor") || 
                      location.startsWith("/admin") ||
                      location.startsWith("/superadmin") ||
                      location.startsWith("/parent") ||
                      location.startsWith("/reviewer");

  const navLinks = [
    { label: "الرئيسية", path: "/" },
    { label: "عن الأكاديمية", path: "/about" },
    { label: "الدورات", path: "/courses" },
    { label: "المسارات", path: "/paths" },
    { label: "الأطفال", path: "/kids" },
    { label: "المجتمع", path: "/community" },
  ];

  const getDashboardPath = () => {
    switch(role) {
      case 'Student': return '/dashboard';
      case 'Instructor': return '/instructor';
      case 'Reviewer': return '/reviewer';
      case 'Parent': return '/parent';
      case 'Admin': return '/admin';
      case 'SuperAdmin': return '/superadmin';
      default: return '/auth/login';
    }
  };

  return (
    <nav className={`w-full z-50 transition-all duration-300 ${
      isDashboard ? "bg-sidebar border-b border-sidebar-border text-sidebar-foreground" : "bg-background/80 backdrop-blur-lg border-b border-border sticky top-0"
    }`}>
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-20">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className={`font-serif text-2xl font-bold ${isDashboard ? "text-sidebar-primary-foreground" : "text-foreground"}`}>
              حكاياتي
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        {!isDashboard && (
          <div className="hidden md:flex items-center gap-1 md:gap-4 lg:gap-8 font-medium">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                href={link.path}
                className={`text-sm hover:text-primary transition-colors ${
                  location === link.path ? "text-primary font-bold" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={isDashboard ? "text-sidebar-foreground hover:bg-sidebar-accent" : ""}
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={`gap-2 ${isDashboard ? "text-sidebar-foreground hover:bg-sidebar-accent" : ""}`}>
                  <div className="w-8 h-8 rounded-full bg-muted overflow-hidden">
                    {user?.avatar ? <img src={user.avatar} alt="User" /> : <User className="w-full h-full p-1" />}
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
                
                <DropdownMenuLabel className="text-xs text-muted-foreground uppercase flex items-center gap-2">
                  <Crown className="w-3 h-3" />
                  محاكاة الصلاحيات (للتجربة)
                </DropdownMenuLabel>
                <div className="grid grid-cols-2 gap-1 p-1">
                  {(['Student', 'Instructor', 'Reviewer', 'Parent', 'Admin', 'SuperAdmin'] as Role[]).map((r) => (
                    <DropdownMenuItem 
                      key={r} 
                      onClick={() => setRole(r)}
                      className={`text-xs justify-center cursor-pointer ${role === r ? 'bg-primary/10 text-primary font-bold' : ''}`}
                    >
                      {r}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem 
                    onClick={() => setRole('Guest')}
                    className="text-xs justify-center cursor-pointer col-span-2 text-destructive"
                  >
                    تسجيل الخروج
                  </DropdownMenuItem>
                </div>
                
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
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" className="font-medium">تسجيل الدخول</Button>
              </Link>
              <Link href="/auth/register">
                <Button className="font-medium bg-primary hover:bg-primary/90 text-primary-foreground">ابدأ مجاناً</Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle (stub) */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
