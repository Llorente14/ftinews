"use client";

import { useState, useCallback, useEffect } from "react";

type Category = {
  name: string;
  count: number;
};

type CategoriesResponse = {
  status: "success" | "error";
  message: string;
  data: {
    categories: Category[];
  };
};

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/categories");
      const result: CategoriesResponse = await res.json();

      if (!res.ok || result.status === "error") {
        throw new Error(result.message || "Gagal mengambil kategori");
      }

      setCategories(result.data.categories);
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
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { categories, fetchCategories, isLoading, error };
}

