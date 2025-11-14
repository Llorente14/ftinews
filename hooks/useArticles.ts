"use client";

import { useState, useCallback } from "react";

type Article = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content?: string;
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
  stats: {
    commentCount: number;
    bookmarkCount: number;
  };
};

type ArticlesResponse = {
  status: "success" | "error";
  message: string;
  data: {
    meta: {
      page: number;
      perPage: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
    items: Article[];
  };
};

type ArticleDetailResponse = {
  status: "success" | "error";
  message: string;
  data: {
    article: Article;
  };
};

type ArticlesFilters = {
  page?: number;
  perPage?: number;
  search?: string;
  category?: string;
  authorId?: string;
  publishedFrom?: string;
  publishedTo?: string;
  sort?: "newest" | "oldest" | "az" | "za";
};

export function useArticles(filters?: ArticlesFilters) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [meta, setMeta] = useState<ArticlesResponse["data"]["meta"] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = useCallback(async (newFilters?: ArticlesFilters) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      const activeFilters = newFilters || filters || {};

      if (activeFilters.page) params.set("page", activeFilters.page.toString());
      if (activeFilters.perPage) params.set("perPage", activeFilters.perPage.toString());
      if (activeFilters.search) params.set("search", activeFilters.search);
      if (activeFilters.category) params.set("category", activeFilters.category);
      if (activeFilters.authorId) params.set("authorId", activeFilters.authorId);
      if (activeFilters.publishedFrom) params.set("publishedFrom", activeFilters.publishedFrom);
      if (activeFilters.publishedTo) params.set("publishedTo", activeFilters.publishedTo);
      if (activeFilters.sort) params.set("sort", activeFilters.sort);

      const res = await fetch(`/api/articles?${params.toString()}`);
      const result: ArticlesResponse = await res.json();

      if (!res.ok || result.status === "error") {
        throw new Error(result.message || "Gagal mengambil artikel");
      }

      setArticles(result.data.items);
      setMeta(result.data.meta);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  return { articles, meta, fetchArticles, isLoading, error };
}

export function useArticle(slug: string) {
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArticle = useCallback(async () => {
    if (!slug) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/articles/${slug}`);
      const result: ArticleDetailResponse = await res.json();

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
  }, [slug]);

  return { article, fetchArticle, isLoading, error };
}

