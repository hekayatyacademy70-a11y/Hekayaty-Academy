import { supabase } from "../lib/supabase";

export class ArticlesService {
  // ─── PUBLIC METHODS ───

  async getPublishedArticles({ limit = 10, offset = 0, categorySlug, search }: { limit?: number; offset?: number; categorySlug?: string; search?: string }) {
    let query = supabase
      .from("articles")
      .select(`
        *,
        author:users(id, name, avatar_url),
        category:article_categories(id, name, slug)
      `, { count: "exact" })
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (categorySlug) {
      // First get category ID
      const { data: cat } = await supabase.from("article_categories").select("id").eq("slug", categorySlug).single();
      if (cat) query = query.eq("category_id", cat.id);
    }

    if (search) {
      query = query.ilike("title", `%${search}%`); // Basic search, can be expanded to full-text search
    }

    const { data, count, error } = await query;
    if (error) throw error;

    return { articles: data, total: count };
  }

  async getArticleBySlug(slug: string) {
    const { data, error } = await supabase
      .from("articles")
      .select(`
        *,
        author:users(id, name, avatar_url),
        category:article_categories(id, name, slug)
      `)
      .eq("slug", slug)
      .single();

    if (error) throw error;
    
    // Increment views (fire and forget)
    if (data) {
      supabase.rpc('increment_article_views', { article_id: data.id }).then();
    }

    return data;
  }

  async getCategories() {
    const { data, error } = await supabase.from("article_categories").select("*").order("name");
    if (error) throw error;
    return data;
  }

  async getArticleById(id: string) {
    const { data, error } = await supabase.from("articles").select("*").eq("id", id).single();
    if (error) throw error;
    return data;
  }

  // ─── ADMIN METHODS ───

  async getAllArticles(limit = 50, offset = 0) {
    const { data, count, error } = await supabase
      .from("articles")
      .select(`
        id, title, slug, status, featured, created_at, published_at,
        author:users(name),
        category:article_categories(name)
      `, { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { articles: data, total: count };
  }

  async updateArticleStatus(id: string, status: string) {
    const updateData: any = { status };
    if (status === "published") {
      updateData.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("articles")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteArticle(id: string) {
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) throw error;
    return true;
  }

  // ─── INSTRUCTOR METHODS ───

  async getInstructorArticles(instructorId: string) {
    const { data, error } = await supabase
      .from("articles")
      .select("id, title, slug, status, created_at, published_at, views, category:article_categories(name)")
      .eq("author_id", instructorId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  // ─── SHARED (ADMIN & INSTRUCTOR) ───

  async createArticle(articleData: any) {
    const { data, error } = await supabase
      .from("articles")
      .insert([articleData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateArticle(id: string, authorId: string, authorRole: string, updateData: any) {
    let query = supabase.from("articles").update(updateData).eq("id", id);
    
    // If not admin, verify ownership
    if (authorRole !== "admin" && authorRole !== "superadmin") {
      query = query.eq("author_id", authorId);
    }

    const { data, error } = await query.select().single();
    if (error) throw error;
    return data;
  }
}
