"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { usePublicProfile } from "@/hooks/useProfile";
import Footer from "@/components/layout/Footer";
import styles from "./penulis.module.css";

export default function PenulisProfilePage() {
  const params = useParams();
  const userId = params?.id as string;
  const { profile, fetchPublicProfile, isLoading, error } = usePublicProfile();

  useEffect(() => {
    if (userId) {
      fetchPublicProfile(userId);
    }
  }, [userId, fetchPublicProfile]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <p>Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h1>Penulis Tidak Ditemukan</h1>
          <p>{error || "Penulis dengan ID tersebut tidak ditemukan."}</p>
          <Link href="/" className={styles.backLink}>
            Kembali ke Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const articles = profile.articles || [];
  const articleCount = profile._count?.articles || 0;

  return (
    <div className={styles.container}>
      {/* Header - Same as homepage */}
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerTopContent}>
            <div className={styles.headerTopLeft}>
              <Link href="/" className={styles.logo}>
                FTI News
              </Link>
            </div>
            <div className={styles.headerTopRight}>
              <Link href="/" className={styles.headerLink}>
                Home
              </Link>
              <span className={styles.separator}>|</span>
              <Link href="/artikel" className={styles.headerLink}>
                Articles
              </Link>
            </div>
          </div>
        </div>
        <div className={styles.headerDivider}></div>
      </header>

      <main className={styles.main}>
        {/* Author Profile Section */}
        <section className={styles.profileSection}>
          <div className={styles.profileCard}>
            <div className={styles.profileHeader}>
              <div className={styles.profileAvatar}>
                <span className={styles.avatarText}>
                  {profile.namaLengkap.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className={styles.profileInfo}>
                <h1 className={styles.profileName}>{profile.namaLengkap}</h1>
                <p className={styles.profileRole}>
                  {profile.role === "WRITER" ? "Writer" : profile.role}
                </p>
                <p className={styles.profileEmail}>{profile.email}</p>
                <div className={styles.profileStats}>
                  <div className={styles.statItem}>
                    <span className={styles.statNumber}>{articleCount}</span>
                    <span className={styles.statLabel}>Articles</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statNumber}>
                      {new Date(profile.createdAt).getFullYear()}
                    </span>
                    <span className={styles.statLabel}>Joined</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Articles Section */}
        <section className={styles.articlesSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Articles by {profile.namaLengkap}
            </h2>
            <p className={styles.sectionSubtitle}>
              {articleCount} {articleCount === 1 ? "article" : "articles"}{" "}
              published
            </p>
          </div>

          {articles.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No articles published yet.</p>
            </div>
          ) : (
            <div className={styles.articlesGrid}>
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/artikel/${article.slug}`}
                  className={styles.articleCard}
                >
                  {article.imageUrl && (
                    <div className={styles.articleImage}>
                      <Image
                        src={article.imageUrl}
                        alt={article.title}
                        width={400}
                        height={250}
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  )}
                  <div className={styles.articleContent}>
                    <span className={styles.articleCategory}>
                      {article.category?.toUpperCase() || "NEWS"}
                    </span>
                    <h3 className={styles.articleTitle}>{article.title}</h3>
                    <p className={styles.articleDescription}>
                      {article.description}
                    </p>
                    <p className={styles.articleDate}>
                      {new Date(article.publishedAt).toLocaleDateString(
                        "id-ID",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
