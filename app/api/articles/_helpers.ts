import type { Prisma } from "@/src/generated";

export const articleInclude = {
  author: {
    select: {
      id: true,
      namaLengkap: true,
      email: true,
      role: true,
    },
  },
  _count: {
    select: {
      comments: true,
      bookmarks: true,
    },
  },
} satisfies Prisma.ArticleInclude;

export type ArticleWithMeta = Prisma.ArticleGetPayload<{
  include: typeof articleInclude;
}>;

export function serializeArticle(
  article: ArticleWithMeta,
  options?: { includeContent?: boolean }
) {
  const includeContent = options?.includeContent ?? true;

  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    description: article.description,
    content: includeContent ? article.content : undefined,
    imageUrl: article.imageUrl,
    sourceLink: article.sourceLink,
    category: article.category,
    publishedAt: article.publishedAt,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
    author: article.author
      ? {
          id: article.author.id,
          namaLengkap: article.author.namaLengkap,
          email: article.author.email,
          role: article.author.role,
        }
      : null,
    stats: {
      commentCount: article._count.comments,
      bookmarkCount: article._count.bookmarks,
    },
  };
}
