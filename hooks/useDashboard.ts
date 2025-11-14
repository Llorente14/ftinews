"use client";

import { useState, useCallback } from "react";

type Article = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string | null;
  sourceLink: string | null;
  category: string | null;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    namaLengkap: string;
    email: string;
    role: string;
  } | null;
  _count: {
    bookmarks: number;
    comments: number;
  };
};

type ArticlesResponse = {
  status: "success" | "error";
  message: string;
  data: {
    articles: Article[];
  };
};

type ArticleResponse = {
  status: "success" | "error";
  message: string;
  data: {
    article: Article;
  };
};

type CreateArticleData = {
  title: string;
  description: string;
  content: string;
  imageUrl?: string | null;
  sourceLink?: string | null;
  category?: string | null;
  publishedAt?: string;
  slug?: string;
  authorId?: string; // Only for ADMIN
};

type UpdateArticleData = {
  title?: string;
  description?: string;
  content?: string;
  imageUrl?: string | null;
  sourceLink?: string | null;
  category?: string | null;
  publishedAt?: string;
  slug?: string;
};

type DashboardFilters = {
  search?: string;
  category?: string;
};

export function useDashboardArticles(filters?: DashboardFilters) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = useCallback(async (newFilters?: DashboardFilters) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      const activeFilters = newFilters || filters || {};

      if (activeFilters.search) params.set("search", activeFilters.search);
      if (activeFilters.category) params.set("category", activeFilters.category);

      const res = await fetch(`/api/dashboard/articles?${params.toString()}`);
      const result: ArticlesResponse = await res.json();

      if (!res.ok || result.status === "error") {
        throw new Error(result.message || "Gagal mengambil artikel");
      }

      setArticles(result.data.articles);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  return { articles, fetchArticles, isLoading, error };
}

export function useDashboardArticle(articleId?: string) {
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArticle = useCallback(async (targetArticleId?: string) => {
    const id = targetArticleId || articleId;
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/dashboard/articles/${id}`);
      const result: ArticleResponse = await res.json();

      if (!res.ok || result.status === "error") {
        throw new Error(result.message || "Artikel tidak ditemukan");
      }

      setArticle(result.data.article);
      return result.data.article;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [articleId]);

  return { article, fetchArticle, isLoading, error };
}

export function useCreateArticle() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createArticle = useCallback(async (data: CreateArticleData) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/dashboard/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result: ArticleResponse = await res.json();

      if (!res.ok || result.status === "error") {
        throw new Error(result.message || "Gagal membuat artikel");
      }

      return result.data.article;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { createArticle, isLoading, error };
}

export function useUpdateArticle() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateArticle = useCallback(async (articleId: string, data: UpdateArticleData) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/dashboard/articles/${articleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result: ArticleResponse = await res.json();

      if (!res.ok || result.status === "error") {
        throw new Error(result.message || "Gagal memperbarui artikel");
      }

      return result.data.article;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { updateArticle, isLoading, error };
}

export function useDeleteArticle() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteArticle = useCallback(async (articleId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/dashboard/articles/${articleId}`, {
        method: "DELETE",
      });

      const result: { status: "success" | "error"; message: string } = await res.json();

      if (!res.ok || result.status === "error") {
        throw new Error(result.message || "Gagal menghapus artikel");
      }

      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { deleteArticle, isLoading, error };
}

