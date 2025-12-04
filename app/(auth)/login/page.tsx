"use client";

import { useState } from "react";
import { useLogin } from "@/hooks/useAuth";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./login.module.css";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  const { login, isLoading, error } = useLogin();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData);
    } catch {
      // Error sudah di-handle di hook
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Logo/Header */}
        <div className={styles.header}>
          <Link href="/" className={styles.logoLink}>
            <h1 className={styles.logo}>FTI News</h1>
            <p className={styles.tagline}>Portal Berita Teknologi Informasi</p>
          </Link>
        </div>

        {/* Login Card */}
        <div className={styles.card}>
          <h2 className={styles.title}>Masuk ke Akun</h2>

          {/* Success Message */}
          {registered && (
            <div className={styles.successMessage}>
              Registrasi berhasil! Silakan login dengan akun Anda.
            </div>
          )}

          {/* Error Message */}
          {error && <div className={styles.errorMessage}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={styles.input}
                placeholder="nama@email.com"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className={styles.input}
                placeholder="••••••••"
              />
            </div>

            <div className={styles.forgotPassword}>
              <Link href="/lupa-password" className={styles.forgotLink}>
                Lupa password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={styles.submitButton}
            >
              {isLoading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <div className={styles.registerLink}>
            Belum punya akun?{" "}
            <Link href="/registrasi" className={styles.registerLinkText}>
              Daftar sekarang
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <p>© {new Date().getFullYear()} FTI News. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
