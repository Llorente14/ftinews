import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import type { Prisma } from "@/src/generated";
import { articleInclude, serializeArticle } from "../articles/_helpers";

const bookmarkInclude = {
  article: {
    include: articleInclude,
  },
} satisfies Prisma.BookmarkInclude;

type BookmarkWithArticle = Prisma.BookmarkGetPayload<{ include: typeof bookmarkInclude }>;

function unauthenticatedResponse() {
  return NextResponse.json(
    { status: "error", message: "Silakan login terlebih dahulu." },
    { status: 401 }
  );
}

function serializeBookmark(bookmark: BookmarkWithArticle) {
  return {
    id: bookmark.id,
    articleId: bookmark.articleId,
    createdAt: bookmark.createdAt,
    article: bookmark.article
      ? serializeArticle(bookmark.article, { includeContent: false })
      : null,
  };
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return unauthenticatedResponse();

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: bookmarkInclude,
  });

  return NextResponse.json({
    status: "success",
    message: "Daftar bookmark berhasil diambil.",
    data: {
      items: bookmarks.map(serializeBookmark),
      count: bookmarks.length,
    },
  });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return unauthenticatedResponse();

  try {
    const body = await request.json();
    const { articleId }: { articleId?: string } = body ?? {};

    if (!articleId) {
      return NextResponse.json(
        { status: "error", message: "articleId wajib diisi." },
        { status: 400 }
      );
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      return NextResponse.json(
        { status: "error", message: "Artikel tidak ditemukan." },
        { status: 404 }
      );
    }

    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_articleId: {
          userId: session.user.id,
          articleId,
        },
      },
      include: bookmarkInclude,
    });

    if (existing) {
      return NextResponse.json({
        status: "success",
        message: "Artikel sudah ada di bookmark.",
        data: { bookmark: serializeBookmark(existing) },
      });
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        userId: session.user.id,
        articleId,
      },
      include: bookmarkInclude,
    });

    return NextResponse.json(
      {
        status: "success",
        message: "Bookmark berhasil ditambahkan.",
        data: { bookmark: serializeBookmark(bookmark) },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Bookmark POST error:", error);
    return NextResponse.json(
      { status: "error", message: "Terjadi kesalahan saat menambah bookmark." },
      { status: 500 }
    );
  }
}
