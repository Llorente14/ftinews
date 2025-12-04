import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

// Import Helpers
import { articleInclude } from "@/app/api/articles/_helpers"; 

// Import Components
import Footer from "@/components/layout/Footer";
import ArticleComments from "@/components/articles/ArticleComments";
import HomeHeader from "@/components/home/HomeHeader";

// Import CSS
import styles from "./article.module.css";


// --- Helper Functions ---

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("id-ID", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
};

// Fungsi 1: Ambil Kategori untuk Header (Server Side)
async function getCategories() {
  const articles = await prisma.article.findMany({
    where: { category: { not: null } },
    select: { category: true },
  });

  const categoryCounts: Record<string, number> = {};
  
  articles.forEach((article) => {
    if (article.category) {
      // Pecah koma agar "Teknologi, AI" dihitung terpisah
      const tags = article.category.split(',').map(t => t.trim()).filter(Boolean);
      tags.forEach(tag => {
        categoryCounts[tag] = (categoryCounts[tag] || 0) + 1;
      });
    }
  });

  // Urutkan berdasarkan jumlah terbanyak
  return Object.entries(categoryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

// Fungsi 2: Acak Tag untuk konten artikel
async function getMixedTags(currentCategoryStr: string | null) {
  const currentTags = currentCategoryStr
    ? currentCategoryStr.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  const distinctRaw = await prisma.article.findMany({
    select: { category: true },
    where: { category: { not: null } },
    distinct: ['category'],
    take: 50,
  });

  const pool = new Set<string>();
  distinctRaw.forEach(r => {
    if (r.category) {
      r.category.split(',').map(s => s.trim()).filter(Boolean).forEach(t => pool.add(t));
    }
  });

  currentTags.forEach(t => pool.delete(t));
  const shuffledPool = Array.from(pool).sort(() => 0.5 - Math.random());
  
  const randomPicks = shuffledPool.slice(0, Math.max(3 - currentTags.length, 2));

  return [...currentTags, ...randomPicks];
}

// Fungsi 3: Related Articles
async function getRelatedArticles(currentId: string) {
  const candidates = await prisma.article.findMany({
    where: { id: { not: currentId } },
    orderBy: { publishedAt: "desc" },
    take: 10, 
    include: { author: { select: { namaLengkap: true } }, _count: { select: { comments: true } } }
  });
  
  const shuffled = candidates.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 4);
}

// --- Main Page Component ---

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug },
    select: { title: true, description: true, imageUrl: true },
  });
  if (!article) return { title: "Artikel Tidak Ditemukan" };
  return {
    title: `${article.title} | FTI News`,
    description: article.description,
    openGraph: { images: article.imageUrl ? [article.imageUrl] : [] },
  };
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;

  // 1. Fetch Data Artikel Utama
  const article = await prisma.article.findUnique({
    where: { slug },
    include: articleInclude,
  });

  if (!article) notFound();

  // 2. Fetch Data Pendukung (Parallel Fetching agar cepat)
  const [displayTags, relatedArticles, categories] = await Promise.all([
    getMixedTags(article.category),
    getRelatedArticles(article.id),
    getCategories(), // Fetch kategori untuk Header
  ]);

  const primaryCategory = article.category ? article.category.split(',')[0].trim() : "General";
  
  // 3. Siapkan Data untuk Props Header
  const currentDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  const currentPath = `/artikel/${slug}`; // URL aktif saat ini

  return (
    <div className={styles.container}>
      
      {/* --- HOME HEADER dengan PROPS --- */}
      <HomeHeader
        currentPath={currentPath}
        currentDate={currentDate}
      />

      <main className={styles.main}>
        
        {/* WRAPPER FLEXBOX */}
        <div className={styles.layoutGrid}>

          {/* === KOLOM KIRI: KONTEN === */}
          <article className={styles.articleContainer}>
            
            <div className={styles.breadcrumb}>
              <Link href="/">Home</Link>
              <span className={styles.separator}>/</span>
              <Link href="/artikel">News</Link>
              <span className={styles.separator}>/</span>
              <span className={styles.current}>{primaryCategory}</span>
            </div>

            <header className={styles.header}>
              <div className={styles.metaTop}>
                <span className={styles.categoryTag}>{primaryCategory.toUpperCase()}</span>
                <span className={styles.date}>{formatDate(article.publishedAt)}</span>
              </div>
              <h1 className={styles.title}>{article.title}</h1>
              <p className={styles.description}>{article.description}</p>
              
              <div className={styles.authorSection}>
                <div className={styles.authorAvatar}>
                  {article.author?.namaLengkap.charAt(0).toUpperCase() || "A"}
                </div>
                <div className={styles.authorInfo}>
                  <span className={styles.authorLabel}>Ditulis oleh</span>
                  <Link href={`/penulis/${article.authorId}`} className={styles.authorName}>
                    {article.author?.namaLengkap || "Anonim"}
                  </Link>
                </div>
              </div>
            </header>

            <div className={styles.imageWrapper}>
              <Image
                src={article.imageUrl || "/placeholder.jpg"}
                alt={article.title}
                fill
                style={{ objectFit: "cover" }}
                priority
                unoptimized
              />
            </div>

            <div className={styles.contentWrapper}>
              <div 
                className={styles.content}
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>

            <div className={styles.footerActions}>
              <div className={styles.stats}>
                  <span><i className='bx bx-comment'></i> {article._count.comments} Komentar</span>
                  <span><i className='bx bx-bookmark'></i> {article._count.bookmarks} Disimpan</span>
              </div>
            </div>

            {/* --- TAGS SECTION --- */}
            {displayTags.length > 0 && (
              <div className={styles.tagsSection}>
                <span className={styles.tagsLabel}>Topik Terkait:</span>
                {displayTags.map((tag, index) => (
                  <Link 
                    key={`${tag}-${index}`}
                    href={`/artikel?search=${encodeURIComponent(tag)}`}
                    className={styles.tagChip}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            {/* --- KOMENTAR --- */}
            <ArticleComments articleId={article.id} />

            {/* --- BACA JUGA --- */}
            {relatedArticles.length > 0 && (
              <section className={styles.relatedSection}>
                <h3 className={styles.relatedTitle}>Baca Juga</h3>
                <div className={styles.relatedGrid}>
                  {relatedArticles.map((item) => (
                    <Link href={`/artikel/${item.slug}`} key={item.id} className={styles.relatedCard}>
                      <div className={styles.relatedImageWrapper}>
                        <Image 
                          src={item.imageUrl || "/placeholder.jpg"} 
                          alt={item.title}
                          fill
                          style={{ objectFit: "cover" }}
                          unoptimized
                        />
                      </div>
                      <h4 className={styles.relatedCardTitle}>{item.title}</h4>
                    </Link>
                  ))}
                </div>
              </section>
            )}

          </article>

          {/* === KOLOM KANAN: IKLAN STICKY === */}
          <aside className={styles.adSidebarRight}>
            <div className={`${styles.adBox} ${styles.boxHuge}`}>
              <Link 
                href="https://untar.ac.id" 
                target="_blank" 
                rel="nofollow noopener noreferrer"
                className={styles.adLinkWrapper}
              >
                <Image
                  src="/Untar_Promotion.png" 
                  alt="Promosi Untar"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </Link>
              <span className={styles.adLabel}>Advertisement</span>
            </div>
          </aside>

        </div> 
      </main>
      <Footer />
    </div>
  );
}