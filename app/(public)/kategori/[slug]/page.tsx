"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useArticles } from "@/hooks/useArticles";
import { useCategories } from "@/hooks/useCategories";
import { useAuthors } from "@/hooks/useAuthors";
import Footer from "@/components/layout/Footer";
import styles from "./kategori.module.css";

type Props = {
  params: Promise<{ slug: string }>;
};

// Tipe untuk sorting
type SortType = "newest" | "oldest" | "az" | "za";

// Tipe untuk dropdown state
type DropdownType = "date" | "author" | "sort" | null;

// Helper function untuk mengkonversi slug ke nama kategori
function slugToCategoryName(
  slug: string,
  categories: { name: string; count: number }[]
): string | null {
  if (!slug || categories.length === 0) return null;

  // Normalisasi slug: lowercase, replace dash dengan space
  const normalizedSlug = slug.toLowerCase().replace(/-/g, " ");

  // Cari kategori yang cocok (case-insensitive, handle dash/space)
  const matched = categories.find((cat) => {
    const normalizedName = cat.name.toLowerCase().replace(/-/g, " ");
    return (
      normalizedName === normalizedSlug ||
      normalizedName.replace(/\s+/g, "-") === slug.toLowerCase() ||
      cat.name.toLowerCase() === slug.toLowerCase()
    );
  });

  return matched ? matched.name : null;
}

