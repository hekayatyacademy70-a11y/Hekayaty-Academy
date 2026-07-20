import { lazy, Suspense, useEffect } from 'react';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { useLocation } from "wouter";

// Providers & Context
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';

// Layouts
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Sidebar } from '@/components/layout/Sidebar';

// ─── Pages (Lazy loaded) ────────────────────────────────────
// Public
const Home            = lazy(() => import('@/pages/index'));
const Courses         = lazy(() => import('@/pages/courses/index'));
const CourseDetail    = lazy(() => import('@/pages/courses/[id]'));
const LessonPlayer    = lazy(() => import('@/pages/courses/[lessonId]'));
const Academy         = lazy(() => import('@/pages/academy/index'));
const AiLabHome       = lazy(() => import('@/pages/ai-lab/index'));
const Competitions    = lazy(() => import('@/pages/competitions/index'));
const Instructors     = lazy(() => import('@/pages/instructors/index'));
const Community       = lazy(() => import('@/pages/community/index'));
const Marketplace     = lazy(() => import('@/pages/marketplace/index'));
const KidsAcademy     = lazy(() => import('@/pages/kids/index'));

// Auth
const Login           = lazy(() => import('@/pages/auth/login'));
const Register        = lazy(() => import('@/pages/auth/register'));

// Dashboards
const StudentDashboard = lazy(() => import('@/pages/dashboard/index'));
const StudentCourses   = lazy(() => import('@/pages/dashboard/courses'));
const StudentPurchases = lazy(() => import('@/pages/dashboard/purchases'));
const InstructorDash   = lazy(() => import('@/pages/instructor/index'));
const InstructorCourses= lazy(() => import('@/pages/instructor/courses/index'));
const InstructorRevenue= lazy(() => import('@/pages/instructor/revenue'));
const CourseBuilder    = lazy(() => import('@/pages/instructor/courses/new'));
const AdminDashboard   = lazy(() => import('@/pages/admin/index'));
const ParentPortal     = lazy(() => import('@/pages/parent/index'));
const SettingsPage     = lazy(() => import('@/pages/settings/index'));

// Workspace
const Workspace       = lazy(() => import('@/pages/workspace/index'));

// Learning Paths
const PathsCatalog    = lazy(() => import('@/pages/paths/index'));
const PathLanding     = lazy(() => import('@/pages/paths/[slug]'));
const AdminPaths      = lazy(() => import('@/pages/admin/paths/index'));
const AdminPathBuilder= lazy(() => import('@/pages/admin/paths/[id]'));
const DashboardPaths  = lazy(() => import('@/pages/dashboard/paths'));
const InstructorPaths = lazy(() => import('@/pages/instructor/paths'));

// Articles
const ArticlesList    = lazy(() => import('@/pages/articles/index'));
const ArticleSingle   = lazy(() => import('@/pages/articles/[slug]'));
const AdminArticles   = lazy(() => import('@/pages/admin/articles/index'));
const AdminArticleEd  = lazy(() => import('@/pages/admin/articles/[id]'));
const InstArticles    = lazy(() => import('@/pages/instructor/articles/index'));
const InstArticleEd   = lazy(() => import('@/pages/instructor/articles/[id]'));

// ────────────────────────────────────────────────────────────
const queryClient = new QueryClient();

function PageLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  
  const isAuthPage     = location.startsWith('/auth');
  const isWorkspace    = location.startsWith('/workspace');
  const isLessonPlayer = /^\/courses\/[^/]+\/lessons\/[^/]+/.test(location);
  const isDashboard    = location.startsWith('/dashboard')   ||
                         (location.startsWith('/instructor') && !location.startsWith('/instructors')) ||
                         location.startsWith('/admin')       ||
                         location.startsWith('/superadmin')  ||
                         location.startsWith('/parent')      ||
                         location.startsWith('/reviewer');

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDashboard) {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
  }, [isDashboard]);

  if (isAuthPage) {
    return <main className="w-full min-h-screen flex flex-col">{children}</main>;
  }

  if (isWorkspace || isLessonPlayer) {
    return (
      <main className="w-full h-screen overflow-hidden flex flex-col bg-background">
        {children}
      </main>
    );
  }

  if (isDashboard) {
    return (
      <div className="w-full min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-muted/20">
            <div className="max-w-6xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    );
  }

  // Default public layout
  return (
    <div className="w-full min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/30">
      <Navbar />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="min-h-[50vh] w-full flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

function Router() {
  return (
    <PageLayout>
      <Suspense fallback={<LoadingSpinner />}>
        <Switch>
          {/* ── Home ───────────────────────────────────────── */}
          <Route path="/" component={Home} />

          {/* ── Auth ───────────────────────────────────────── */}
          <Route path="/auth/login"    component={Login} />
          <Route path="/auth/register" component={Register} />

          {/* ── Public Hubs ────────────────────────────────── */}
          <Route path="/academy" component={Academy} />
          <Route path="/courses" component={Courses} />
          <Route path="/courses/:id/lessons/:lessonId" component={LessonPlayer} />
          <Route path="/courses/:id" component={CourseDetail} />
          <Route path="/ai-lab" component={AiLabHome} />
          <Route path="/competitions" component={Competitions} />
          <Route path="/instructors" component={Instructors} />
          <Route path="/community" component={Community} />
          <Route path="/marketplace" component={Marketplace} />
          <Route path="/kids" component={KidsAcademy} />

          {/* ── Dashboards ─────────────────────────────────── */}
          <Route path="/dashboard" component={StudentDashboard} />
          <Route path="/dashboard/courses" component={StudentCourses} />
          <Route path="/dashboard/paths" component={DashboardPaths} />
          <Route path="/dashboard/purchases" component={StudentPurchases} />
          <Route path="/dashboard/settings" component={SettingsPage} />
          <Route path="/instructor" component={InstructorDash} />
          <Route path="/instructor/courses" component={InstructorCourses} />
          <Route path="/instructor/revenue" component={InstructorRevenue} />
          <Route path="/instructor/courses/new" component={CourseBuilder} />
          <Route path="/instructor/paths" component={InstructorPaths} />
          <Route path="/instructor/articles" component={InstArticles} />
          <Route path="/instructor/articles/:id" component={InstArticleEd} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/paths" component={AdminPaths} />
          <Route path="/admin/paths/:id" component={AdminPathBuilder} />
          <Route path="/admin/articles" component={AdminArticles} />
          <Route path="/admin/articles/:id" component={AdminArticleEd} />
          <Route path="/parent" component={ParentPortal} />
          
          {/* ── Workspace ──────────────────────────────────── */}
          <Route path="/workspace" component={Workspace} />

          {/* ── Articles ──────────────────────────────────── */}
          <Route path="/articles" component={ArticlesList} />
          <Route path="/articles/:slug" component={ArticleSingle} />

          {/* ── Learning Paths (Public) ─────────────────────── */}
          <Route path="/paths" component={PathsCatalog} />
          <Route path="/paths/:slug" component={PathLanding} />

          <Route path="/admin/paths/:id" component={AdminPathBuilder} />

          {/* ── Learning Paths (Student & Instructor) ───────── */}
          <Route path="/dashboard/paths" component={DashboardPaths} />
          <Route path="/instructor/paths" component={InstructorPaths} />

          {/* ── 404 ────────────────────────────────────────── */}
          <Route>
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
              <h1 className="text-6xl font-bold font-serif mb-4 text-primary">404</h1>
              <h2 className="text-2xl font-bold mb-4">الصفحة غير موجودة</h2>
              <p className="text-muted-foreground mb-8">
                عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
              </p>
              <a
                href="/"
                className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-bold hover:bg-primary/90 transition-colors"
              >
                العودة للرئيسية
              </a>
            </div>
          </Route>
        </Switch>
      </Suspense>
    </PageLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="hekayaty-theme">
        <AuthProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
