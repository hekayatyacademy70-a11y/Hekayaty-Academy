import { lazy, Suspense } from 'react';
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

// Pages (Lazy loaded)
const Home = lazy(() => import('@/pages/index'));
const Login = lazy(() => import('@/pages/auth/login'));
// Register is missing, we'll map it to Login for now or create a stub
const Register = lazy(() => import('@/pages/auth/login')); // TODO: Create Register
const Courses = lazy(() => import('@/pages/courses/index'));
const CourseDetail = lazy(() => import('@/pages/courses/[id]'));
const StudentDashboard = lazy(() => import('@/pages/dashboard/index'));
const Workspace = lazy(() => import('@/pages/workspace/index'));
const AiLabHome = lazy(() => import('@/pages/ai-lab/index'));

const queryClient = new QueryClient();

function PageLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  
  const isAuthPage = location.startsWith('/auth');
  const isWorkspace = location.startsWith('/workspace');
  const isDashboard = location.startsWith('/dashboard') || 
                      location.startsWith('/instructor') || 
                      location.startsWith('/admin') ||
                      location.startsWith('/superadmin') ||
                      location.startsWith('/parent') ||
                      location.startsWith('/reviewer');

  if (isAuthPage) {
    return <main className="w-full min-h-screen flex flex-col">{children}</main>;
  }

  if (isWorkspace) {
    return <main className="w-full h-screen overflow-hidden flex flex-col bg-background">{children}</main>;
  }

  if (isDashboard) {
    return (
      <div className="w-full min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-muted/20">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    );
  }

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
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    </div>
  );
}

function Router() {
  return (
    <PageLayout>
      <Suspense fallback={<LoadingSpinner />}>
        <Switch>
          <Route path="/" component={Home} />
          
          {/* Auth */}
          <Route path="/auth/login" component={Login} />
          <Route path="/auth/register" component={Register} />
          
          {/* Public Pages */}
          <Route path="/courses" component={Courses} />
          <Route path="/courses/:id" component={CourseDetail} />
          <Route path="/ai-lab" component={AiLabHome} />
          
          {/* Dashboards */}
          <Route path="/dashboard" component={StudentDashboard} />
          
          {/* Workspace */}
          <Route path="/workspace" component={Workspace} />

          {/* 404 */}
          <Route>
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
              <h1 className="text-6xl font-bold font-serif mb-4 text-primary">404</h1>
              <h2 className="text-2xl font-bold mb-4">الصفحة غير موجودة</h2>
              <p className="text-muted-foreground mb-8">عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.</p>
              <a href="/" className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-bold hover:bg-primary/90 transition-colors">العودة للرئيسية</a>
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
