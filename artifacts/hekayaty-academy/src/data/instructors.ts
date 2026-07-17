export interface Instructor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  students: number;
  courses: number;
  bio: string;
  avatar: string;
}

export const mockInstructors: Instructor[] = [
  {
    id: "i1",
    name: "محمد الشريف",
    specialty: "روائي وكاتب سيناريو",
    rating: 4.8,
    students: 15000,
    courses: 4,
    bio: "كاتب روائي صدرت له 5 روايات حائزة على جوائز عربية. خبير في بناء الحبكة وتطوير الشخصيات.",
    avatar: "https://i.pravatar.cc/150?u=i1"
  },
  {
    id: "i2",
    name: "سارة العمري",
    specialty: "أدب الفانتازيا",
    rating: 4.9,
    students: 12400,
    courses: 3,
    bio: "مؤلفة سلسلة 'عوالم منسية'. متخصصة في بناء العوالم الخيالية وأنظمة السحر المبتكرة.",
    avatar: "https://i.pravatar.cc/150?u=i2"
  },
  {
    id: "i3",
    name: "أحمد القاسم",
    specialty: "الرواية التاريخية",
    rating: 4.7,
    students: 8300,
    courses: 5,
    bio: "باحث تاريخي وروائي. يدمج ببراعة بين الحقائق التاريخية والسرد الدرامي المشوق.",
    avatar: "https://i.pravatar.cc/150?u=i3"
  },
  {
    id: "i4",
    name: "ليلى المنصور",
    specialty: "خبيرة نشر",
    rating: 4.6,
    students: 22000,
    courses: 6,
    bio: "محررة سابقة في كبرى دور النشر العربية. تساعد الكتاب المستقلين على إخراج أعمالهم بأفضل صورة.",
    avatar: "https://i.pravatar.cc/150?u=i4"
  },
  {
    id: "i5",
    name: "طارق حسام",
    specialty: "كاتب سيناريو",
    rating: 4.9,
    students: 18500,
    courses: 3,
    bio: "كتب أكثر من 10 مسلسلات ناجحة. متخصص في كتابة الحوار الديناميكي وبناء المشاهد الدرامية.",
    avatar: "https://i.pravatar.cc/150?u=i5"
  },
  {
    id: "i6",
    name: "نورة السالم",
    specialty: "تسويق الكتب",
    rating: 4.8,
    students: 31000,
    courses: 4,
    bio: "مستشارة تسويق رقمي متخصصة في القطاع الثقافي وصناعة النشر. تدير حملات إطلاق الكتب الأكثر مبيعاً.",
    avatar: "https://i.pravatar.cc/150?u=i6"
  },
  {
    id: "i7",
    name: "ريم عبد الله",
    specialty: "أدب الطفل",
    rating: 4.8,
    students: 9500,
    courses: 2,
    bio: "مؤلفة ومصممة برامج تعليمية للأطفال. تركز على القيم التربوية بقوالب قصصية ممتعة.",
    avatar: "https://i.pravatar.cc/150?u=i7"
  },
  {
    id: "i8",
    name: "يوسف علي",
    specialty: "تقنيات الكتابة المتقدمة",
    rating: 4.7,
    students: 14200,
    courses: 2,
    bio: "رائد في دمج الذكاء الاصطناعي مع تقنيات الكتابة الإبداعية لتسريع الإنتاجية.",
    avatar: "https://i.pravatar.cc/150?u=i8"
  }
];
