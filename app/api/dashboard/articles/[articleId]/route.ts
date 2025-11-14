import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { slugify, toISODate } from "@/lib/utils";
import type { Prisma, Role } from "@/src/generated";

function unauthenticatedResponse() {
  return NextResponse.json(
    { status: "error", message: "Silakan login terlebih dahulu." },
    { status: 401 }
  );
}

function forbiddenResponse(message = "Anda tidak memiliki akses.") {
  return NextResponse.json({ status: "error", message }, { status: 403 });
}

async function getArticleForUpdate(
  articleId: string,
  role: Role,
  userId: string
) {
  const where =
    role === "ADMIN" ? { id: articleId } : { id: articleId, authorId: userId };

  return prisma.article.findFirst({
    where,
  });
}

async function ensureUniqueSlug(baseSlug: string, currentId: string) {
  const normalizedBase = baseSlug || `artikel-${Date.now()}`;
  let slug = normalizedBase;
  let suffix = 1;

  while (true) {
    const existing = await prisma.article.findFirst({
      where: { slug, NOT: { id: currentId } },
      select: { id: true },
    });
    if (!existing) break;
    slug = `${normalizedBase}-${suffix++}`;
  }

  return slug;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ articleId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return unauthenticatedResponse();
  }

  const { articleId } = await params;
  const role = session.user.role as Role;
  const userId = session.user.id;

  if (role === "USER") {
    return forbiddenResponse();
  }

  const where =
    role === "ADMIN"
      ? { id: articleId }
      : { id: articleId, authorId: userId };

  const article = await prisma.article.findFirst({
    where,
    include: {
      author: {
        select: { id: true, namaLengkap: true, email: true, role: true },
      },
      _count: {
        select: { bookmarks: true, comments: true },
      },
    },
  });

  if (!article) {
    return NextResponse.json(
      { status: "error", message: "Artikel tidak ditemukan." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    status: "success",
    message: "Detail artikel berhasil diambil.",
    data: { article },
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ articleId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return unauthenticatedResponse();
  }

  const { articleId } = await params;
  const role = session.user.role as Role;
  const userId = session.user.id;

  if (role === "USER") {
    return forbiddenResponse();
  }

  const existingArticle = await getArticleForUpdate(
    articleId,
    role,
    userId
  );

  if (!existingArticle) {
    return NextResponse.json(
      {
        status: "error",
        message: "Artikel tidak ditemukan atau tidak dapat diakses.",
      },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();
    const {
      title,
      description,
      content,
      imageUrl,
      sourceLink,
      publishedAt,
      category,
      slug: providedSlug,
    }: {
      title?: string;
      description?: string;
      content?: string;
      imageUrl?: string | null;
      sourceLink?: string | null;
      publishedAt?: string;
      category?: string | null;
      slug?: string;
    } = body ?? {};

    const hasUpdates =
      typeof title !== "undefined" ||
      typeof description !== "undefined" ||
      typeof content !== "undefined" ||
      typeof imageUrl !== "undefined" ||
      typeof sourceLink !== "undefined" ||
      typeof category !== "undefined" ||
      typeof publishedAt !== "undefined" ||
      typeof providedSlug !== "undefined";

    if (!hasUpdates) {
      return NextResponse.json(
        { status: "error", message: "Tidak ada perubahan yang dikirim." },
        { status: 400 }
      );
    }

    const publishDate = toISODate(publishedAt);
    if (publishedAt && !publishDate) {
      return NextResponse.json(
        { status: "error", message: "Format tanggal tidak valid." },
        { status: 400 }
      );
    }

    const data: Prisma.ArticleUncheckedUpdateInput = {};

    if (title) data.title = title;
    if (description) data.description = description;
    if (content) data.content = content;
    if (typeof imageUrl !== "undefined") data.imageUrl = imageUrl;
    if (typeof sourceLink !== "undefined") data.sourceLink = sourceLink;
    if (typeof category !== "undefined") data.category = category;
    if (typeof publishedAt !== "undefined") {
      data.publishedAt = publishDate ?? existingArticle.publishedAt;
    }

    if (providedSlug ?? title) {
      const baseSlug = slugify(providedSlug ?? title ?? existingArticle.title);
      data.slug = await ensureUniqueSlug(baseSlug, existingArticle.id);
    }

    const article = await prisma.article.update({
      where: { id: existingArticle.id },
      data,
      include: {
        author: {
          select: { id: true, namaLengkap: true, email: true, role: true },
        },
      },
    });

    return NextResponse.json({
      status: "success",
      message: "Artikel berhasil diperbarui.",
      data: { article },
    });
  } catch (error) {
    console.error("Update article error:", error);
    return NextResponse.json(
      { status: "error", message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ articleId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return unauthenticatedResponse();
  }

  const { articleId } = await params;
  const role = session.user.role as Role;
  const userId = session.user.id;

  if (role === "USER") {
    return forbiddenResponse();
  }

  const existingArticle = await getArticleForUpdate(
    articleId,
    role,
    userId
  );

  if (!existingArticle) {
    return NextResponse.json(
      {
        status: "error",
        message: "Artikel tidak ditemukan atau tidak dapat diakses.",
      },
      { status: 404 }
    );
  }

  await prisma.article.delete({ where: { id: existingArticle.id } });

  return NextResponse.json({
    status: "success",
    message: "Artikel berhasil dihapus.",
  });
}
