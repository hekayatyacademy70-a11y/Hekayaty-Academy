import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import {
  useGetCourseById,
  useGetLessonById,
  useCompleteLesson,
  getGetCourseByIdQueryKey,
  getGetLessonByIdQueryKey,
  getGetMyEnrollmentsQueryKey,
  getGetMyStatsQueryKey
} from '@workspace/api-client-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  CheckCircle2,
  Circle,
  PlayCircle,
  Lock,
  ChevronRight,
  ChevronLeft,
  MessageSquare,
  FileText,
  StickyNote,
  Download,
  Send,
  ThumbsUp,
  ArrowRight,
  BookOpen,
  SkipForward,
  Volume2,
  Maximize,
  Pause,
  Play,
  Clock,
  Award,
  X,
  Loader2,
} from 'lucide-react';
import NotFound from '@/pages/not-found';

/* ─────────────────────────────────────────────────────────── */
/* TYPES                                                        */
/* ─────────────────────────────────────────────────────────── */
interface Note {
  id: string;
  timestamp: string;
  text: string;
}

interface DiscussionPost {
  id: string;
  author: string;
  avatar: string;
  time: string;
  text: string;
  likes: number;
  liked: boolean;
}

/* ─────────────────────────────────────────────────────────── */
/* MOCK DISCUSSION DATA                                         */
/* ─────────────────────────────────────────────────────────── */
const initialDiscussion: DiscussionPost[] = [
  {
    id: 'd1',
    author: 'أميرة خالد',
    avatar: 'https://i.pravatar.cc/150?u=amira',
    time: 'منذ ساعتين',
    text: 'الدرس رائع جداً! استفدت كثيراً من مفهوم الصراع الداخلي. هل يمكن التوسع أكثر في الفرق بينه وبين الصراع الخارجي؟',
    likes: 12,
    liked: false,
  },
  {
    id: 'd2',
    author: 'سامي الحربي',
    avatar: 'https://i.pravatar.cc/150?u=sami',
    time: 'منذ 5 ساعات',
    text: 'شكراً جزيلاً. لكن عندي سؤال: هل يجب أن يكون الصراع موجوداً في كل فصل أم يكفي أن يكون الفكرة الرئيسية للرواية؟',
    likes: 7,
    liked: false,
  },
  {
    id: 'd3',
    author: 'نور الرشيد',
    avatar: 'https://i.pravatar.cc/150?u=nour',
    time: 'منذ يوم',
    text: 'طبقت ما تعلمته في قصتي القصيرة وحصلت على تقييمات إيجابية من الأصدقاء. شكراً للأستاذ!',
    likes: 24,
    liked: true,
  },
];

