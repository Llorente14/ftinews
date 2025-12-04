"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";

import styles from "@/app/(public)/homepage.module.css";

export default function PublicHeader() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentDate = (() => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("id-ID", options);
  })();

  return (
    <header className={styles.header}>
      <div className={styles.headerTop}>
        <div className={styles.headerTopContent}>
          <div className={styles.headerTopLeft}>
            <Link href="/" className={styles.logoLink}>
              <h1 className={styles.logo}>FTI News</h1>
            </Link>
            <span className={styles.date}>{currentDate}</span>
          </div>
          <div className={styles.headerTopRight}>
            <Link
              href={session ? "/profile" : "/login"}
              className={styles.headerLink}
            >
              {session?.user?.name || "Login"}
            </Link>
            <Link href="/cari" className={styles.searchBox}>
              <span className={styles.searchIcon}>
                <i className="bx bx-search"></i>
              </span>
              <input
                type="text"
                placeholder="Search..."
                readOnly
                className={styles.searchInput}
              />
            </Link>
            <button
              className={styles.mobileMenuButton}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <i className={`bx ${isMobileMenuOpen ? "bx-x" : "bx-menu"}`}></i>
            </button>
          </div>
        </div>
      </div>

      <nav
        className={`${styles.nav} ${isMobileMenuOpen ? styles.navOpen : ""}`}
      >
        <div className={styles.navContent}>
          <div className={styles.navLinks}>
            <Link
              href="/"
              className={styles.navLink}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/artikel"
              className={styles.navLink}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              News
            </Link>
            {session && (
              <Link
                href="/profile"
                className={styles.navLink}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </Link>
            )}
            <Link
              href="/kontak"
              className={styles.navLink}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Kontak
            </Link>
            <Link
              href="/tentang-kami"
              className={styles.navLink}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tentang Kami
            </Link>
          </div>
        </div>
      </nav>
      <div className={styles.navDivider}></div>
    </header>
  );
}


