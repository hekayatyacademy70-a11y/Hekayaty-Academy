export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  color: string;
}

export const mockPosts: BlogPost[] = [
  {
    id: "b1",
    title: "كيف تبدأ روايتك الأولى: الخطوات الخمس الأساسية",
    excerpt: "الكثير من الكتاب يواجهون صعوبة في البداية. في هذا المقال نستعرض أهم 5 خطوات لتجاوز الخوف من الصفحة البيضاء.",
    author: "محمد الشريف",
    date: "10 أكتوبر 2024",
    readTime: "5 دقائق",
    category: "نصائح كتابية",
    color: "bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100"
  },
  {
    id: "b2",
    title: "دليل النشر الذاتي للكاتب العربي في 2024",
    excerpt: "هل تبحث عن بدائل لدور النشر التقليدية؟ تعرف على كيفية نشر كتابك بنفسك والوصول للقراء.",
    author: "نورة السالم",
    date: "5 أكتوبر 2024",
    readTime: "8 دقائق",
    category: "أدلة النشر",
    color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-100"
  },
  {
    id: "b3",
    title: "كيف تستخدم الذكاء الاصطناعي دون أن تفقد صوتك ككاتب",
    excerpt: "أدوات الذكاء الاصطناعي هي مجرد مساعد، وليست بديلاً عن إبداعك. تعلم كيف تستخدمها بذكاء.",
    author: "يوسف علي",
    date: "28 سبتمبر 2024",
    readTime: "6 دقائق",
    category: "أدلة الذكاء الاصطناعي",
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100"
  },
  {
    id: "b4",
    title: "قصة نجاح: من النشر الذاتي إلى قائمة الأكثر مبيعاً",
    excerpt: "مقابلة حصرية مع الكاتب الشاب الذي حققت روايته الأولى نجاحاً غير مسبوق في معرض الكتاب.",
    author: "فريق حكاياتي",
    date: "20 سبتمبر 2024",
    readTime: "10 دقائق",
    category: "قصص المؤلفين",
    color: "bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100"
  },
  {
    id: "b5",
    title: "الفرق بين الخيال العلمي والفانتازيا",
    excerpt: "دليل مبسط لفهم الفروق الدقيقة بين هذين النوعين الأدبيين الشهيرين وكيف تختار الأنسب لفكرتك.",
    author: "سارة العمري",
    date: "15 سبتمبر 2024",
    readTime: "4 دقائق",
    category: "نصائح كتابية",
    color: "bg-rose-100 dark:bg-rose-900/30 text-rose-900 dark:text-rose-100"
  },
  {
    id: "b6",
    title: "أهمية الغلاف الجيد في مبيعات الكتاب",
    excerpt: "القراء يحكمون على الكتاب من غلافه، هذه حقيقة. كيف تختار تصميماً يجذب جمهورك المستهدف؟",
    author: "سالم محمود",
    date: "10 سبتمبر 2024",
    readTime: "7 دقائق",
    category: "أدلة النشر",
    color: "bg-orange-100 dark:bg-orange-900/30 text-orange-900 dark:text-orange-100"
  },
  {
    id: "b7",
    title: "بناء الشخصية الشريرة: لماذا نحب الأشرار المعقدين؟",
    excerpt: "الشرير المسطح يفسد القصة. تعلم كيفية كتابة شخصيات شريرة لها دوافع منطقية وتاريخ مقنع.",
    author: "محمد الشريف",
    date: "5 سبتمبر 2024",
    readTime: "6 دقائق",
    category: "نصائح كتابية",
    color: "bg-slate-100 dark:bg-slate-900/30 text-slate-900 dark:text-slate-100"
  },
  {
    id: "b8",
    title: "هل البودكاست هو مستقبل الرواية الصوتية؟",
    excerpt: "تحليل لنمو سوق الصوتيات العربي وكيف يمكن للكتاب الاستفادة من هذه المنصات الجديدة.",
    author: "هدى سعيد",
    date: "1 سبتمبر 2024",
    readTime: "5 دقائق",
    category: "قصص المؤلفين",
    color: "bg-lime-100 dark:bg-lime-900/30 text-lime-900 dark:text-lime-100"
  }
];
