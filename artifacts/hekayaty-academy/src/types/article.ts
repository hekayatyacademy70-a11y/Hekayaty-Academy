export interface ArticleCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ArticleAuthor {
  id: string;
  name: string;
  avatar_url?: string | null;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image?: string | null;
  author_id: string;
  author_type: 'admin' | 'instructor';
  category_id: string;
  status: 'draft' | 'pending_review' | 'approved' | 'published' | 'archived';
  featured: boolean;
  views: number;
  reading_time: number;
  seo_title?: string | null;
  seo_description?: string | null;
  created_at: string;
  updated_at: string;
  published_at?: string | null;
  
  // Relations
  author?: ArticleAuthor;
  category?: ArticleCategory;
}
