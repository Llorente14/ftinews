"use client";

import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type RegisterData = {
  namaLengkap: string;
  email: string;
  nomorHandphone: string;
  password: string;
};

type LoginData = {
  email: string;
  password: string;
};

type ApiResponse<T> = {
  status: "success" | "error";
  message: string;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
};

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result: ApiResponse<{ user: unknown }> = await res.json();

      if (!res.ok || result.status === "error") {
        throw new Error(result.message || "Registrasi gagal");
      }

      router.push("/login?registered=true");
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
}

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = async (data: LoginData, callbackUrl?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.push(callbackUrl || "/");
      router.refresh();
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login gagal";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}

export function useLogout() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut({ redirect: false });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { logout, isLoading };
}
