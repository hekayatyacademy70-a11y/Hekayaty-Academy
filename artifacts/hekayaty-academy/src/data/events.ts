export interface Event {
  id: string;
  title: string;
  type: "ورشة عمل" | "بث مباشر" | "ندوة" | "تحدي";
  date: string;
  time: string;
  instructor: string;
  seats: number;
  remainingSeats: number;
}

export const mockEvents: Event[] = [
  {
    id: "e1",
    title: "ورشة: كيف تتغلب على حبسة الكاتب؟",
    type: "ورشة عمل",
    date: "15 أكتوبر 2024",
    time: "20:00 KSA",
    instructor: "محمد الشريف",
    seats: 100,
    remainingSeats: 12
  },
  {
    id: "e2",
    title: "بث مباشر: تقييم نصوص المشاركين",
    type: "بث مباشر",
    date: "20 أكتوبر 2024",
    time: "21:00 KSA",
    instructor: "ليلى المنصور",
    seats: 500,
    remainingSeats: 140
  },
  {
    id: "e3",
    title: "ندوة: مستقبل النشر الرقمي العربي",
    type: "ندوة",
    date: "25 أكتوبر 2024",
    time: "19:00 KSA",
    instructor: "نورة السالم",
    seats: 1000,
    remainingSeats: 450
  },
  {
    id: "e4",
    title: "تحدي كتابة قصة قصيرة في 48 ساعة",
    type: "تحدي",
    date: "1 نوفمبر 2024",
    time: "00:00 KSA",
    instructor: "أكاديمية حكاياتي",
    seats: 2000,
    remainingSeats: 800
  },
  {
    id: "e5",
    title: "ورشة: أدب الرعب وبناء التوتر",
    type: "ورشة عمل",
    date: "5 نوفمبر 2024",
    time: "20:00 KSA",
    instructor: "سارة العمري",
    seats: 150,
    remainingSeats: 5
  },
  {
    id: "e6",
    title: "بث مباشر: جلسة سؤال وجواب",
    type: "بث مباشر",
    date: "10 نوفمبر 2024",
    time: "21:00 KSA",
    instructor: "طارق حسام",
    seats: 300,
    remainingSeats: 120
  },
  {
    id: "e7",
    title: "ندوة: حقوق الملكية الفكرية",
    type: "ندوة",
    date: "15 نوفمبر 2024",
    time: "18:00 KSA",
    instructor: "محامي الأكاديمية",
    seats: 500,
    remainingSeats: 210
  },
  {
    id: "e8",
    title: "ورشة: بناء الشخصيات المعقدة",
    type: "ورشة عمل",
    date: "20 نوفمبر 2024",
    time: "19:30 KSA",
    instructor: "محمد الشريف",
    seats: 80,
    remainingSeats: 0
  }
];
