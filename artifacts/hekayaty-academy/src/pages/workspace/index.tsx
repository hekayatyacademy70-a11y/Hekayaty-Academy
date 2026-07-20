import { PageTransition } from "@/components/ui/PageTransition";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { 
  SidebarClose, SidebarOpen, Save, Play, Type, ArrowRight, LayoutPanelLeft, 
  Sparkles, Loader2, Send 
} from "lucide-react";
import { Link } from "wouter";
import { 
  useGetMyManuscripts, useGetManuscriptDetails, useCreateManuscript, 
  useCreateChapter, useUpdateChapterContent, useGenerateAiContent,
  ManuscriptDetails, getGetManuscriptDetailsQueryKey
} from "@workspace/api-client-react";

// Use a debounce helper for auto-saving
function useDebounce<T extends (...args: any[]) => void>(callback: T, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
}

export default function Workspace() {
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  
  // Manuscript Selection
  const { data: manuscripts, isLoading: loadingManuscripts } = useGetMyManuscripts();
  const [activeManuscriptId, setActiveManuscriptId] = useState<string | null>(null);
  
  // Create hooks
  const { mutateAsync: createManuscript, isPending: creatingManuscript } = useCreateManuscript();
  const { mutateAsync: createChapter } = useCreateChapter();
  const { mutateAsync: updateChapter } = useUpdateChapterContent();
  const { mutateAsync: generateAi, isPending: aiLoading } = useGenerateAiContent();

  // If we have manuscripts but none selected, select first
  useEffect(() => {
    if (manuscripts && manuscripts.length > 0 && !activeManuscriptId) {
      setActiveManuscriptId(manuscripts[0].id);
    }
  }, [manuscripts, activeManuscriptId]);

  // Load active manuscript details
  const { data: activeManuscript, refetch: refetchDetails } = useGetManuscriptDetails(
    activeManuscriptId || "",
    { 
      query: { 
        enabled: !!activeManuscriptId, 
        queryKey: getGetManuscriptDetailsQueryKey(activeManuscriptId || "") 
      } 
    }
  );

  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  
  // Local state for the editor
  const [titleContent, setTitleContent] = useState("");
  const [bodyContent, setBodyContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // AI Chat state
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  // Auto-select first chapter when manuscript loads
  useEffect(() => {
    if (activeManuscript?.chapters?.length && !activeChapterId) {
      const firstChapter = activeManuscript.chapters[0];
      setActiveChapterId(firstChapter.id);
      setTitleContent(firstChapter.title);
      setBodyContent(firstChapter.content || "");
    }
  }, [activeManuscript, activeChapterId]);

  // Handle switching chapters
  const handleSwitchChapter = (chapterId: string) => {
    const chapter = activeManuscript?.chapters.find(c => c.id === chapterId);
    if (chapter) {
      setActiveChapterId(chapter.id);
      setTitleContent(chapter.title);
      setBodyContent(chapter.content || "");
    }
  };

  const handleCreateNewManuscript = async () => {
    const ms = await createManuscript({ data: { title: "رواية جديدة", genre: "novel" } });
    setActiveManuscriptId(ms.id);
  };

  const handleCreateNewChapter = async () => {
    if (!activeManuscriptId) return;
    await createChapter({ id: activeManuscriptId, data: { title: "فصل جديد" } });
    refetchDetails();
  };

  // Auto-save logic
  const debouncedSave = useDebounce(async (cId: string, title: string, content: string) => {
    setIsSaving(true);
    try {
      // rough word count
      const wordCount = content.split(/\s+/).filter(Boolean).length;
      await updateChapter({
        chapterId: cId,
        data: { title, content, wordCount }
      });
    } finally {
      setIsSaving(false);
    }
  }, 1000);

  const handleTitleChange = (e: React.FormEvent<HTMLHeadingElement>) => {
    const newTitle = e.currentTarget.textContent || "";
    setTitleContent(newTitle);
    if (activeChapterId) debouncedSave(activeChapterId, newTitle, bodyContent);
  };

  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.innerHTML;
    setBodyContent(newContent);
    if (activeChapterId) debouncedSave(activeChapterId, titleContent, newContent);
  };

  const toggleFocus = () => {
    setFocusMode(!focusMode);
    if (!focusMode) {
      setLeftPanelOpen(false);
      setRightPanelOpen(false);
    } else {
      setLeftPanelOpen(true);
    }
  };

  const handleAiAsk = async () => {
    if (!aiPrompt.trim()) return;
    
    // Strip HTML from context for the AI
    const contextText = bodyContent.replace(/<[^>]*>?/gm, '');
    
    const res = await generateAi({
      data: {
        prompt: aiPrompt,
        context: contextText.substring(Math.max(0, contextText.length - 2000)) // send last 2000 chars
      }
    });
    setAiResponse(res.text);
  };

  // Render blank state if no manuscript exists
  if (!loadingManuscripts && (!manuscripts || manuscripts.length === 0)) {
    return (
      <PageTransition className="h-screen w-full flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-3xl font-serif font-bold mb-4">أهلاً بك في مساحة الكتابة</h1>
          <p className="text-muted-foreground mb-6">مساحتك الإبداعية المدعومة بالذكاء الاصطناعي.</p>
          <Button onClick={handleCreateNewManuscript} disabled={creatingManuscript}>
            {creatingManuscript ? <Loader2 className="w-4 h-4 animate-spin" /> : "ابدأ روايتك الأولى الآن"}
          </Button>
        </div>
      </PageTransition>
    );
  }

  const wordCountDisplay = bodyContent.replace(/<[^>]*>?/gm, '').split(/\s+/).filter(Boolean).length;

  return (
    <PageTransition className="h-screen w-full flex flex-col bg-background overflow-hidden selection:bg-primary/30">
      
      {/* Topbar */}
      <header className={`h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0 transition-transform duration-300 ${focusMode ? '-translate-y-full absolute w-full z-50 opacity-0' : 'translate-y-0 opacity-100'}`}>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div className="h-6 w-px bg-border"></div>
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="text-muted-foreground">رواية:</span>
            <span className="font-bold text-primary">{activeManuscript?.title || "..."}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            {isSaving ? (
              <><Loader2 className="w-3 h-3 animate-spin" /> جاري الحفظ...</>
            ) : (
              <><Save className="w-3 h-3" /> تم الحفظ</>
            )}
          </span>
          <div className="h-6 w-px bg-border"></div>
          <span className="text-sm font-bold">{wordCountDisplay} كلمة</span>
          <div className="h-6 w-px bg-border"></div>
          <Button variant="ghost" size="icon" onClick={toggleFocus} title="وضع التركيز">
            <LayoutPanelLeft className="w-4 h-4" />
          </Button>
          <Button 
            variant={rightPanelOpen ? "secondary" : "default"} 
            size="sm" 
            className="h-8 gap-2 bg-gradient-to-l from-indigo-500 to-purple-500 text-white hover:opacity-90"
            onClick={() => setRightPanelOpen(!rightPanelOpen)}
          >
            <Sparkles className="w-4 h-4" /> المساعد الذكي
          </Button>
        </div>
      </header>

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Panel: Chapters Tree */}
        <aside className={`w-64 border-l border-border bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 ${leftPanelOpen ? 'translate-x-0' : 'translate-x-full absolute right-0 h-full z-10 shadow-2xl'}`}>
          <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
            <h3 className="font-bold text-sm">الفصول</h3>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-sidebar-foreground hover:bg-sidebar-accent" onClick={() => setLeftPanelOpen(false)}>
              <SidebarClose className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 text-sm font-medium">
            {activeManuscript?.chapters?.map((ch) => {
              const active = ch.id === activeChapterId;
              return (
                <div 
                  key={ch.id} 
                  onClick={() => handleSwitchChapter(ch.id)}
                  className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${active ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'hover:bg-sidebar-accent'}`}
                >
                  <span className="truncate">{ch.title}</span>
                  <span className={`text-xs ${active ? 'text-sidebar-primary-foreground/80' : 'text-sidebar-foreground/50'}`}>
                    {ch.wordCount || 0}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="p-4 border-t border-sidebar-border">
            <Button 
              variant="outline" 
              className="w-full text-xs border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
              onClick={handleCreateNewChapter}
            >
              + فصل جديد
            </Button>
          </div>
        </aside>

        {/* Center: Editor */}
        <main className="flex-1 bg-background relative flex flex-col items-center overflow-hidden">
          {focusMode && (
            <div className="absolute top-4 right-4 z-50">
              <Button variant="outline" size="sm" onClick={toggleFocus} className="bg-background/50 backdrop-blur shadow-sm">
                الخروج من وضع التركيز
              </Button>
            </div>
          )}

          {!leftPanelOpen && !focusMode && (
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 z-10 bg-card shadow-sm border border-border" onClick={() => setLeftPanelOpen(true)}>
              <SidebarOpen className="w-4 h-4" />
            </Button>
          )}

          <div className={`w-full max-w-3xl mx-auto mt-4 p-1 rounded-lg border border-border bg-card shadow-sm flex items-center justify-center gap-1 transition-all duration-300 ${focusMode ? 'opacity-0 -translate-y-10 absolute pointer-events-none' : 'opacity-100 translate-y-0'}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8"><Type className="w-4 h-4" /></Button>
            <div className="w-px h-4 bg-border mx-1" />
            <Button variant="ghost" size="icon" className="h-8 w-8 font-serif font-bold text-lg leading-none">B</Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 font-serif italic text-lg leading-none">I</Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 font-serif underline text-lg leading-none">U</Button>
          </div>

          <div className="flex-1 w-full overflow-y-auto mt-4 pb-32 pt-8">
            <div className="max-w-2xl mx-auto px-8 w-full">
              <h1 
                className="text-4xl font-serif font-bold mb-8 text-foreground outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/50" 
                contentEditable 
                suppressContentEditableWarning 
                data-placeholder="عنوان الفصل..."
                onInput={handleTitleChange}
                dangerouslySetInnerHTML={{ __html: titleContent }}
              />
              <div 
                className="prose prose-lg dark:prose-invert font-serif w-full max-w-none focus:outline-none min-h-[500px] leading-loose text-foreground/90 empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/50"
                contentEditable 
                suppressContentEditableWarning
                data-placeholder="ابدأ بكتابة قصتك هنا..."
                onInput={handleContentChange}
                dangerouslySetInnerHTML={{ __html: bodyContent }}
              />
            </div>
          </div>
        </main>

        {/* Right Panel: AI Assistant */}
        {rightPanelOpen && !focusMode && (
          <aside className="w-80 border-r border-border bg-card shadow-xl flex flex-col z-20">
            <div className="p-4 border-b border-border bg-gradient-to-b from-indigo-500/10 to-transparent flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold">المساعد الذكي (Gemini)</h3>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setRightPanelOpen(false)}>
                <SidebarClose className="w-4 h-4 rotate-180" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
              <div className="bg-muted p-3 rounded-lg rounded-tr-none text-foreground border border-border">
                أهلاً! أنا المساعد الذكي الخاص بك. يمكنني اقتراح أفكار للحبكة، تحسين حواراتك، أو حتى توليد وصف لمشهد جديد. ما الذي تحتاج مساعدة به؟
              </div>
              
              {aiResponse && (
                <div className="bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-lg rounded-tr-none text-foreground">
                  <p className="whitespace-pre-wrap">{aiResponse}</p>
                </div>
              )}
              {aiLoading && (
                <div className="bg-indigo-500/10 p-3 rounded-lg rounded-tr-none flex justify-center">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                </div>
              )}
            </div>

            <div className="p-3 border-t border-border bg-muted/30">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAiAsk()}
                  placeholder="اطلب فكرة أو تحسين..." 
                  className="flex-1 bg-background border border-border rounded-md px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button size="icon" className="shrink-0 bg-indigo-500 hover:bg-indigo-600 text-white" onClick={handleAiAsk} disabled={aiLoading}>
                  {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </aside>
        )}

      </div>
    </PageTransition>
  );
}
