export interface Student {
  id: string;
  name: string;
  xp: number;
  rank: string;
  completedCourses: number;
  badges: string[];
  avatar: string;
}

export const mockStudents: Student[] = [
  { id: "s1", name: "عمر جمال", xp: 12500, rank: "كاتب محترف", completedCourses: 12, badges: ["محب للقراءة", "نجم التحديات", "صوت واعد"], avatar: "https://i.pravatar.cc/150?u=s1" },
  { id: "s2", name: "فاطمة الزهراء", xp: 11200, rank: "كاتب محترف", completedCourses: 10, badges: ["نجم التحديات", "صاحب المركز الأول"], avatar: "https://i.pravatar.cc/150?u=s2" },
  { id: "s3", name: "ياسين مصطفى", xp: 9800, rank: "راوي", completedCourses: 8, badges: ["المثابر"], avatar: "https://i.pravatar.cc/150?u=s3" },
  { id: "s4", name: "مريم خالد", xp: 9500, rank: "راوي", completedCourses: 7, badges: ["مبدع"], avatar: "https://i.pravatar.cc/150?u=s4" },
  { id: "s5", name: "أحمد حسن", xp: 8200, rank: "قلم واعد", completedCourses: 6, badges: ["محب للقراءة"], avatar: "https://i.pravatar.cc/150?u=s5" },
  { id: "s6", name: "لجين محمود", xp: 7900, rank: "قلم واعد", completedCourses: 5, badges: ["نشط في المجتمع"], avatar: "https://i.pravatar.cc/150?u=s6" },
  { id: "s7", name: "عبدالله طارق", xp: 7500, rank: "قلم واعد", completedCourses: 5, badges: [], avatar: "https://i.pravatar.cc/150?u=s7" },
  { id: "s8", name: "رغد سامي", xp: 6200, rank: "مبتدئ", completedCourses: 4, badges: ["مبدع"], avatar: "https://i.pravatar.cc/150?u=s8" },
  { id: "s9", name: "خالد وليد", xp: 5800, rank: "مبتدئ", completedCourses: 3, badges: ["المثابر"], avatar: "https://i.pravatar.cc/150?u=s9" },
  { id: "s10", name: "سعاد علي", xp: 5100, rank: "مبتدئ", completedCourses: 3, badges: [], avatar: "https://i.pravatar.cc/150?u=s10" },
];
