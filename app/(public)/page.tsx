"use client";

import { useEffect, useState, useCallback } from "react";
import { useArticles } from "@/hooks/useArticles";
import { useCategories } from "@/hooks/useCategories";
import { useSubscribe } from "@/hooks/useSubscribe";
import {
  useBookmarks,
  useAddBookmark,
  useDeleteBookmark,
} from "@/hooks/useBookmarks";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import HomeHeader from "@/components/home/HomeHeader";
import Footer from "@/components/layout/Footer";
import HighlightCard from "@/components/home/HighlightCard";
import SponsoredCard from "@/components/home/SponsoredCard";
import styles from "./homepage.module.css";

export default function HomePage() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { articles, fetchArticles, isLoading } = useArticles({
    perPage: 10,
    sort: "newest",
  });

  // Fetch articles for different tabs
  const {
    articles: latestTabArticles,
    fetchArticles: fetchLatestTab,
    isLoading: isLoadingLatestTab,
  } = useArticles({
    perPage: 2,
    sort: "newest",
  });

  const {
    articles: popularTabArticles,
    fetchArticles: fetchPopularTab,
    isLoading: isLoadingPopularTab,
  } = useArticles({
    perPage: 2,
    sort: "newest", // Can be enhanced with bookmark/comment count
  });

  const {
    articles: newsTabArticles,
    fetchArticles: fetchNewsTab,
    isLoading: isLoadingNewsTab,
  } = useArticles({
    perPage: 2,
    category: "news",
    sort: "newest",
  });

  const {
    articles: announcementTabArticles,
    fetchArticles: fetchAnnouncementTab,
    isLoading: isLoadingAnnouncementTab,
  } = useArticles({
    perPage: 2,
    category: "announcement",
    sort: "newest",
  });

  // Fetch popular articles for highlights section
  const {
    articles: popularArticles,
    fetchArticles: fetchPopularArticles,
    isLoading: isLoadingPopular,
  } = useArticles({
    perPage: 6,
    sort: "newest",
  });

  // Fetch categories
  const { categories, isLoading: isLoadingCategories } = useCategories();

  // Fetch bookmarks
  const { bookmarks, fetchBookmarks } = useBookmarks();
  const { addBookmark, isLoading: isAddingBookmark } = useAddBookmark();
  const { deleteBookmark, isLoading: isDeletingBookmark } = useDeleteBookmark();

  const [activeTab, setActiveTab] = useState("latest");
  const [email, setEmail] = useState("");
  const {
    subscribe,
    isLoading: isSubscribing,
    error: subscribeError,
    success: subscribeSuccess,
  } = useSubscribe();

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
    fetchPopularArticles();
    fetchLatestTab();
    fetchPopularTab();
    fetchNewsTab();
    fetchAnnouncementTab();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Fetch bookmarks when session is available
  useEffect(() => {
    if (session) {
      fetchBookmarks().catch(() => {
        // Silently fail if user is not authenticated or error occurs
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  // Fetch articles when tab changes
  useEffect(() => {
    switch (activeTab) {
      case "latest":
        fetchLatestTab();
        break;
      case "press":
        fetchPopularTab();
        break;
      case "news":
        fetchNewsTab();
        break;
      case "announcement":
        fetchAnnouncementTab();
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Get featured article (first article)
  const featuredArticle = articles[0];

  // Get breaking news (next 4 articles)
  const breakingNews = articles.slice(1, 5);

  // Get latest articles
  const latestArticles = articles.slice(5, 10);

  // Get sponsored articles (for sponsored news section)
  const sponsoredArticles = articles.slice(0, 4);

  // Handle newsletter subscription
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      await subscribe(email);
      setEmail("");
      // Success message will be shown via subscribeSuccess state
    } catch {
      // Error already handled by hook
    }
  };

  // Check if article is bookmarked
  const isArticleBookmarked = useCallback(
    (articleId: string) => {
      return bookmarks.some((bookmark) => bookmark.articleId === articleId);
    },
    [bookmarks]
  );

  // Handle bookmark toggle
  const handleBookmarkToggle = useCallback(
    async (e: React.MouseEvent, articleId: string) => {
      e.preventDefault();
      e.stopPropagation();

      if (!session) {
        // Redirect to login if not authenticated
        window.location.href = "/login";
        return;
      }

      const isBookmarked = isArticleBookmarked(articleId);

      try {
        if (isBookmarked) {
          const bookmark = bookmarks.find((b) => b.articleId === articleId);
          if (bookmark) {
            await deleteBookmark(bookmark.id);
          }
        } else {
          await addBookmark(articleId);
        }
        await fetchBookmarks();
      } catch (error) {
        console.error("Error toggling bookmark:", error);
      }
    },
    [
      session,
      bookmarks,
      isArticleBookmarked,
      addBookmark,
      deleteBookmark,
      fetchBookmarks,
    ]
  );

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
      <HomeHeader
        session={session ?? null}
        categories={categories}
        currentPath={pathname}
        currentDate={currentDate}
      />

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
                    <Link
                      key={`${article.id}-${idx}`}
                      href={`/artikel/${article.slug}`}
                      className={styles.breakingNewsItem}
                    >
                      <Image
                        src={article.imageUrl || "/placeholder.jpg"}
                        alt={article.title}
                        width={40}
                        height={40}
                        className={styles.breakingNewsImage}
                        style={{ objectFit: "cover" }}
                        unoptimized
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
                    </Link>
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
                    |{" "}
                    {featuredArticle.author ? (
                      <Link
                        href={`/penulis/${featuredArticle.author.id}`}
                        className={styles.featuredAuthorLink}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {featuredArticle.author.namaLengkap}
                      </Link>
                    ) : (
                      "Anonim"
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
                      <Link
                        href={`/artikel/${article.slug}`}
                        className={styles.hoaxLink}
                      >
                        <p className={styles.hoaxText}>
                          <span className={styles.hoaxDate}>
                            {new Date(article.publishedAt).toLocaleDateString(
                              "id-ID",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                          {" - "}
                          {article.title}
                        </p>
                      </Link>
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
              <span className={styles.tabLink}>View All →</span>
            </div>
            <div
              className={`${styles.tab} ${
                activeTab === "press" ? styles.tabActive : ""
              }`}
              onClick={() => setActiveTab("press")}
            >
              <h3 className={styles.tabTitle}>Popular</h3>
              <span className={styles.tabLink}>View All →</span>
            </div>
            <div
              className={`${styles.tab} ${
                activeTab === "news" ? styles.tabActive : ""
              }`}
              onClick={() => setActiveTab("news")}
            >
              <h3 className={styles.tabTitle}>News</h3>
              <span className={styles.tabLink}>View All →</span>
            </div>
            <div
              className={`${styles.tab} ${
                activeTab === "announcement" ? styles.tabActive : ""
              }`}
              onClick={() => setActiveTab("announcement")}
            >
              <h3 className={styles.tabTitle}>Announcement</h3>
              <span className={styles.tabLink}>View All →</span>
            </div>
          </div>

          <div className={styles.latestGrid}>
            {(() => {
              let displayArticles: typeof latestTabArticles = [];
              let isLoading = false;

              switch (activeTab) {
                case "latest":
                  displayArticles = latestTabArticles;
                  isLoading = isLoadingLatestTab;
                  break;
                case "press":
                  displayArticles = popularTabArticles;
                  isLoading = isLoadingPopularTab;
                  break;
                case "news":
                  displayArticles = newsTabArticles;
                  isLoading = isLoadingNewsTab;
                  break;
                case "announcement":
                  displayArticles = announcementTabArticles;
                  isLoading = isLoadingAnnouncementTab;
                  break;
              }

              if (isLoading && displayArticles.length === 0) {
                return (
                  <>
                    <div className={styles.latestCardPlaceholder}></div>
                    <div className={styles.latestCardPlaceholder}></div>
                  </>
                );
              }

              if (displayArticles.length === 0) {
                return (
                  <>
                    <div className={styles.latestCardPlaceholder}>
                      <p>Belum ada artikel</p>
                    </div>
                    <div className={styles.latestCardPlaceholder}>
                      <p>untuk kategori ini</p>
                    </div>
                  </>
                );
              }

              // Ensure we always show 2 cards (fill with placeholders if needed)
              const cardsToShow: ((typeof displayArticles)[0] | null)[] = [
                ...displayArticles,
              ];
              while (cardsToShow.length < 2) {
                cardsToShow.push(null);
              }

              return cardsToShow.slice(0, 2).map((article, index) => {
                if (!article) {
                  return (
                    <div
                      key={`placeholder-${index}`}
                      className={styles.latestCardPlaceholder}
                    ></div>
                  );
                }
                return (
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
                      <h4 className={styles.latestCardTitle}>
                        {article.title}
                      </h4>
                      <p className={styles.latestCardDescription}>
                        {article.description}
                      </p>
                    </div>
                  </Link>
                );
              });
            })()}
          </div>
        </section>

        {/* Today's Top Highlights Section */}
        <section className={styles.highlightsSection}>
          <div className={styles.highlightsContainer}>
            {/* Left: Popular News */}
            <div className={styles.highlightsMain}>
              <div className={styles.highlightsHeader}>
                <h2 className={styles.highlightsTitle}>
                  Today&apos;s Top Highlights
                </h2>
                <div className={styles.highlightsTitleUnderline}></div>
              </div>

              {isLoadingPopular && popularArticles.length === 0 ? (
                <div className={styles.highlightsLoading}>
                  <p>Loading popular news...</p>
                </div>
              ) : popularArticles.length === 0 ? (
                <div className={styles.highlightsEmpty}>
                  <p>Belum ada artikel populer.</p>
                </div>
              ) : (
                <div className={styles.highlightsGrid}>
                  {popularArticles.map((article) => {
                    const isBookmarked = isArticleBookmarked(article.id);
                    return (
                      <HighlightCard
                        key={article.id}
                        article={article}
                        isBookmarked={isBookmarked}
                        onToggleBookmark={handleBookmarkToggle}
                        disabled={isAddingBookmark || isDeletingBookmark}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: Trending Topics and Popular Post */}
            <div className={styles.highlightsSidebar}>
              {/* Trending Topics */}
              <div className={styles.sidebarSection}>
                <div className={styles.sidebarHeader}>
                  <h3 className={styles.sidebarTitle}>Trending Topics</h3>
                  <div className={styles.sidebarTitleUnderline}></div>
                </div>
                {isLoadingCategories ? (
                  <div className={styles.sidebarLoading}>
                    <p>Loading categories...</p>
                  </div>
                ) : categories.length === 0 ? (
                  <div className={styles.sidebarEmpty}>
                    <p>Belum ada kategori.</p>
                  </div>
                ) : (
                  <ul className={styles.topicsList}>
                    {categories.map((category) => (
                      <li key={category.name} className={styles.topicItem}>
                        <Link
                          href={`/kategori/${encodeURIComponent(
                            category.name
                          )}`}
                          className={styles.topicLink}
                        >
                          <i className="bx bx-chevron-right"></i>
                          <span className={styles.topicName}>
                            {category.name}
                          </span>
                          <span className={styles.topicCount}>
                            ({category.count.toString().padStart(2, "0")})
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Popular Post */}
              <div className={styles.sidebarSection}>
                <div className={styles.sidebarHeader}>
                  <h3 className={styles.sidebarTitle}>Popular Post</h3>
                  <div className={styles.sidebarTitleUnderline}></div>
                </div>
                {isLoadingPopular && popularArticles.length === 0 ? (
                  <div className={styles.sidebarLoading}>
                    <p>Loading popular posts...</p>
                  </div>
                ) : popularArticles.length === 0 ? (
                  <div className={styles.sidebarEmpty}>
                    <p>Belum ada post populer.</p>
                  </div>
                ) : (
                  <div className={styles.popularPostsListSidebar}>
                    {popularArticles.map((article) => (
                      <Link
                        key={article.id}
                        href={`/artikel/${article.slug}`}
                        className={styles.popularPostItemSidebar}
                      >
                        <div className={styles.popularPostImageWrapperSidebar}>
                          <Image
                            src={article.imageUrl || "/placeholder.jpg"}
                            alt={article.title}
                            fill
                            className={styles.popularPostImageSidebar}
                            style={{ objectFit: "cover" }}
                            unoptimized
                          />
                        </div>
                        <div className={styles.popularPostContentSidebar}>
                          <span className={styles.popularPostDateSidebar}>
                            {new Date(article.publishedAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </span>
                          <h4 className={styles.popularPostTitleSidebar}>
                            {article.title}
                          </h4>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Sponsored News Section */}
        <section className={styles.sponsoredSection}>
          <div className={styles.sponsoredHeader}>
            <h2 className={styles.sponsoredTitle}>Sponsored News</h2>
            <div className={styles.sponsoredTitleUnderline}></div>
          </div>
          <div className={styles.sponsoredGrid}>
            {sponsoredArticles.map((article) => {
              const isBookmarked = isArticleBookmarked(article.id);
              return (
                <SponsoredCard
                  key={article.id}
                  article={article}
                  isBookmarked={isBookmarked}
                  onToggleBookmark={handleBookmarkToggle}
                  disabled={isAddingBookmark || isDeletingBookmark}
                />
              );
            })}
          </div>
        </section>

        {/* Newsletter Subscription Section */}
        <section className={styles.newsletterSection}>
          <div className={styles.newsletterContent}>
            <h2 className={styles.newsletterTitle}>Never miss any Update</h2>
            <p className={styles.newsletterSubtitle}>
              Get the freshest headlines and updates sent uninterrupted to your
              inbox.
            </p>
            <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.newsletterInput}
                required
              />
              <button
                type="submit"
                className={styles.newsletterButton}
                disabled={isSubscribing}
              >
                Subscribe
                <i className="bx bx-bell"></i>
              </button>
            </form>
            {subscribeError && (
              <p className={styles.newsletterError}>{subscribeError}</p>
            )}  
            {subscribeSuccess && (
              <p className={styles.newsletterSuccess}>
                Terima kasih! Anda telah berlangganan newsletter kami.
              </p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
