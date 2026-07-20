export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'zip';
  size: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  isPreview: boolean;
  isCompleted?: boolean;
  resources: Resource[];
  description: string;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface CourseContent {
  courseId: string;
  modules: Module[];
}

const BASE_VIDEO = 'https://www.w3schools.com/html/mov_bbb.mp4';

export const mockCourseContent: CourseContent[] = [
  {
    courseId: 'c1',
    modules: [
      {
        id: 'm1',
        title: 'الوحدة الأولى: أسرار القصة',
        lessons: [
          {
            id: 'l1',
            title: 'مرحباً بك في أسرار القصة',
            duration: '05:30',
            videoUrl: BASE_VIDEO,
            isPreview: true,
            isCompleted: true,
            description: 'استكشف في هذا الدرس التمهيدي ما ستتعلمه خلال رحلتك الكاملة في عالم الكتابة الإبداعية.',
            resources: [
              { id: 'r1', title: 'دليل المتدرب الشامل', type: 'pdf', size: '2.4 MB' },
              { id: 'r2', title: 'قائمة الموارد التوصية', type: 'pdf', size: '1.1 MB' },
            ],
          },
          {
            id: 'l2',
            title: 'المكونات الأساسية للقصة',
            duration: '18:00',
            videoUrl: BASE_VIDEO,
            isPreview: false,
            isCompleted: true,
            description: 'تعرف على الركائز الأساسية التي تقوم عليها أي قصة ناجحة: الشخصية، الحدث، المكان، والصراع.',
            resources: [
              { id: 'r3', title: 'نموذج تحليل القصة', type: 'pdf', size: '0.8 MB' },
            ],
          },
          {
            id: 'l3',
            title: 'الصراع: قلب القصة النابض',
            duration: '22:15',
            videoUrl: BASE_VIDEO,
            isPreview: false,
            isCompleted: false,
            description: 'لا قصة بلا صراع. ادرس في هذا الدرس أنواع الصراع الداخلي والخارجي وكيف تبنيه بشكل درامي مشوق.',
            resources: [],
          },
        ],
      },
      {
        id: 'm2',
        title: 'الوحدة الثانية: رسم الشخصيات',
        lessons: [
          {
            id: 'l4',
            title: 'كيف تخلق شخصية حية ومقنعة',
            duration: '25:40',
            videoUrl: BASE_VIDEO,
            isPreview: false,
            isCompleted: false,
            description: 'الشخصية العميقة هي ما يجعل القارئ يتعلق بقصتك. تعلم كيف تمنح شخصياتك أبعاداً نفسية واجتماعية حقيقية.',
            resources: [
              { id: 'r4', title: 'ورقة عمل: تشريح الشخصية', type: 'pdf', size: '1.5 MB' },
              { id: 'r5', title: 'أمثلة شخصيات أدبية كبرى', type: 'pdf', size: '3.2 MB' },
            ],
          },
          {
            id: 'l5',
            title: 'الحوار: صوت شخصيتك',
            duration: '19:20',
            videoUrl: BASE_VIDEO,
            isPreview: false,
            isCompleted: false,
            description: 'الحوار الجيد يكشف الشخصية، يدفع الأحداث، ويُشعل التوتر الدرامي. تمرن على كتابة حوار طبيعي وهادف.',
            resources: [],
          },
        ],
      },
      {
        id: 'm3',
        title: 'الوحدة الثالثة: البناء السردي',
        lessons: [
          {
            id: 'l6',
            title: 'هيكل القوس الدرامي الكلاسيكي',
            duration: '30:00',
            videoUrl: BASE_VIDEO,
            isPreview: false,
            isCompleted: false,
            description: 'من أرسطو حتى اليوم، يظل القوس الدرامي الكلاسيكي أقوى أدوات بناء الرواية. ادرسه بعمق.',
            resources: [
              { id: 'r6', title: 'مخطط القوس الدرامي', type: 'pdf', size: '0.5 MB' },
            ],
          },
          {
            id: 'l7',
            title: 'تقنيات الإيقاع وضبط الوتيرة',
            duration: '21:10',
            videoUrl: BASE_VIDEO,
            isPreview: false,
            isCompleted: false,
            description: 'تعلم متى تسرع ومتى تُبطئ سرد أحداثك ليبقى القارئ شغوفاً حتى السطر الأخير.',
            resources: [],
          },
          {
            id: 'l8',
            title: 'المشهد الافتتاحي: كيف تصطاد قارئك',
            duration: '15:55',
            videoUrl: BASE_VIDEO,
            isPreview: false,
            isCompleted: false,
            description: 'المشهد الأول قرار النشر أو الرفض. تعلم كيف تكتب افتتاحية تشدّ القارئ من السطر الأول.',
            resources: [
              { id: 'r7', title: 'نماذج افتتاحيات روايات عالمية', type: 'zip', size: '4.0 MB' },
            ],
          },
        ],
      },
    ],
  },
  // Generic content reused for other courses
];

// Helper: get content for any course (use c1's structure as fallback)
export function getCourseContent(courseId: string): CourseContent {
  return (
    mockCourseContent.find(c => c.courseId === courseId) ?? {
      courseId,
      modules: mockCourseContent[0].modules,
    }
  );
}

// Flatten all lessons across modules
export function getFlatLessons(content: CourseContent): Lesson[] {
  return content.modules.flatMap(m => m.lessons);
}

export function getLessonById(content: CourseContent, lessonId: string): Lesson | undefined {
  return getFlatLessons(content).find(l => l.id === lessonId);
}
