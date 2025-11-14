"use client";

import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";

type User = {
  id: string;
  namaLengkap: string;
  email: string;
  nomorHandphone: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

type ProfileResponse = {
  status: "success" | "error";
  message: string;
  data: {
    user: User;
  };
};

type UpdateProfileData = {
  namaLengkap?: string;
  nomorHandphone?: string;
  password?: string;
};

export function useProfile() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!session) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/users/me");
      const result: ProfileResponse = await res.json();

      if (!res.ok || result.status === "error") {
        throw new Error(result.message || "Gagal mengambil profil");
      }

      setProfile(result.data.user);
      return result.data.user;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      fetchProfile();
    }
  }, [session, fetchProfile]);

  return { profile, fetchProfile, isLoading, error };
}

export function useUpdateProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = useCallback(async (data: UpdateProfileData) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result: ProfileResponse = await res.json();

      if (!res.ok || result.status === "error") {
        throw new Error(result.message || "Gagal memperbarui profil");
      }

      return result.data.user;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { updateProfile, isLoading, error };
}

export function usePublicProfile() {
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPublicProfile = useCallback(async (userId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/users/${userId}`);
      const result: ProfileResponse = await res.json();

      if (!res.ok || result.status === "error") {
        throw new Error(result.message || "User tidak ditemukan");
      }

      setProfile(result.data.user);
      return result.data.user;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { profile, fetchPublicProfile, isLoading, error };
}