export default function CategoryPage({ params }: Props) {
  // --- 1. SETUP SLUG & SESSION ---
  const { data: session } = useSession();
  const [slug, setSlug] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Ambil semua kategori untuk matching
  const { categories } = useCategories();
  // Ambil semua authors untuk filter
  const { authors } = useAuthors();

  useEffect(() => {
    const unwrapParams = async () => {
      const p = await params;
      setSlug(p.slug);
    };
    unwrapParams();
  }, [params]);

  // Konversi slug ke nama kategori yang benar menggunakan useMemo
  const categoryName = useMemo(() => {
    if (!slug || categories.length === 0) return null;
    const matched = slugToCategoryName(slug, categories);
    console.log("Slug:", slug, "→ Category:", matched);
    return matched;
  }, [slug, categories]);

  // --- 2. STATE DATA KATEGORI, SORTING & PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  // [BARU] State untuk menangani filter/sorting
  const [sortType, setSortType] = useState<SortType>("newest");
  // State untuk author yang dipilih
  const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(null);
  // State untuk dropdown yang terbuka
  const [openDropdown, setOpenDropdown] = useState<DropdownType>(null);

  const { articles, fetchArticles, isLoading, meta } = useArticles({
    page: currentPage,
    perPage: 6, // 6 item agar pas grid 3x2
    category: categoryName || undefined, // Gunakan nama kategori yang benar, bukan slug
    authorId: selectedAuthorId || undefined, // Filter berdasarkan author yang dipilih
    sort: sortType, // Menggunakan state sortType dinamis
  });

  // Refetch saat categoryName, page, sort, atau author berubah
  useEffect(() => {
    if (categoryName) {
      fetchArticles();
    }
    // Scroll ke atas setiap ganti halaman
    if (currentPage > 1) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [categoryName, currentPage, sortType, selectedAuthorId, fetchArticles]);

  // [BARU] Reset halaman ke 1 jika filter berubah
  const handleSortChange = (type: SortType) => {
    if (sortType !== type) {
      setSortType(type);
      setCurrentPage(1);
    }
    setOpenDropdown(null); // Tutup dropdown setelah memilih
  };

  // Handler untuk memilih author
  const handleAuthorChange = (authorId: string | null) => {
    if (selectedAuthorId !== authorId) {
      setSelectedAuthorId(authorId);
      setCurrentPage(1);
    }
    setOpenDropdown(null); // Tutup dropdown setelah memilih
  };

  // Toggle dropdown
  const toggleDropdown = (type: DropdownType) => {
    setOpenDropdown(openDropdown === type ? null : type);
  };

  // Close dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`.${styles.dropdownContainer}`)) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [openDropdown]);

  // --- 3. UTILS (TANGGAL & PAGINATION) ---
  const currentDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // [BARU] Helper untuk membuat nomor halaman dinamis (agar tidak stuck di 1-5)
  const getPaginationGroup = () => {
    if (!meta) return [];
    const total = meta.totalPages;
    const current = currentPage;
    const maxButtons = 5;

    // Logika geser pagination
    let start = Math.max(1, current - 2);
    const end = Math.min(total, start + maxButtons - 1);

    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className={styles.container}>
      {/* === HEADER (SAMA PERSIS HOMEPAGE) === */}
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerTopContent}>
            {/* KIRI: Logo + Meta info */}
            <div className={styles.headerTopLeft}>
              <Link href="/" className={styles.logoLink}>
                <h1 className={styles.logo}>FTI News</h1>
              </Link>
              <div className={styles.headerMeta}>
                <span className={styles.metaText}>{currentDate}</span>
                <span className={styles.metaDivider}>|</span>
                <div className={styles.metaWeather}>
                  <i className="bx bx-sun"></i>
                  <span>28°C</span>
                </div>
              </div>
            </div>

            {/* KANAN: User info + Actions */}
            <div className={styles.headerTopRight}>
              <div className={styles.accountLinks}>
                <Link
                  href={session ? "/profile" : "/login"}
                  className={styles.headerLink}
                >
                  {session?.user?.name || "Guest"}
                </Link>
                <span className={styles.metaDivider}>|</span>
                <button type="button" className={styles.languageButton}>
                  English
                </button>
              </div>

              <div className={styles.actionGroup}>
                <Link href="/cari" className={styles.actionGhost}>
                  <i className="bx bx-search"></i>
                  <span>Search</span>
                </Link>
                <Link
                  href={session ? "/profile" : "/login"}
                  className={styles.ctaButton}
                >
                  {session ? "Dashboard" : "Login"}
                </Link>
              </div>

              <button
                className={styles.mobileMenuButton}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle navigation"
              >
                <i
                  className={`bx ${isMobileMenuOpen ? "bx-x" : "bx-menu"}`}
                ></i>
              </button>
            </div>
          </div>
        </div>

        {/* NAVIGASI TENGAH */}
        <nav
          className={`${styles.nav} ${isMobileMenuOpen ? styles.navOpen : ""}`}
        >
          <div className={styles.navContent}>
            <div className={styles.navLinks}>
              <Link href="/" className={styles.navLink}>
                Home
              </Link>
              {/* Menu News aktif */}
              <Link href="#" className={styles.navLinkActive}>
                News
              </Link>
              {session && (
                <Link href="/profile" className={styles.navLink}>
                  Profile
                </Link>
              )}
              <Link href="/kontak" className={styles.navLink}>
                Kontak
              </Link>
              <Link href="/tentang-kami" className={styles.navLink}>
                Tentang Kami
              </Link>
            </div>
          </div>
        </nav>
        <div className={styles.navDivider}></div>
      </header>

      {/* === MAIN CONTENT === */}
      <main className={styles.main}>
        {/* Judul Kategori */}
        <section className={styles.categoryHeader}>
          <h1 className={styles.categoryTitle}>
            {categoryName || (slug ? slug.replace(/-/g, " ") : "Loading...")}
          </h1>
          <p className={styles.categoryDesc}>
            Berita terkini dan terpercaya seputar{" "}
            {categoryName || (slug ? slug.replace(/-/g, " ") : "...")}.
          </p>

          {/* Filters - [UPDATE: Dropdown Berfungsi] */}
          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              {/* Date Dropdown */}
              <div className={styles.dropdownContainer}>
                <button
                  className={`${styles.filterBtn} ${
                    sortType === "newest" || sortType === "oldest"
                      ? styles.filterBtnActive
                      : ""
                  }`}
                  onClick={() => toggleDropdown("date")}
                >
                  Date:{" "}
                  {sortType === "newest"
                    ? "Latest"
                    : sortType === "oldest"
                    ? "Oldest"
                    : "Latest"}
                  <i
                    className={`bx ${
                      openDropdown === "date"
                        ? "bx-chevron-up"
                        : "bx-chevron-down"
                    }`}
                    style={{
                      fontSize: "18px",
                      marginLeft: "6px",
                      verticalAlign: "middle",
                    }}
                  ></i>
                </button>
                {openDropdown === "date" && (
                  <div className={styles.dropdownMenu}>
                    <button
                      className={`${styles.dropdownItem} ${
                        sortType === "newest" ? styles.dropdownItemActive : ""
                      }`}
                      onClick={() => handleSortChange("newest")}
                    >
                      Latest
                    </button>
                    <button
                      className={`${styles.dropdownItem} ${
                        sortType === "oldest" ? styles.dropdownItemActive : ""
                      }`}
                      onClick={() => handleSortChange("oldest")}
                    >
                      Oldest
                    </button>
                  </div>
                )}
              </div>

              {/* Author Dropdown */}
              <div className={styles.dropdownContainer}>
                <button
                  className={`${styles.filterBtn} ${
                    selectedAuthorId ? styles.filterBtnActive : ""
                  }`}
                  onClick={() => toggleDropdown("author")}
                >
                  <span>
                    Author:{" "}
                    {selectedAuthorId
                      ? authors.find((a) => a.id === selectedAuthorId)
                          ?.namaLengkap || "All Authors"
                      : "All Authors"}
                  </span>
                  <i
                    className={`bx ${
                      openDropdown === "author"
                        ? "bx-chevron-up"
                        : "bx-chevron-down"
                    }`}
                    style={{
                      fontSize: "18px",
                      marginLeft: "6px",
                      verticalAlign: "middle",
                    }}
                  ></i>
                </button>
                {openDropdown === "author" && (
                  <div className={styles.dropdownMenu}>
                    <button
                      className={`${styles.dropdownItem} ${
                        !selectedAuthorId ? styles.dropdownItemActive : ""
                      }`}
                      onClick={() => handleAuthorChange(null)}
                    >
                      All Authors
                    </button>
                    {authors.length > 0 ? (
                      authors.map((author) => (
                        <button
                          key={author.id}
                          className={`${styles.dropdownItem} ${
                            selectedAuthorId === author.id
                              ? styles.dropdownItemActive
                              : ""
                          }`}
                          onClick={() => handleAuthorChange(author.id)}
                        >
                          {author.namaLengkap}
                          <span
                            style={{
                              fontSize: "12px",
                              opacity: 0.6,
                              marginLeft: "8px",
                            }}
                          >
                            ({author.articleCount})
                          </span>
                        </button>
                      ))
                    ) : (
                      <div
                        className={styles.dropdownItem}
                        style={{ opacity: 0.6 }}
                      >
                        No authors found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Sort by Dropdown */}
            <div className={styles.dropdownContainer}>
              <button
                className={`${styles.filterBtn} ${
                  sortType === "az" || sortType === "za"
                    ? styles.filterBtnActive
                    : ""
                }`}
                onClick={() => toggleDropdown("sort")}
              >
                Sort by:{" "}
                {sortType === "az" ? "A-Z" : sortType === "za" ? "Z-A" : "A-Z"}
                <i
                  className={`bx ${
                    openDropdown === "sort"
                      ? "bx-chevron-up"
                      : "bx-chevron-down"
                  }`}
                  style={{
                    fontSize: "18px",
                    marginLeft: "6px",
                    verticalAlign: "middle",
                  }}
                ></i>
              </button>
              {openDropdown === "sort" && (
                <div className={styles.dropdownMenu}>
                  <button
                    className={`${styles.dropdownItem} ${
                      sortType === "az" ? styles.dropdownItemActive : ""
                    }`}
                    onClick={() => handleSortChange("az")}
                  >
                    A-Z
                  </button>
                  <button
                    className={`${styles.dropdownItem} ${
                      sortType === "za" ? styles.dropdownItemActive : ""
                    }`}
                    onClick={() => handleSortChange("za")}
                  >
                    Z-A
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Grid Artikel */}
        {isLoading ? (
          <div className={styles.loadingContainer}>Loading articles...</div>
        ) : categoryName === null && slug ? (
          <div className={styles.emptyState}>
            Kategori &quot;{slug.replace(/-/g, " ")}&quot; tidak ditemukan.
          </div>
        ) : (
          <section className={styles.newsGrid}>
            {articles.length > 0 ? (
              articles.map((item) => (
                <Link
                  href={`/artikel/${item.slug}`}
                  key={item.id}
                  className={styles.newsCard}
                >
                  <div className={styles.cardImageWrapper}>
                    <Image
                      src={item.imageUrl || "/placeholder.jpg"}
                      alt={item.title}
                      fill
                      className={styles.cardImage}
                      style={{ objectFit: "cover" }}
                      unoptimized={true}
                    />
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                    <p className={styles.cardExcerpt}>
                      {item.description || "Klik untuk membaca selengkapnya..."}
                    </p>
                    <div className={styles.cardFooter}>
                      <span className={styles.cardSource}>
                        {item.author?.namaLengkap || "Redaksi"}
                      </span>
                      <i
                        className="bx bx-bookmark"
                        style={{ fontSize: "18px" }}
                      ></i>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className={styles.emptyState}>
                Belum ada berita di kategori ini.
              </div>
            )}
          </section>
        )}

        {/* Pagination - [UPDATE: Logic Dinamis] */}
        {meta && meta.totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => meta.hasPrevPage && setCurrentPage((p) => p - 1)}
              disabled={!meta.hasPrevPage}
              className={styles.pageBtn}
              style={{ opacity: meta.hasPrevPage ? 1 : 0.3 }}
            >
              &lt;
            </button>

            {/* Menggunakan helper getPaginationGroup agar halaman bisa bergeser */}
            {getPaginationGroup().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`${styles.pageBtn} ${
                  pageNum === currentPage ? styles.pageBtnActive : ""
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => meta.hasNextPage && setCurrentPage((p) => p + 1)}
              disabled={!meta.hasNextPage}
              className={styles.pageBtn}
              style={{ opacity: meta.hasNextPage ? 1 : 0.3 }}
            >
              &gt;
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
