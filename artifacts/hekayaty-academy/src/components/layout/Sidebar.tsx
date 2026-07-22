import { useState } from "react";
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
  HeartPulse,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarItem {
  label: string;
  icon: any;
  path: string;
}

export const getRoleConfig = (role: Role): { title: string, items: SidebarItem[] } => {
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
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b border-sidebar-border ${collapsed ? "px-2" : ""}`}>
        {!collapsed && (
          <p className="text-xs font-bold text-sidebar-primary tracking-widest uppercase opacity-80 truncate">
            {config.title}
          </p>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex items-center justify-center w-8 h-8 rounded-md hover:bg-sidebar-accent text-sidebar-foreground transition-colors flex-shrink-0 mr-auto"
          title={collapsed ? "توسيع القائمة" : "تصغير القائمة"}
        >
          {collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        {/* Close button for mobile */}
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden flex items-center justify-center w-8 h-8 rounded-md hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {config.items.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          return (
            <Link key={item.path} href={item.path} onClick={() => setMobileOpen(false)}>
              <div
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all cursor-pointer group ${
                  collapsed ? "justify-center" : ""
                } ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-md shadow-primary/20"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`} />
                {!collapsed && <span className="text-sm truncate">{item.label}</span>}
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button - shown in content area */}
      <button
        onClick={() => setMobileOpen(true)}
        className={`md:hidden fixed bottom-6 left-4 z-40 w-12 h-12 rounded-full bg-sidebar-primary text-sidebar-primary-foreground shadow-lg flex items-center justify-center transition-transform hover:scale-105 ${mobileOpen ? "hidden" : "flex"}`}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`md:hidden fixed top-0 right-0 z-50 h-full w-72 bg-sidebar border-l border-sidebar-border overflow-y-auto transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-sidebar flex-shrink-0 h-full border-l border-sidebar-border overflow-y-auto transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
