import { Link, useLocation } from "wouter";
import { useAuth, Role } from "@/context/AuthContext";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  PenTool,
  FolderOpen,
  Award,
  Trophy,
  MessageSquare,
  Settings,
  Users,
  BarChart,
  Star,
  FileText,
  ShieldAlert,
  Crown,
  Bell,
  HeartPulse
} from "lucide-react";

interface SidebarItem {
  label: string;
  icon: any;
  path: string;
}

const getRoleConfig = (role: Role): { title: string, items: SidebarItem[] } => {
  switch (role) {
    case 'student':
      return {
        title: 'منطقة المتدرب',
        items: [
          { label: 'اللوحة الرئيسية', icon: LayoutDashboard, path: '/dashboard' },
          { label: 'دوراتي', icon: BookOpen, path: '/dashboard/courses' },
          { label: 'مساراتي التعليمية', icon: Star, path: '/dashboard/paths' },
          { label: 'جدول التعلم', icon: Calendar, path: '/dashboard/calendar' },
          { label: 'الواجبات', icon: PenTool, path: '/dashboard/assignments' },
          { label: 'مشاريعي', icon: FolderOpen, path: '/dashboard/projects' },
          { label: 'المسابقات', icon: Trophy, path: '/dashboard/competitions' },
          { label: 'مشترياتي', icon: Award, path: '/dashboard/purchases' },
          { label: 'الرسائل', icon: MessageSquare, path: '/dashboard/messages' },
          { label: 'الإعدادات', icon: Settings, path: '/dashboard/settings' },
        ]
      };
    case 'instructor':
      return {
        title: 'منطقة المدرب',
        items: [
          { label: 'نظرة عامة', icon: LayoutDashboard, path: '/instructor' },
          { label: 'إدارة الدورات', icon: BookOpen, path: '/instructor/courses' },
          { label: 'مشاركتي في المسارات', icon: Star, path: '/instructor/paths' },
          { label: 'المدفوعات والأرباح', icon: BarChart, path: '/instructor/revenue' },
          { label: 'البث المباشر', icon: Calendar, path: '/instructor/live' },
          { label: 'الرسائل', icon: MessageSquare, path: '/instructor/messages' },
          { label: 'الإعدادات', icon: Settings, path: '/instructor/settings' },
        ]
      };
    case 'admin':
    case 'superadmin':
      const adminItems = [
        { label: 'لوحة التحكم', icon: LayoutDashboard, path: '/admin' },
        { label: 'المستخدمين', icon: Users, path: '/admin/users' },
        { label: 'الدورات', icon: BookOpen, path: '/admin/courses' },
        { label: 'المسارات التعليمية', icon: Star, path: '/admin/paths' },
        { label: 'المدربين', icon: Crown, path: '/admin/instructors' },
        { label: 'المسابقات', icon: Trophy, path: '/admin/competitions' },
        { label: 'الشهادات', icon: Award, path: '/admin/certificates' },
        { label: 'المجتمع', icon: MessageSquare, path: '/admin/community' },
        { label: 'المحتوى', icon: FileText, path: '/admin/content' },
        { label: 'الفعاليات', icon: Calendar, path: '/admin/events' },
        { label: 'أكاديمية الأطفال', icon: HeartPulse, path: '/admin/kids' },
        { label: 'الإعدادات', icon: Settings, path: '/admin/settings' },
      ];
      
      if (role === 'superadmin') {
        adminItems.push(
          { label: 'سجلات النظام', icon: ShieldAlert, path: '/superadmin/audit' },
          { label: 'صلاحيات الأدوار', icon: Crown, path: '/superadmin/roles' }
        );
      }
      return {
        title: role === 'superadmin' ? 'إدارة النظام العليا' : 'إدارة المنصة',
        items: adminItems
      };
    case 'parent':
      return {
        title: 'بوابة ولي الأمر',
        items: [
          { label: 'نظرة عامة', icon: LayoutDashboard, path: '/parent' },
          { label: 'التقارير', icon: FileText, path: '/parent/reports' },
          { label: 'الشهادات', icon: Award, path: '/parent/certificates' },
          { label: 'الإشعارات', icon: Bell, path: '/parent/notifications' },
        ]
      };
    case 'reviewer':
      return {
        title: 'لجنة التحكيم',
        items: [
          { label: 'نظرة عامة', icon: LayoutDashboard, path: '/reviewer' },
          { label: 'مراجعة المخطوطات', icon: FileText, path: '/reviewer/manuscripts' },
          { label: 'تقييم الدورات', icon: BookOpen, path: '/reviewer/courses' },
          { label: 'تحكيم المسابقات', icon: Trophy, path: '/reviewer/competitions' },
          { label: 'مركز التقييم', icon: Star, path: '/reviewer/evaluation' },
        ]
      };
    default:
      return { title: '', items: [] };
  }
};

export function Sidebar() {
  const [location] = useLocation();
  const { role } = useAuth();
  const config = getRoleConfig(role);

  return (
    <aside className="w-64 bg-sidebar flex-shrink-0 flex flex-col h-full border-l border-sidebar-border overflow-y-auto">
      <div className="p-6">
        <p className="text-xs font-bold text-sidebar-primary tracking-widest uppercase mb-4 opacity-80">
          {config.title}
        </p>
        <nav className="space-y-1">
          {config.items.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            return (
              <Link key={item.path} href={item.path}>
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors cursor-pointer group ${
                  isActive 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-md shadow-primary/20" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}>
                  <Icon className={`w-5 h-5 ${isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`} />
                  <span className="text-sm">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
