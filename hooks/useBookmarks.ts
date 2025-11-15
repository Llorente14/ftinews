"use client";

import { useState, useCallback, useEffect } from "react";

type Bookmark = {
  id: string;
  articleId: string;
  createdAt: string;
  article: {
    id: string;
    slug: string;
    title: string;
    description: string;
    imageUrl: string | null;
    publishedAt: string;
    author: {
      id: string;
      namaLengkap: string;
    } | null;
    stats: {
      commentCount: number;
      bookmarkCount: number;
    };
  } | null;
};

type BookmarksResponse = {
  status: "success" | "error";
  message: string;
  data: {
    items: Bookmark[];
    count: number;
  };
};

type BookmarkResponse = {
  status: "success" | "error";
  message: string;
  data: {
    bookmark: Bookmark;
  };
};

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookmarks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/bookmarks", {
        credentials: "include",
      });
      const result: BookmarksResponse = await res.json();

      if (!res.ok || result.status === "error") {
        throw new Error(result.message || "Gagal mengambil bookmark");
      }

      setBookmarks(result.data.items);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  return { bookmarks, fetchBookmarks, isLoading, error };
}

export function useAddBookmark() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addBookmark = useCallback(async (articleId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId }),
        credentials: "include",
      });

      const result: BookmarkResponse = await res.json();

      if (!res.ok || result.status === "error") {
        throw new Error(result.message || "Gagal menambah bookmark");
      }

      return result.data.bookmark;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { addBookmark, isLoading, error };
}

export function useDeleteBookmark() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteBookmark = useCallback(async (bookmarkId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/bookmarks/${bookmarkId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result: { status: "success" | "error"; message: string } = await res.json();

      if (!res.ok || result.status === "error") {
        throw new Error(result.message || "Gagal menghapus bookmark");
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

  return { deleteBookmark, isLoading, error };
}