/* ─────────────────────────────────────────────────────────── */
/* VIDEO PLAYER COMPONENT                                       */
/* ─────────────────────────────────────────────────────────── */
function VideoPlayer({
  youtubeVideoId,
  onProgress,
  onComplete,
}: {
  youtubeVideoId: string;
  onProgress: (pct: number) => void;
  onComplete: () => void;
}) {
  const [playing, setPlaying] = useState(false);
  const progressRef = useRef(0);
  const completedRef = useRef(false);

  // In a real application, you would use the YouTube Iframe API here to track progress
  // For MVP purposes without adding new dependencies, we provide a placeholder wrapper
  // and trigger completion after a set timeout or user interaction.
  
  useEffect(() => {
    if (!youtubeVideoId) return;
    
    // Simulate watching the video for demo purposes
    const timer = setInterval(() => {
      if (playing) {
        progressRef.current = Math.min(progressRef.current + 5, 100);
        onProgress(progressRef.current);
        
        if (progressRef.current >= 90 && !completedRef.current) {
          completedRef.current = true;
          onComplete();
        }
      }
    }, 5000);
    
    return () => clearInterval(timer);
  }, [youtubeVideoId, playing, onProgress]); // omitted onComplete to prevent interval reset if it changes

  if (!youtubeVideoId) {
    return (
      <div className="relative bg-muted rounded-xl overflow-hidden aspect-video w-full shadow-2xl flex items-center justify-center border border-border">
        <p className="text-muted-foreground font-medium">لم يتم إضافة فيديو لهذا الدرس بعد.</p>
      </div>
    );
  }

  return (
    <div className="relative bg-black rounded-xl overflow-hidden group aspect-video w-full shadow-2xl group">
      <iframe 
        src={`https://www.youtube.com/embed/${youtubeVideoId}?rel=0&modestbranding=1&controls=1&showinfo=0`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
        onLoad={() => setPlaying(true)}
      ></iframe>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* LESSON COMPLETE BANNER                                       */
/* ─────────────────────────────────────────────────────────── */
function LessonCompleteBanner({ onNext, hasNext }: { onNext: () => void; hasNext: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
    >
      <div className="flex items-center gap-3">
        <CheckCircle2 className="w-7 h-7 text-emerald-500 flex-shrink-0" />
        <div>
          <p className="font-bold text-emerald-700 dark:text-emerald-400">أنجزت هذا الدرس! 🎉</p>
          <p className="text-sm text-muted-foreground">تقدمك يُسعدنا. استمر!</p>
        </div>
      </div>
      {hasNext && (
        <Button
          onClick={onNext}
          className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
          الدرس التالي
        </Button>
      )}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* SIDEBAR LESSON ITEM                                          */
/* ─────────────────────────────────────────────────────────── */
function LessonItem({
  lesson,
  isActive,
  isLocked,
  onClick,
}: {
  lesson: any;
  isActive: boolean;
  isLocked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className={`w-full text-right flex items-start gap-3 p-3 rounded-lg transition-all duration-150 group
        ${isActive ? 'bg-primary/15 border border-primary/30' : 'hover:bg-muted/60'}
        ${isLocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span className="mt-0.5 flex-shrink-0">
        {isLocked ? (
          <Lock className="w-4 h-4 text-muted-foreground" />
        ) : lesson.isCompleted ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        ) : isActive ? (
          <PlayCircle className="w-4 h-4 text-primary" />
        ) : (
          <Circle className="w-4 h-4 text-muted-foreground/50" />
        )}
      </span>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium leading-snug line-clamp-2 ${
            isActive ? 'text-primary' : 'text-foreground'
          }`}
        >
          {lesson.title}
        </p>
        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {lesson.duration}
        </p>
      </div>
    </button>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* MAIN PAGE                                                    */
/* ─────────────────────────────────────────────────────────── */
export default function LessonPlayer() {
  const { id: courseId, lessonId } = useParams<{ id: string; lessonId: string }>();
  const [, navigate] = useLocation();

  const { data: course, isLoading: isCourseLoading } = useGetCourseById(courseId ?? '', {
    query: { queryKey: getGetCourseByIdQueryKey(courseId ?? ''), enabled: !!courseId }
  });

  const { data: currentLesson, isLoading: isLessonLoading } = useGetLessonById(courseId ?? '', lessonId ?? '', {
    query: { queryKey: getGetLessonByIdQueryKey(courseId ?? '', lessonId ?? ''), enabled: !!lessonId && !!courseId }
  });

  const completeLessonMutation = useCompleteLesson();
  const queryClient = useQueryClient();

  const flatLessons = course?.sections?.flatMap(s => s.lessons || []) || [];

  // Track completed lessons
  const [completed, setCompleted] = useState<Set<string>>(() => {
    const stored = localStorage.getItem(`hekayaty-completed-${courseId}`);
    return new Set(stored ? JSON.parse(stored) : []);
  });

  const [videoProgress, setVideoProgress] = useState(0);
  const [lessonJustFinished, setLessonJustFinished] = useState(false);
  const [activeTab, setActiveTab] = useState<'resources' | 'notes' | 'discussions'>('resources');

  // Notes state
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteText, setNoteText] = useState('');

  // Discussion state
  const [posts, setPosts] = useState<DiscussionPost[]>(initialDiscussion);
  const [newPost, setNewPost] = useState('');

  // Sidebar collapse on mobile
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (isCourseLoading || isLessonLoading) return <div className="h-screen flex items-center justify-center bg-background"><Loader2 className="w-12 h-12 text-primary animate-spin" /></div>;
  if (!course || !currentLesson) return <NotFound />;

  const currentIndex = flatLessons.findIndex(l => l.id === currentLesson.id);
  const prevLesson = currentIndex > 0 ? flatLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < flatLessons.length - 1 ? flatLessons[currentIndex + 1] : null;

  const totalCompleted = completed.size;
  const overallProgress = flatLessons.length > 0 ? Math.round((totalCompleted / flatLessons.length) * 100) : 0;

  const markComplete = (lId: string) => {
    setCompleted(prev => {
      const next = new Set(prev);
      next.add(lId);
      localStorage.setItem(`hekayaty-completed-${courseId}`, JSON.stringify([...next]));
      return next;
    });
    setLessonJustFinished(true);
    completeLessonMutation.mutate(
      { lessonId: lId },
      {
        onSuccess: () => {
          // Invalidate dashboard queries so progress bars update everywhere
          queryClient.invalidateQueries({ queryKey: getGetMyEnrollmentsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetMyStatsQueryKey() });
        },
      }
    );
  };

  const goToLesson = (lId: string) => {
    setLessonJustFinished(false);
    setVideoProgress(0);
    navigate(`/courses/${courseId}/lessons/${lId}`);
  };

  const addNote = () => {
    if (!noteText.trim()) return;
    const mins = Math.floor(videoProgress / 100 * 20); // mock timestamp
    setNotes(prev => [
      { id: Date.now().toString(), timestamp: `${mins}:00`, text: noteText.trim() },
      ...prev,
    ]);
    setNoteText('');
  };

  const submitPost = () => {
    if (!newPost.trim()) return;
    setPosts(prev => [
      {
        id: Date.now().toString(),
        author: 'محمد الشريف',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
        time: 'الآن',
        text: newPost.trim(),
        likes: 0,
        liked: false,
      },
      ...prev,
    ]);
    setNewPost('');
  };

  const toggleLike = (postId: string) => {
    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p,
      ),
    );
  };

  return (
    <div className="h-screen w-full flex flex-col bg-background overflow-hidden" dir="rtl">
      {/* ── TOP BAR ─────────────────────────────────────────── */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <Link href={`/courses/${courseId}`}>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground line-clamp-1 max-w-[200px] md:max-w-sm">
              {course.title}
            </span>
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            <span className="font-semibold text-foreground line-clamp-1 max-w-[180px]">
              {currentLesson.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Overall progress */}
          <div className="hidden md:flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              {totalCompleted}/{flatLessons.length} دروس
            </span>
            <div className="w-28 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <span className="text-sm font-bold text-primary">{overallProgress}%</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="gap-2 md:hidden"
            onClick={() => setSidebarOpen(o => !o)}
          >
            <FileText className="w-4 h-4" />
          </Button>

          {completed.has(currentLesson.id) ? (
            <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              مكتمل
            </Badge>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="gap-2"
              onClick={() => markComplete(currentLesson.id)}
            >
              <CheckCircle2 className="w-4 h-4" />
              تحديد كمكتمل
            </Button>
          )}
        </div>
      </header>

      {/* ── MAIN BODY ────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* ── LEFT: Content area ─────────────────────────── */}
        <main className="flex-1 overflow-y-auto flex flex-col">
          <div className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto w-full">
            {/* Video */}
            <VideoPlayer
              youtubeVideoId={currentLesson.youtubeVideoId || ""}
              onProgress={setVideoProgress}
              onComplete={() => markComplete(currentLesson.id)}
            />

            {/* Lesson complete banner */}
            <AnimatePresence>
              {lessonJustFinished && (
                <LessonCompleteBanner
                  hasNext={!!nextLesson}
                  onNext={() => nextLesson && goToLesson(nextLesson.id)}
                />
              )}
            </AnimatePresence>

            {/* Lesson title + nav */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold font-serif text-foreground mb-1">
                  {currentLesson.title}
                </h1>
                <p className="text-muted-foreground text-sm">{(currentLesson as any).description}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {prevLesson && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => goToLesson(prevLesson.id)}
                  >
                    <ChevronRight className="w-4 h-4" />
                    السابق
                  </Button>
                )}
                {nextLesson && (
                  <Button
                    size="sm"
                    className="gap-2"
                    onClick={() => goToLesson(nextLesson.id)}
                  >
                    التالي
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Tabs: Resources / Notes / Discussions removed */}
          </div>
        </main>

        {/* ── RIGHT: Curriculum Sidebar ───────────────────── */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              key="sidebar"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="flex-shrink-0 border-r border-border bg-card flex flex-col overflow-hidden"
              style={{ width: 320 }}
            >
              {/* Sidebar header */}
              <div className="p-4 border-b border-border flex items-center justify-between shrink-0">
                <div>
                  <h3 className="font-bold text-sm text-foreground">محتوى الدورة</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {totalCompleted}/{flatLessons.length} دروس مكتملة
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Overall progress */}
              <div className="px-4 py-3 border-b border-border shrink-0">
                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                  <span>نسبة الإتمام</span>
                  <span className="font-bold text-primary">{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-1.5" />
              </div>

              {/* Modules & lessons */}
              <ScrollArea className="flex-1">
                <div className="p-3 space-y-4">
                  {course.sections?.map((mod: any) => (
                    <div key={mod.id}>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-2 mb-2">
                        {mod.title}
                      </p>
                      <div className="space-y-1">
                        {mod.lessons?.map((lesson: any, idx: number) => {
                          const lessonIndex = flatLessons.findIndex(l => l.id === lesson.id);
                          const isLocked = !lesson.isPreview && lessonIndex > 0 && !completed.has(flatLessons[lessonIndex - 1].id) && !completed.has(lesson.id);
                          return (
                            <LessonItem
                              key={lesson.id}
                              lesson={{ ...lesson, isCompleted: completed.has(lesson.id) }}
                              isActive={lesson.id === currentLesson.id}
                              isLocked={false} // unlock all for MVP
                              onClick={() => goToLesson(lesson.id)}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Course completion CTA */}
                  {overallProgress === 100 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mx-2 p-4 rounded-xl bg-primary text-primary-foreground text-center"
                    >
                      <Award className="w-8 h-8 mx-auto mb-2 opacity-90" />
                      <p className="font-bold text-sm mb-3">أتممت الدورة!</p>
                      <Link href={`/courses/${courseId}/quiz`}>
                        <Button
                          size="sm"
                          className="w-full bg-white text-primary hover:bg-white/90 font-bold"
                        >
                          احصل على شهادتك
                        </Button>
                      </Link>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Toggle sidebar button when closed */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed left-4 bottom-6 z-30 bg-card border border-border shadow-lg rounded-full p-3 hover:bg-muted transition-colors"
          >
            <FileText className="w-5 h-5 text-primary" />
          </button>
        )}
      </div>
    </div>
  );
}
