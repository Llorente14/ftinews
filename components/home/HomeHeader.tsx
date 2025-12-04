"use client";

import { useState } from "react";
import type { Session } from "next-auth";
import Link from "next/link";
import { useCategories } from "@/hooks/useCategories";
import styles from "@/app/(public)/homepage.module.css";

type HomeHeaderProps = {
  session: Session | null;
  currentPath: string;
  currentDate: string;
};

export default function HomeHeader({
  session,
  currentPath,
  currentDate,
}: HomeHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const { categories } = useCategories();

  const segments = currentPath.split("/").filter(Boolean);
  const isKategoriRoute = segments[0] === "kategori";
  const activeCategoryName = isKategoriRoute
    ? decodeURIComponent(segments[1] ?? "")
    : null;

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => {
      const next = !prev;
      if (!next) {
        setIsCategoryDropdownOpen(false);
      }
      return next;
    });
  };

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
    setIsCategoryDropdownOpen(false);
  };

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
              onClick={handleToggleMobileMenu}
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
              className={`${styles.navLink} ${
                currentPath === "/" ? styles.navLinkActive : ""
              }`}
              onClick={handleNavClick}
            >
              Home
              {currentPath === "/" && (
                <span className={styles.navLinkSlider}></span>
              )}
            </Link>

            {/* Desktop: Show categories horizontally */}
            {categories.length > 0 && (
              <div className={styles.categoryLinks}>
                {categories.map((category) => {
                  const isActive =
                    isKategoriRoute && activeCategoryName === category.name;
                  return (
                    <Link
                      key={category.name}
                      href={`/kategori/${encodeURIComponent(category.name)}`}
                      className={`${styles.categoryLink} ${
                        isActive ? styles.categoryLinkActive : ""
                      }`}
                      onClick={handleNavClick}
                    >
                      {category.name}
                      {isActive && (
                        <span className={styles.categoryLinkSlider}></span>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Mobile: Show dropdown */}
            {categories.length > 0 && (
              <div className={styles.categoryDropdown}>
                <button
                  className={styles.categoryDropdownButton}
                  onClick={() => setIsCategoryDropdownOpen((prev) => !prev)}
                  aria-label="Toggle categories"
                >
                  <span>Kategori</span>
                  <i
                    className={`bx bx-chevron-down ${
                      isCategoryDropdownOpen ? styles.chevronOpen : ""
                    }`}
                  ></i>
                </button>
                {isCategoryDropdownOpen && (
                  <div className={styles.categoryDropdownContent}>
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        href={`/kategori/${encodeURIComponent(category.name)}`}
                        className={styles.categoryDropdownItem}
                        onClick={handleNavClick}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {session && (
              <Link
                href="/profile"
                className={`${styles.navLink} ${
                  currentPath === "/profile" ? styles.navLinkActive : ""
                }`}
                onClick={handleNavClick}
              >
                Profile
                {currentPath === "/profile" && (
                  <span className={styles.navLinkSlider}></span>
                )}
              </Link>
            )}
            <Link
              href="/kontak"
              className={`${styles.navLink} ${
                currentPath === "/kontak" ? styles.navLinkActive : ""
              }`}
              onClick={handleNavClick}
            >
              Kontak
              {currentPath === "/kontak" && (
                <span className={styles.navLinkSlider}></span>
              )}
            </Link>
            <Link
              href="/tentang-kami"
              className={`${styles.navLink} ${
                currentPath === "/tentang-kami" ? styles.navLinkActive : ""
              }`}
              onClick={handleNavClick}
            >
              Tentang Kami
              {currentPath === "/tentang-kami" && (
                <span className={styles.navLinkSlider}></span>
              )}
            </Link>
          </div>
        </div>
      </nav>
      <div className={styles.navDivider}></div>
    </header>
  );
}
