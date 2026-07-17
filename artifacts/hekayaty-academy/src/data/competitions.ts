export interface Competition {
  id: string;
  title: string;
  description: string;
  category: string;
  prizePool: string;
  deadline: string;
  participants: number;
  status: "مفتوحة" | "مغلقة" | "قيد التحكيم";
}

export const mockCompetitions: Competition[] = [
  {
    id: "comp1",
    title: "جائزة حكاياتي للرواية العربية المكتشفة",
    description: "مسابقة كبرى تستهدف الروايات غير المنشورة في جميع التصنيفات. الفائز يحصل على عقد نشر وتوزيع.",
    category: "الرواية",
    prizePool: "50,000 دولار + عقد نشر",
    deadline: "2024-12-31",
    participants: 1240,
    status: "مفتوحة"
  },
  {
    id: "comp2",
    title: "تحدي القصة القصيرة: الخيال العلمي",
    description: "اكتب قصة قصيرة لا تتجاوز 3000 كلمة تستكشف مستقبل الذكاء الاصطناعي في الوطن العربي.",
    category: "القصة القصيرة",
    prizePool: "5,000 دولار",
    deadline: "2024-11-15",
    participants: 450,
    status: "مفتوحة"
  },
  {
    id: "comp3",
    title: "مسابقة أدب الطفل السنوية",
    description: "نبحث عن أجمل القصص الموجهة للأطفال من سن 7-10 سنوات. الفائز سيتم تحويل قصته إلى كتاب مصور.",
    category: "أدب الطفل",
    prizePool: "10,000 دولار + رسم القصة",
    deadline: "2024-10-30",
    participants: 320,
    status: "مفتوحة"
  },
  {
    id: "comp4",
    title: "مسابقة أفضل سيناريو قصير",
    description: "مسابقة لكتابة سيناريو لفيلم قصير مدته لا تتجاوز 15 دقيقة.",
    category: "السيناريو",
    prizePool: "إنتاج الفيلم",
    deadline: "2024-09-01",
    participants: 890,
    status: "قيد التحكيم"
  },
  {
    id: "comp5",
    title: "جائزة الشعر العربي المعاصر",
    description: "ديوان شعري باللغة الفصحى الحديثة يتناول قضايا الإنسان المعاصر.",
    category: "الشعر",
    prizePool: "15,000 دولار",
    deadline: "2024-08-15",
    participants: 610,
    status: "مغلقة"
  }
];
