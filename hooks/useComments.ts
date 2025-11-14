"use client";

import { useState, useCallback } from "react";

type Comment = {
  id: string;
  content: string;
  userId: string;
  articleId: string;
  createdAt: string;
  user: {
    id: string;
    namaLengkap: string;
    email: string;
    role: string;
  };
};

type CommentsResponse = {
  status: "success" | "error";
  message: string;
  data: {
    items: Comment[];
    count: number;
  };
};

type CommentResponse = {
  status: "success" | "error";
  message: string;
  data: {
    comment: Comment;
  };
};

export function useComments(articleId?: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async (targetArticleId?: string) => {
    const id = targetArticleId || articleId;
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/comments?articleId=${id}`);
      const result: CommentsResponse = await res.json();

      if (!res.ok || result.status === "error") {
        throw new Error(result.message || "Gagal mengambil komentar");
      }

      setComments(result.data.items);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [articleId]);

  return { comments, fetchComments, isLoading, error };
}

export function useAddComment() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addComment = useCallback(async (articleId: string, content: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, content }),
      });

      const result: CommentResponse = await res.json();

      if (!res.ok || result.status === "error") {
        throw new Error(result.message || "Gagal menambah komentar");
      }

      return result.data.comment;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { addComment, isLoading, error };
}

export function useUpdateComment() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateComment = useCallback(async (commentId: string, content: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      const result: CommentResponse = await res.json();

      if (!res.ok || result.status === "error") {
        throw new Error(result.message || "Gagal memperbarui komentar");
      }

      return result.data.comment;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { updateComment, isLoading, error };
}

export function useDeleteComment() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteComment = useCallback(async (commentId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      const result: { status: "success" | "error"; message: string } = await res.json();

      if (!res.ok || result.status === "error") {
        throw new Error(result.message || "Gagal menghapus komentar");
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

  return { deleteComment, isLoading, error };
}

