import { PageTransition } from "@/components/ui/PageTransition";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PenTool, SidebarClose, SidebarOpen, Save, Settings, Play, Type, ArrowRight, LayoutPanelLeft } from "lucide-react";
import { Link } from "wouter";

export default function Workspace() {
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);

  const toggleFocus = () => {
    setFocusMode(!focusMode);
    if (!focusMode) {
      setLeftPanelOpen(false);
      setRightPanelOpen(false);
    } else {
      setLeftPanelOpen(true);
    }
  };

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
            <span className="font-bold text-primary">مدينة الرماد</span>
            <span className="text-muted-foreground mx-1">/</span>
            <span>الفصل الثالث</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Save className="w-3 h-3" /> تم الحفظ
          </span>
          <div className="h-6 w-px bg-border"></div>
          <span className="text-sm font-bold">1,245 كلمة</span>
          <div className="h-6 w-px bg-border"></div>
          <Button variant="ghost" size="icon" onClick={toggleFocus} title="وضع التركيز">
            <LayoutPanelLeft className="w-4 h-4" />
          </Button>
          <Button variant="default" size="sm" className="h-8 gap-2">
            <Play className="w-4 h-4" /> متابعة
          </Button>
        </div>
      </header>

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Panel: Chapters Tree */}
        <aside className={`w-64 border-l border-border bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 ${leftPanelOpen ? 'translate-x-0' : 'translate-x-full absolute right-0 h-full z-10 shadow-2xl'}`}>
          <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
            <h3 className="font-bold text-sm">المسودة الأولى</h3>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-sidebar-foreground hover:bg-sidebar-accent" onClick={() => setLeftPanelOpen(false)}>
              <SidebarClose className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 text-sm font-medium">
            {[
              { title: "المقدمة", words: 850 },
              { title: "الفصل الأول: البداية", words: 2100 },
              { title: "الفصل الثاني: الاكتشاف", words: 1800 },
              { title: "الفصل الثالث", words: 1245, active: true },
              { title: "الفصل الرابع", words: 0 },
            ].map((ch, i) => (
              <div key={i} className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${ch.active ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'hover:bg-sidebar-accent'}`}>
                <span className="truncate">{ch.title}</span>
                <span className={`text-xs ${ch.active ? 'text-sidebar-primary-foreground/80' : 'text-sidebar-foreground/50'}`}>{ch.words}</span>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-sidebar-border">
            <Button variant="outline" className="w-full text-xs border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground">
              + فصل جديد
            </Button>
          </div>
        </aside>

        {/* Center: Editor */}
        <main className="flex-1 bg-background relative flex flex-col items-center overflow-hidden">
          
          {/* Floating actions in focus mode */}
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

          {/* Formatting Toolbar */}
          <div className={`w-full max-w-3xl mx-auto mt-4 p-1 rounded-lg border border-border bg-card shadow-sm flex items-center justify-center gap-1 transition-all duration-300 ${focusMode ? 'opacity-0 -translate-y-10 absolute pointer-events-none' : 'opacity-100 translate-y-0'}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8"><Type className="w-4 h-4" /></Button>
            <div className="w-px h-4 bg-border mx-1" />
            <Button variant="ghost" size="icon" className="h-8 w-8 font-serif font-bold text-lg leading-none">B</Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 font-serif italic text-lg leading-none">I</Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 font-serif underline text-lg leading-none">U</Button>
            <div className="w-px h-4 bg-border mx-1" />
            <Button variant="ghost" size="sm" className="h-8 text-xs font-medium">H1</Button>
            <Button variant="ghost" size="sm" className="h-8 text-xs font-medium">H2</Button>
            <Button variant="ghost" size="sm" className="h-8 text-xs font-medium">H3</Button>
          </div>

          {/* Editor Area */}
          <div className="flex-1 w-full overflow-y-auto mt-4 pb-32 pt-8">
            <div className="max-w-2xl mx-auto px-8 w-full">
              <h1 className="text-4xl font-serif font-bold mb-8 text-foreground outline-none" contentEditable suppressContentEditableWarning data-placeholder="عنوان الفصل...">
                الفصل الثالث
              </h1>
              <div 
                className="prose prose-lg dark:prose-invert font-serif w-full max-w-none focus:outline-none min-h-[500px] leading-loose text-foreground/90"
                contentEditable 
                suppressContentEditableWarning
                data-placeholder="ابدأ بكتابة قصتك هنا..."
              >
                كانت المدينة تغفو تحت رماد الذكريات، وكلما هبت الرياح الشمالية، تناثرت حكايات القدامى في الشوارع الفارغة. لم يكن أحد يجرؤ على الخروج بعد الغروب، ليس خوفاً من الظلام، بل خوفاً مما يخفيه الظلام بين طياته.
                <br/><br/>
                توقفت "ليال" أمام الباب الخشبي العتيق. أخذت نفساً عميقاً وهي تتأمل النقوش المحفورة عليه. لم تكن مجرد نقوش للزينة، بل كانت تعاويذ حماية قديمة لم تعد تجدي نفعاً في هذا العصر. رفعت يدها المرتجفة وطرقت الباب ثلاث مرات متتالية...
              </div>
            </div>
          </div>
        </main>

      </div>
    </PageTransition>
  );
}
