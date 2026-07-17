export interface Path {
  id: string;
  title: string;
  description: string;
  coursesCount: number;
  duration: string;
  iconType: string;
}

export const mockPaths: Path[] = [
  {
    id: "p1",
    title: "الكاتب المبتدئ",
    description: "رحلتك الأولى من الفكرة وحتى إتمام مسودتك الأولى.",
    coursesCount: 4,
    duration: "3 أشهر",
    iconType: "pen"
  },
  {
    id: "p2",
    title: "الروائي المحترف",
    description: "تقنيات متقدمة في بناء الحبكة، تطوير الشخصيات، وصياغة الحوار.",
    coursesCount: 6,
    duration: "5 أشهر",
    iconType: "book"
  },
  {
    id: "p3",
    title: "مسار النشر الشامل",
    description: "كل ما تحتاجه لفهم صناعة النشر، التسويق، وحقوق المؤلف.",
    coursesCount: 5,
    duration: "4 أشهر",
    iconType: "printer"
  },
  {
    id: "p4",
    title: "صناعة القصة المصورة",
    description: "من كتابة السيناريو للكوميكس إلى تصميم الشخصيات ورسمها.",
    coursesCount: 4,
    duration: "3 أشهر",
    iconType: "palette"
  },
  {
    id: "p5",
    title: "كاتب السيناريو",
    description: "احترف كتابة السيناريو للسينما والتلفزيون والمنصات الرقمية.",
    coursesCount: 5,
    duration: "4 أشهر",
    iconType: "video"
  },
  {
    id: "p6",
    title: "الكاتب المدعوم بالذكاء الاصطناعي",
    description: "كيف توظف أدوات الذكاء الاصطناعي في العصف الذهني والتحرير.",
    coursesCount: 3,
    duration: "شهرين",
    iconType: "cpu"
  }
];
