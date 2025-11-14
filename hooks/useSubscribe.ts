"use client";

import { useState, useCallback } from "react";

type SubscribeResponse = {
  status: "success" | "error";
  message: string;
  data?: {
    subscriber: {
      id: string;
      email: string;
      createdAt?: string;
    };
  };
};

export function useSubscribe() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const subscribe = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result: SubscribeResponse = await res.json();

      if (!res.ok || result.status === "error") {
        throw new Error(result.message || "Gagal berlangganan");
      }

      setSuccess(true);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { subscribe, isLoading, error, success };
}

