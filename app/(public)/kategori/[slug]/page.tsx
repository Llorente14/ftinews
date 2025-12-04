"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import HomeHeader from "@/components/home/HomeHeader";
import Footer from "@/components/layout/Footer";
import { useArticles } from "@/hooks/useArticles";
import { useCategories } from "@/hooks/useCategories";
import {
  useBookmarks,
  useAddBookmark,
  useDeleteBookmark,
} from "@/hooks/useBookmarks";
import Link from "next/link";
import Image from "next/image";
import styles from "../homepage.module.css";

type CategoryPageProps = {
  params: { slug: string };
};

export default function CategoryPage({ params }: CategoryPageProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const categoryName = decodeURIComponent(params.slug);

  const { articles, fetchArticles, isLoading } = useArticles({
    perPage: 10,
    sort: "newest",
    category: categoryName,
  });

  const { categories } = useCategories();

  const { bookmarks, fetchBookmarks } = useBookmarks();
  const { addBookmark, isLoading: isAddingBookmark } = useAddBookmark();
  const { deleteBookmark, isLoading: isDeletingBookmark } = useDeleteBookmark();

  useEffect(() => {
    fetchArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryName]);

  useEffect(() => {
    if (session) {
      fetchBookmarks().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const isArticleBookmarked = (articleId: string) =>
    bookmarks.some((bookmark) => bookmark.articleId === articleId);

  const handleBookmarkToggle = async (
    e: React.MouseEvent,
    articleId: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      window.location.href = "/login";
      return;
    }

    const bookmarked = isArticleBookmarked(articleId);

    try {
      if (bookmarked) {
        const bookmark = bookmarks.find((b) => b.articleId === articleId);
        if (bookmark) {
          await deleteBookmark(bookmark.id);
        }
      } else {
        await addBookmark(articleId);
      }
      await fetchBookmarks();
    } catch {
      // Silent for now, same as homepage
    }
  };

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
    <div className={styles.container}>
      <HomeHeader
        session={session ?? null}
        categories={categories}
        currentPath={pathname}
        currentDate={currentDate}
      />

      <main className={styles.main}>
        <section className={styles.latestSection}>
          <h2 className={styles.sectionTitle}>
            Kategori: {categoryName.toUpperCase()}
          </h2>

          {isLoading && articles.length === 0 ? (
            <div className={styles.highlightsLoading}>
              <p>Loading articles...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className={styles.highlightsEmpty}>
              <p>Belum ada artikel untuk kategori ini.</p>
            </div>
          ) : (
            <div className={styles.highlightsGrid}>
              {articles.map((article) => {
                const bookmarked = isArticleBookmarked(article.id);
                return (
                  <Link
                    key={article.id}
                    href={`/artikel/${article.slug}`}
                    className={styles.highlightCard}
                  >
                    <div className={styles.highlightCardImageWrapper}>
                      <Image
                        src={article.imageUrl || "/placeholder.jpg"}
                        alt={article.title}
                        fill
                        className={styles.highlightCardImage}
                        style={{ objectFit: "cover" }}
                        unoptimized
                      />
                      <span className={styles.highlightCardCategory}>
                        {article.category?.toUpperCase() || "NEWS"}
                      </span>
                    </div>
                    <div className={styles.highlightCardContent}>
                      <h3 className={styles.highlightCardTitle}>
                        {article.title}
                      </h3>
                      <div className={styles.highlightCardMeta}>
                        <span className={styles.highlightCardAuthor}>
                          By{" "}
                          {article.author ? (
                            <Link
                              href={`/penulis/${article.author.id}`}
                              className={styles.highlightCardAuthorLink}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {article.author.namaLengkap}
                            </Link>
                          ) : (
                            "Admin"
                          )}
                        </span>
                        <span className={styles.highlightCardDot}>•</span>
                        <span className={styles.highlightCardDate}>
                          {new Date(article.publishedAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </span>
                        <button
                          className={`${styles.bookmarkButton} ${
                            styles.bookmarkButtonHighlight
                          } ${
                            bookmarked ? styles.bookmarkButtonActive : ""
                          }`}
                          onClick={(e) => handleBookmarkToggle(e, article.id)}
                          aria-label={
                            bookmarked ? "Hapus bookmark" : "Tambah bookmark"
                          }
                          disabled={isAddingBookmark || isDeletingBookmark}
                        >
                          <i
                            className={`bx ${
                              bookmarked ? "bxs-bookmark" : "bx-bookmark"
                            }`}
                          ></i>
                        </button>
                      </div>
                      <p className={styles.highlightCardDescription}>
                        {article.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}


