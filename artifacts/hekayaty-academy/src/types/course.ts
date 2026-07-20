// This is an adapter type that works for both mock and API data
// Fields marked optional are only available from the mock until real data is seeded
export interface CourseCardData {
  id: string;
  title: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  thumbnailColor?: string; // only from mock data
  instructorId: string;
  instructorName?: string; // populated from joined query
  rating?: number;
  students?: number;
  price: number;
  duration?: string;
  category?: string;
  level: string;
  status?: string;
  isPremium?: boolean;
}
