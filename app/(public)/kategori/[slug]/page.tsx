"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
//import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import styles from "./category.module.css";

interface Article {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  category: string;
  publishedAt: string;
  author: {
    id: string;
    namaLengkap: string;
  } | null;
}

export default function CategoryPage() {
  const searchParams = useSearchParams();
  const categoryName = searchParams.get("category") || "Technology";
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [sortBy, setSortBy] = useState("newest");
  const articlesPerPage = 6;

  useEffect(() => {
    fetchArticles();
  }, [categoryName, currentPage, sortBy]);

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/articles?category=${categoryName}&page=${currentPage}&perPage=${articlesPerPage}&sort=${sortBy}`
      );
      const data = await response.json();
      
      if (data.success) {
        setArticles(data.data);
        setTotalPages(Math.ceil(data.pagination.total / articlesPerPage));
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisible = 5;

    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${styles.paginationButton} ${
          currentPage === 1 ? styles.disabled : ""
        }`}
      >
        <i className="bx bx-chevron-left"></i>
      </button>
    );

    // First page
    if (currentPage > 3) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={styles.paginationButton}
        >
          1
        </button>
      );
      if (currentPage > 4) {
        buttons.push(
          <span key="dots1" className={styles.paginationDots}>
            ...
          </span>
        );
      }
    }

    // Middle pages
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, currentPage + 1);

    for (let i = start; i <= end; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`${styles.paginationButton} ${
            currentPage === i ? styles.active : ""
          }`}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (currentPage < totalPages - 2) {
      if (currentPage < totalPages - 3) {
        buttons.push(
          <span key="dots2" className={styles.paginationDots}>
            ...
          </span>
        );
      }
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={styles.paginationButton}
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${styles.paginationButton} ${
          currentPage === totalPages ? styles.disabled : ""
        }`}
      >
        <i className="bx bx-chevron-right"></i>
      </button>
    );

    return buttons;
  };

  return (
    <div className={styles.container}>
      {/*<Navbar /> */ }

      <main className={styles.main}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>{categoryName}</h1>
          <p className={styles.subtitle}>
            Stay updated with the latest in the world of {categoryName.toLowerCase()}.
          </p>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <button className={styles.filterButton}>
              Date: Latest
              <i className="bx bx-chevron-down"></i>
            </button>
            <button className={styles.filterButton}>
              Popularity: Most Read
              <i className="bx bx-chevron-down"></i>
            </button>
            <button className={styles.filterButton}>
              Sub-categories: Tech
              <i className="bx bx-chevron-down"></i>
            </button>
          </div>
          <div className={styles.sortGroup}>
            <span className={styles.sortLabel}>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="newest">Title A-Z</option>
              <option value="oldest">Title Z-A</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        {/* Articles Grid */}
        {isLoading ? (
          <div className={styles.loading}>
            <p>Loading articles...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className={styles.empty}>
            <p>No articles found in this category.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/artikel/${article.slug}`}
                className={styles.card}
              >
                <div className={styles.cardImage}>
                  <Image
                    src={article.imageUrl || "/placeholder.jpg"}
                    alt={article.title}
                    fill
                    style={{ objectFit: "cover" }}
                    unoptimized
                  />
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{article.title}</h3>
                  <p className={styles.cardDescription}>
                    {article.description}
                  </p>
                  <div className={styles.cardFooter}>
                    <div className={styles.cardAuthor}>
                      <span className={styles.authorLabel}>
                        By {article.author?.namaLengkap || "Admin"}
                      </span>
                    </div>
                    <div className={styles.cardActions}>
                      <button
                        className={styles.actionButton}
                        onClick={(e) => {
                          e.preventDefault();
                          // Bookmark functionality
                        }}
                      >
                        <i className="bx bx-bookmark"></i>
                      </button>
                      <button
                        className={styles.actionButton}
                        onClick={(e) => {
                          e.preventDefault();
                          // Share functionality
                        }}
                      >
                        <i className="bx bx-share-alt"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && articles.length > 0 && (
          <div className={styles.pagination}>{renderPaginationButtons()}</div>
        )}
      </main>

      <Footer />
    </div>
  );
}