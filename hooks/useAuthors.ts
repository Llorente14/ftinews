"use client";

import { useState, useCallback, useEffect } from "react";

type Author = {
  id: string;
  namaLengkap: string;
  email: string;
  role: string;
  articleCount: number;
};

type AuthorsResponse = {
  status: "success" | "error";
  message: string;
  data: {
    authors: Author[];
  };
};

export function useAuthors() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAuthors = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/authors");
      const result: AuthorsResponse = await res.json();

      if (!res.ok || result.status === "error") {
        throw new Error(result.message || "Gagal mengambil daftar author");
      }

      setAuthors(result.data.authors);
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
    fetchAuthors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { authors, fetchAuthors, isLoading, error };
}

