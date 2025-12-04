"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "@/app/(public)/homepage.module.css";

export type SponsoredCardArticle = {
  id: string;
  slug: string;
  title: string;
  imageUrl: string | null;
  category: string | null;
  publishedAt: string;
  author: {
    id: string;
    namaLengkap: string;
  } | null;
};

type SponsoredCardProps = {
  article: SponsoredCardArticle;
  isBookmarked: boolean;
  onToggleBookmark: (e: React.MouseEvent, articleId: string) => void;
  disabled?: boolean;
};

export default function SponsoredCard({
  article,
  isBookmarked,
  onToggleBookmark,
  disabled,
}: SponsoredCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/artikel/${article.slug}`);
  };
  return (
    <div
      className={styles.sponsoredCard}
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      <div className={styles.sponsoredCardImageWrapper}>
        <Image
          src={article.imageUrl || "/placeholder.jpg"}
          alt={article.title}
          fill
          className={styles.sponsoredCardImage}
          style={{ objectFit: "cover" }}
          unoptimized
        />
        <span className={styles.sponsoredCardCategory}>
          {article.category?.toUpperCase() || "NEWS"}
        </span>
      </div>
      <div className={styles.sponsoredCardContent}>
        <h4 className={styles.sponsoredCardTitle}>{article.title}</h4>
        <div className={styles.sponsoredCardMeta}>
          <div className={styles.sponsoredCardAuthor}>
            <Link
              href={`/profile/${article?.author?.id}`}
              className={styles.sponsoredCardAvatar}
            >
              {article.author?.namaLengkap?.[0]?.toUpperCase() || "A"}
            </Link>
            <div className={styles.sponsoredCardAuthorInfo}>
              <span className={styles.sponsoredCardAuthorName}>
                By{" "}
                {article.author ? (
                  <Link
                    href={`/penulis/${article.author.id}`}
                    className={styles.sponsoredCardAuthorName}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {article.author.namaLengkap}
                  </Link>
                ) : (
                  "Anonim"
                )}
              </span>
              <span className={styles.sponsoredCardDate}>
                {new Date(article.publishedAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <button
              className={`${styles.bookmarkButton} ${
                styles.bookmarkButtonSponsored
              } ${isBookmarked ? styles.bookmarkButtonActive : ""}`}
              onClick={(e) => onToggleBookmark(e, article.id)}
              aria-label={isBookmarked ? "Hapus bookmark" : "Tambah bookmark"}
              disabled={disabled}
            >
              <i
                className={`bx ${
                  isBookmarked ? "bxs-bookmark" : "bx-bookmark"
                }`}
              ></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
