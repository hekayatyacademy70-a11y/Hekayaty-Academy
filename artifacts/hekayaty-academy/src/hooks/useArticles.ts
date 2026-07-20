import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Article, ArticleCategory } from "../types/article";

const API_BASE = "/api";

async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "An error occurred");
  }
  return res.json();
}

export function useGetCategories() {
  return useQuery<ArticleCategory[]>({
    queryKey: ["articles", "categories"],
    queryFn: () => fetcher(`${API_BASE}/articles/categories`)
  });
}

export function useGetPublishedArticles(params?: { limit?: number; offset?: number; categorySlug?: string; search?: string }) {
  return useQuery<{ articles: Article[]; total: number }>({
    queryKey: ["articles", "published", params],
    queryFn: () => {
      const query = new URLSearchParams();
      if (params?.limit) query.set("limit", params.limit.toString());
      if (params?.offset) query.set("offset", params.offset.toString());
      if (params?.categorySlug) query.set("category", params.categorySlug);
      if (params?.search) query.set("search", params.search);
      return fetcher(`${API_BASE}/articles?${query.toString()}`);
    }
  });
}

export function useGetArticle(slug: string) {
  return useQuery<Article>({
    queryKey: ["articles", "slug", slug],
    queryFn: () => fetcher(`${API_BASE}/articles/${slug}`),
    enabled: !!slug
  });
}

// Admin hooks
export function useGetAdminArticles(limit = 50, offset = 0) {
  return useQuery<{ articles: Article[]; total: number }>({
    queryKey: ["admin", "articles", { limit, offset }],
    queryFn: () => fetcher(`${API_BASE}/admin/articles?limit=${limit}&offset=${offset}`)
  });
}

export function useUpdateArticleStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      fetcher(`${API_BASE}/admin/articles/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "articles"] });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    }
  });
}

// Instructor hooks
export function useGetInstructorArticles() {
  return useQuery<Article[]>({
    queryKey: ["instructor", "articles"],
    queryFn: () => fetcher(`${API_BASE}/instructors/me/articles`)
  });
}

export function useCreateInstructorArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Article>) => 
      fetcher(`${API_BASE}/instructors/me/articles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructor", "articles"] });
    }
  });
}

export function useSubmitInstructorArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => 
      fetcher(`${API_BASE}/instructors/me/articles/${id}/submit`, {
        method: "PUT"
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructor", "articles"] });
    }
  });
}
