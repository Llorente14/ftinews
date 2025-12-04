"use client";

import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";

// Tipe data (tetap sama)
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

// ============================================
// HOOK: useRegister (Tidak Berubah)
// ============================================
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

// ============================================
// HOOK: useLogin (Tidak Berubah)
// ============================================
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

// ============================================
// HOOK: useLogout (Tidak Berubah)
// ============================================
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

// ============================================
// HOOK: useForgotPassword (DIUBAH)
// ============================================
export function useForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); 

  const sendResetLink = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/lupa-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result: ApiResponse<unknown> = await res.json();
      if (!res.ok || result.status === "error") {
        throw new Error(result.message || "Gagal mengirim kode reset");
      }
      
      // DIUBAH: Hapus '/auth' dari path
      router.push(`/verify-token?email=${encodeURIComponent(email)}`);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  return { sendResetLink, isLoading, error };
}

// ============================================
// HOOK: useResendCode (Tidak Berubah)
// ============================================
export function useResendCode() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const resendCode = async (email: string) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const res = await fetch("/api/auth/lupa-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result: ApiResponse<unknown> = await res.json();
      if (!res.ok || result.status === "error") {
        throw new Error(result.message || "Gagal mengirim kode");
      }
      setSuccessMessage("Kode baru telah dikirim.");
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  return { resendCode, isLoading, error, successMessage };
}

// ============================================
// HOOK: useVerifyToken (DIUBAH)
// ============================================
export function useVerifyToken() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const verifyToken = async (data: { email: string; token: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/verify-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result: ApiResponse<unknown> = await res.json();
      if (!res.ok || result.status === "error") {
        throw new Error(result.message || "Token tidak valid");
      }
      
      // DIUBAH: Hapus '/auth' dari path
      router.push(
        `/new-password?email=${encodeURIComponent(
          data.email
        )}&token=${encodeURIComponent(data.token)}`
      );
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  return { verifyToken, isLoading, error };
}

// ============================================
// HOOK: useResetPassword (Tidak Berubah)
// ============================================
type ResetPasswordData = {
  email: string;
  token: string;
  password: string;
};

export function useResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const resetPassword = async (data: ResetPasswordData) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result: ApiResponse<unknown> = await res.json();
      if (!res.ok || result.status === "error") {
        throw new Error(result.message || "Gagal mereset password");
      }
      router.push("/login?resetSuccess=true");
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  return { resetPassword, isLoading, error };
}