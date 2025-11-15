import { NextRequest, NextResponse } from "next/server";
import { requireAdminOrWriter } from "@/lib/auth-helpers";
import prisma from "@/lib/prisma";
import { slugify, toISODate } from "@/lib/utils";
import type { Prisma, Role } from "@/src/generated";

async function ensureUniqueSlug(baseSlug: string) {
  const normalizedBase = baseSlug || `artikel-${Date.now()}`;
  let slug = normalizedBase;
  let suffix = 1;

  while (true) {
    const existing = await prisma.article.findUnique({ where: { slug } });
    if (!existing) break;
    slug = `${normalizedBase}-${suffix++}`;
  }

  return slug;
}

export async function GET(request: NextRequest) {
  const authResult = await requireAdminOrWriter(request);
  if (authResult.error) {
    return NextResponse.json(
      { status: authResult.error.status, message: authResult.error.message },
      { status: authResult.error.statusCode }
    );
  }
  const { session } = authResult;
  const role = session.user.role as Role;
  const userId = session.user.id;

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const category = searchParams.get("category");

  const where: Prisma.ArticleWhereInput = {};

  if (role === "WRITER") {
    where.authorId = userId;
  }

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
      { content: { contains: search } },
    ];
  }

  if (category) {
    where.category = category;
  }

  const articles = await prisma.article.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { id: true, namaLengkap: true, email: true, role: true },
      },
      _count: {
        select: { bookmarks: true, comments: true },
      },
    },
  });

  return NextResponse.json({
    status: "success",
    message: "Daftar artikel berhasil diambil.",
    data: { articles },
  });
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdminOrWriter(request);
  if (authResult.error) {
    return NextResponse.json(
      { status: authResult.error.status, message: authResult.error.message },
      { status: authResult.error.statusCode }
    );
  }
  const { session } = authResult;
  const role = session.user.role as Role;
  const userId = session.user.id;

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
      authorId,
    }: {
      title?: string;
      description?: string;
      content?: string;
      imageUrl?: string | null;
      sourceLink?: string | null;
      publishedAt?: string;
      category?: string | null;
      slug?: string;
      authorId?: string;
    } = body ?? {};

    if (!title || !description || !content) {
      return NextResponse.json(
        {
          status: "error",
          message: "Field title, description, dan content wajib diisi.",
        },
        { status: 400 }
      );
    }

    const baseSlug = slugify(providedSlug ?? title);
    const slug = await ensureUniqueSlug(baseSlug);

    const publishDate = toISODate(publishedAt);
    if (publishedAt && !publishDate) {
      return NextResponse.json(
        { status: "error", message: "Format tanggal tidak valid." },
        { status: 400 }
      );
    }

    const resolvedAuthorId =
      role === "ADMIN" ? authorId ?? userId : (userId as string);

    const article = await prisma.article.create({
      data: {
        slug,
        title,
        description,
        content,
        imageUrl: imageUrl ?? null,
        sourceLink: sourceLink ?? null,
        category: category ?? null,
        publishedAt: publishDate ?? undefined,
        authorId: resolvedAuthorId,
      },
      include: {
        author: {
          select: { id: true, namaLengkap: true, email: true, role: true },
        },
      },
    });

    return NextResponse.json(
      {
        status: "success",
        message: "Artikel berhasil dibuat.",
        data: { article },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create article error:", error);
    return NextResponse.json(
      { status: "error", message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
