"use client";

import { useState, useCallback } from "react";

type User = {
  id: string;
  namaLengkap: string;
  email: string;
  nomorHandphone: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    articles: number;
    comments: number;
    bookmarks: number;
  };
};

type UsersResponse = {
  status: "success" | "error";
  message: string;
  data: {
    users: User[];
  };
};

type UserResponse = {
  status: "success" | "error";
  message: string;
  data: {
    user: User;
  };
};

type CreateUserData = {
  namaLengkap: string;
  email: string;
  nomorHandphone: string;
  password: string;
  role?: "USER" | "WRITER" | "ADMIN";
};

type UpdateUserData = {
  namaLengkap?: string;
  nomorHandphone?: string;
  role?: "USER" | "WRITER" | "ADMIN";
  password?: string;
};

export function useAdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/users");
      const result: UsersResponse = await res.json();

      if (!res.ok || result.status === "error") {
        throw new Error(result.message || "Gagal mengambil daftar user");
      }

      setUsers(result.data.users);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { users, fetchUsers, isLoading, error };
}

export function useAdminUser(userId?: string) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async (targetUserId?: string) => {
    const id = targetUserId || userId;
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/users/${id}`);
      const result: UserResponse = await res.json();

      if (!res.ok || result.status === "error") {
        throw new Error(result.message || "User tidak ditemukan");
      }

      setUser(result.data.user);
      return result.data.user;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  return { user, fetchUser, isLoading, error };
}

export function useCreateUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = useCallback(async (data: CreateUserData) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result: UserResponse = await res.json();

      if (!res.ok || result.status === "error") {
        throw new Error(result.message || "Gagal membuat user");
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

  return { createUser, isLoading, error };
}

export function useUpdateUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUser = useCallback(async (userId: string, data: UpdateUserData) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result: UserResponse = await res.json();

      if (!res.ok || result.status === "error") {
        throw new Error(result.message || "Gagal memperbarui user");
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

  return { updateUser, isLoading, error };
}

export function useDeleteUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteUser = useCallback(async (userId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      const result: { status: "success" | "error"; message: string } = await res.json();

      if (!res.ok || result.status === "error") {
        throw new Error(result.message || "Gagal menghapus user");
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

  return { deleteUser, isLoading, error };
}

