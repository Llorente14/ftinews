"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "@/app/(public)/homepage.module.css";
import { useRouter } from "next/navigation";

export type HighlightCardArticle = {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string | null;
  category: string | null;
  publishedAt: string;
  author: {
    id: string;
    namaLengkap: string;
  } | null;
};

type HighlightCardProps = {
  article: HighlightCardArticle;
  isBookmarked: boolean;
  onToggleBookmark: (e: React.MouseEvent, articleId: string) => void;
  disabled?: boolean;
};

export default function HighlightCard({
  article,
  isBookmarked,
  onToggleBookmark,
  disabled,
}: HighlightCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/artikel/${article.slug}`);
  };
  return (
    <div
      className={styles.highlightCard}
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
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
        <h3 className={styles.highlightCardTitle}>{article.title}</h3>
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
            {new Date(article.publishedAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          <button
            className={`${styles.bookmarkButton} ${
              styles.bookmarkButtonHighlight
            } ${isBookmarked ? styles.bookmarkButtonActive : ""}`}
            onClick={(e) => onToggleBookmark(e, article.id)}
            aria-label={isBookmarked ? "Hapus bookmark" : "Tambah bookmark"}
            disabled={disabled}
          >
            <i
              className={`bx ${isBookmarked ? "bxs-bookmark" : "bx-bookmark"}`}
            ></i>
          </button>
        </div>
        <p className={styles.highlightCardDescription}>{article.description}</p>
      </div>
    </div>
  );
}
