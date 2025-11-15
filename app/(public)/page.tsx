"use client";

import { useEffect, useState } from "react";
import { useArticles } from "@/hooks/useArticles";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Footer from "@/components/layout/Footer";
import styles from "./homepage.module.css";

export default function HomePage() {
  const { data: session } = useSession();
  const { articles, fetchArticles, isLoading } = useArticles({
    perPage: 10,
    sort: "newest",
  });

  const [activeTab, setActiveTab] = useState("latest");

  // Initialize date directly
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

  useEffect(() => {
    fetchArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Get featured article (first article)
  const featuredArticle = articles[0];

  // Get breaking news (next 4 articles)
  const breakingNews = articles.slice(1, 5);

  // Get latest articles
  const latestArticles = articles.slice(5, 10);

  if (isLoading && articles.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerTopContent}>
            <div className={styles.headerTopLeft}>
              <h1 className={styles.logo}>FTI News</h1>
              <span className={styles.date}>{currentDate}</span>
              <span className={styles.weather}>
                32° Rainy, Jakarta Selatan 🌧️
              </span>
            </div>
            <div className={styles.headerTopRight}>
              <Link
                href={session ? "/profile" : "/login"}
                className={styles.headerLink}
              >
                {session?.user?.name || "Username"}
              </Link>
              <span className={styles.separator}>|</span>
              <Link href="#" className={styles.headerLink}>
                English
              </Link>
              <div className={styles.searchBox}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                  type="text"
                  placeholder="Search..."
                  className={styles.searchInput}
                />
              </div>
            </div>
          </div>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navContent}>
            <div className={styles.navLinks}>
              <Link href="/" className={styles.navLinkActive}>
                Home
              </Link>
              <Link href="/artikel" className={styles.navLink}>
                News
              </Link>
              <Link href="/profile" className={styles.navLink}>
                Profile
              </Link>
              <Link href="#" className={styles.navLink}>
                Services
              </Link>
              <Link href="#" className={styles.navLink}>
                Public Info
              </Link>
              <Link href="#" className={styles.navLink}>
                Regulation
              </Link>
              <Link href="#" className={styles.navLink}>
                Publication
              </Link>
              <Link href="#" className={styles.navLink}>
                Announcement
              </Link>
              <Link href="/artikel" className={styles.navLink}>
                Latest
              </Link>
            </div>
            <Link href="/artikel" className={styles.viewAllLink}>
              View All
            </Link>
          </div>
        </nav>
        <div className={styles.navDivider}></div>
      </header>

      <main className={styles.main}>
        {/* Breaking News */}
        {breakingNews.length > 0 && (
          <div className={styles.breakingNewsSection}>
            <div className={styles.breakingNewsContent}>
              <h2 className={styles.breakingNewsLabel}>Breaking News</h2>
              <div className={styles.breakingNewsMarquee}>
                <div className={styles.marqueeContent}>
                  {/* Duplicate items for seamless loop */}
                  {[...breakingNews, ...breakingNews].map((article, idx) => (
                    <div
                      key={`${article.id}-${idx}`}
                      className={styles.breakingNewsItem}
                    >
                      <Image
                        src={article.imageUrl || "/placeholder.jpg"}
                        alt={article.title}
                        width={40}
                        height={40}
                        className={styles.breakingNewsImage}
                        style={{ objectFit: "cover" }}
                      />
                      <div>
                        <p className={styles.breakingNewsTitle}>
                          {article.title}
                        </p>
                        <p className={styles.breakingNewsTime}>
                          {new Date(article.publishedAt).toLocaleDateString(
                            "id-ID",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Featured News */}
        {featuredArticle && (
          <section className={styles.featuredSection}>
            <h2 className={styles.sectionTitle}>Featured News</h2>
            <div className={styles.featuredGrid}>
              <Link
                href={`/artikel/${featuredArticle.slug}`}
                className={styles.featuredMain}
              >
                <div
                  className={styles.featuredImage}
                  style={{
                    backgroundImage: `url(${
                      featuredArticle.imageUrl || "/placeholder.jpg"
                    })`,
                  }}
                ></div>
                <div className={styles.featuredOverlay}></div>
                <div className={styles.featuredContent}>
                  <span className={styles.featuredCategory}>
                    {featuredArticle.category?.toUpperCase() || "NEWS"}
                  </span>
                  <p className={styles.featuredDate}>
                    {new Date(featuredArticle.publishedAt).toLocaleDateString(
                      "id-ID",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                  <h3 className={styles.featuredTitle}>
                    {featuredArticle.title}
                  </h3>
                  <p className={styles.featuredDescription}>
                    {featuredArticle.description}
                  </p>
                </div>
              </Link>

              <div className={styles.hoaxBox}>
                <h3 className={styles.hoaxTitle}>Eradicating Hoaxes</h3>
                <ol className={styles.hoaxList}>
                  {latestArticles.slice(0, 5).map((article) => (
                    <li key={article.id} className={styles.hoaxItem}>
                      <p className={styles.hoaxText}>
                        <span className={styles.hoaxDate}>
                          {new Date(article.publishedAt).toLocaleDateString(
                            "id-ID",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}{" "}
                          -{" "}
                        </span>
                        {article.title}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>
        )}

        {/* Latest News Tabs */}
        <section className={styles.latestSection}>
          <div className={styles.tabsHeader}>
            <div
              className={`${styles.tab} ${
                activeTab === "latest" ? styles.tabActive : ""
              }`}
              onClick={() => setActiveTab("latest")}
            >
              <h3 className={styles.tabTitle}>Latest</h3>
              <Link href="/artikel" className={styles.tabLink}>
                View All →
              </Link>
            </div>
            <div
              className={`${styles.tab} ${
                activeTab === "press" ? styles.tabActive : ""
              }`}
              onClick={() => setActiveTab("press")}
            >
              <h3 className={styles.tabTitle}>Press Conference</h3>
              <Link href="/artikel" className={styles.tabLink}>
                View All →
              </Link>
            </div>
            <div
              className={`${styles.tab} ${
                activeTab === "news" ? styles.tabActive : ""
              }`}
              onClick={() => setActiveTab("news")}
            >
              <h3 className={styles.tabTitle}>News</h3>
              <Link href="/artikel" className={styles.tabLink}>
                View All →
              </Link>
            </div>
            <div
              className={`${styles.tab} ${
                activeTab === "announcement" ? styles.tabActive : ""
              }`}
              onClick={() => setActiveTab("announcement")}
            >
              <h3 className={styles.tabTitle}>Announcement</h3>
              <Link href="/artikel" className={styles.tabLink}>
                View All →
              </Link>
            </div>
          </div>

          <div className={styles.latestGrid}>
            {latestArticles.slice(0, 2).map((article) => (
              <Link
                key={article.id}
                href={`/artikel/${article.slug}`}
                className={styles.latestCard}
              >
                <div
                  className={styles.latestCardImage}
                  style={{
                    backgroundImage: `url(${
                      article.imageUrl || "/placeholder.jpg"
                    })`,
                  }}
                ></div>
                <div className={styles.latestCardContent}>
                  <span className={styles.latestCardCategory}>
                    {article.category?.toUpperCase() || "NEWS"}
                  </span>
                  <h4 className={styles.latestCardTitle}>{article.title}</h4>
                  <p className={styles.latestCardDescription}>
                    {article.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
