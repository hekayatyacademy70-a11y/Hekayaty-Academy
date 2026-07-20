import { supabase } from "../lib/supabase";

export class WorkspaceService {
  async getMyManuscripts(authorId: string) {
    const { data, error } = await supabase
      .from("manuscripts")
      .select("*")
      .eq("author_id", authorId)
      .order("created_at", { ascending: true });

    if (error) throw new Error(`Failed to get manuscripts: ${error.message}`);
    return (data || []).map(this.mapManuscript);
  }

  async createManuscript(authorId: string, title: string, genre: string) {
    const { data: manuscript, error } = await supabase
      .from("manuscripts")
      .insert({
        author_id: authorId,
        title,
        genre,
        status: "draft",
      })
      .select()
      .single();

    if (error || !manuscript) throw new Error(`Failed to create manuscript: ${error?.message}`);

    // Create default first chapter
    await supabase.from("chapters").insert({
      manuscript_id: manuscript.id,
      title: "الفصل الأول",
      order: 1,
    });

    return this.mapManuscript(manuscript);
  }

  async getManuscriptDetails(manuscriptId: string, authorId: string) {
    const { data: manuscript, error } = await supabase
      .from("manuscripts")
      .select("*")
      .eq("id", manuscriptId)
      .eq("author_id", authorId)
      .single();

    if (error || !manuscript) throw new Error("Manuscript not found");

    const { data: chapters } = await supabase
      .from("chapters")
      .select("*")
      .eq("manuscript_id", manuscriptId)
      .order("order");

    return {
      ...this.mapManuscript(manuscript),
      chapters: (chapters || []).map(this.mapChapter),
    };
  }

  async updateManuscript(
    manuscriptId: string,
    authorId: string,
    data: { title?: string; synopsis?: string; targetWordCount?: number }
  ) {
    const { data: updated, error } = await supabase
      .from("manuscripts")
      .update({
        ...(data.title && { title: data.title }),
        ...(data.synopsis && { synopsis: data.synopsis }),
        ...(data.targetWordCount && { target_word_count: data.targetWordCount }),
        updated_at: new Date().toISOString(),
      })
      .eq("id", manuscriptId)
      .eq("author_id", authorId)
      .select()
      .single();

    if (error || !updated) throw new Error("Manuscript not found");
    return this.mapManuscript(updated);
  }

  async createChapter(manuscriptId: string, authorId: string, title: string) {
    // Verify ownership
    const { data: manuscript } = await supabase
      .from("manuscripts")
      .select("id")
      .eq("id", manuscriptId)
      .eq("author_id", authorId)
      .single();

    if (!manuscript) throw new Error("Manuscript not found");

    const { count } = await supabase
      .from("chapters")
      .select("*", { count: "exact", head: true })
      .eq("manuscript_id", manuscriptId);

    const { data: chapter, error } = await supabase
      .from("chapters")
      .insert({
        manuscript_id: manuscriptId,
        title,
        order: (count ?? 0) + 1,
      })
      .select()
      .single();

    if (error || !chapter) throw new Error(`Failed to create chapter: ${error?.message}`);
    return this.mapChapter(chapter);
  }

  async updateChapterContent(
    chapterId: string,
    authorId: string,
    data: { title?: string; content?: string; wordCount?: number }
  ) {
    // Verify ownership via join
    const { data: chapterData } = await supabase
      .from("chapters")
      .select(`id, manuscripts!inner(author_id)`)
      .eq("id", chapterId)
      .eq("manuscripts.author_id", authorId)
      .single();

    if (!chapterData) throw new Error("Chapter not found");

    const { data: updated, error } = await supabase
      .from("chapters")
      .update({
        ...(data.title && { title: data.title }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.wordCount !== undefined && { word_count: data.wordCount }),
        updated_at: new Date().toISOString(),
      })
      .eq("id", chapterId)
      .select()
      .single();

    if (error || !updated) throw new Error(`Failed to update chapter: ${error?.message}`);
    return this.mapChapter(updated);
  }

  private mapManuscript(m: any) {
    return {
      id: m.id,
      authorId: m.author_id,
      title: m.title,
      synopsis: m.synopsis,
      genre: m.genre,
      status: m.status,
      targetWordCount: m.target_word_count,
      isPublic: m.is_public,
      coverImageUrl: m.cover_image_url,
      createdAt: m.created_at,
      updatedAt: m.updated_at,
    };
  }

  private mapChapter(c: any) {
    return {
      id: c.id,
      manuscriptId: c.manuscript_id,
      title: c.title,
      content: c.content,
      wordCount: c.word_count,
      order: c.order,
      createdAt: c.created_at,
      updatedAt: c.updated_at,
    };
  }
}
