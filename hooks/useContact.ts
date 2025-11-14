"use client";

import { useState, useCallback } from "react";

type ContactData = {
  nama: string;
  email: string;
  subjek: string;
  isiPesan: string;
};

type ContactResponse = {
  success: boolean;
  message?: string;
  data?: {
    contact: {
      id: string;
      nama: string;
      email: string;
      subjek: string;
      isiPesan: string;
      createdAt: string;
    };
  };
  error?: {
    code: string;
    message: string;
  };
};

export function useContact() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitContact = useCallback(async (data: ContactData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result: ContactResponse = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error?.message || result.message || "Gagal mengirim pesan");
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

  return { submitContact, isLoading, error, success };
}

