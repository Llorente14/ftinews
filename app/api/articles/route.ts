import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { Prisma } from "@/src/generated";
import {
  articleInclude,
  serializeArticle,
  type ArticleWithMeta,
} from "./_helpers";

const defaultPageSize = 12;
const maxPageSize = 50;

function parseNumberParam(
  value: string | null,
  fallback: number,
  min = 1,
  max = Number.MAX_SAFE_INTEGER
) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(Math.trunc(parsed), min), max);
}

function buildWhere(searchParams: URLSearchParams): Prisma.ArticleWhereInput {
  const where: Prisma.ArticleWhereInput = {};

  const search = searchParams.get("search");
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
      { content: { contains: search } },
      { category: { contains: search } },
    ];
  }

  const category = searchParams.get("category");
  if (category) {
    where.category = category;
  }

  const authorId = searchParams.get("authorId") ?? searchParams.get("author");
  if (authorId) {
    where.authorId = authorId;
  }

  let publishedFilter: Prisma.DateTimeFilter<"Article"> | undefined;

  const publishedFrom = searchParams.get("publishedFrom");
  if (publishedFrom) {
    const fromDate = new Date(publishedFrom);
    if (!Number.isNaN(fromDate.valueOf())) {
      publishedFilter = { ...(publishedFilter ?? {}), gte: fromDate };
    }
  }

  const publishedTo = searchParams.get("publishedTo");
  if (publishedTo) {
    const toDate = new Date(publishedTo);
    if (!Number.isNaN(toDate.valueOf())) {
      publishedFilter = { ...(publishedFilter ?? {}), lte: toDate };
    }
  }

  if (publishedFilter) {
    where.publishedAt = publishedFilter;
  }

  return where;
}

function resolveOrderBy(
  param: string | null
): Prisma.ArticleOrderByWithRelationInput {
  switch (param) {
    case "oldest":
      return { publishedAt: "asc" };
    case "az":
      return { title: "asc" };
    case "za":
      return { title: "desc" };
    default:
      return { publishedAt: "desc" };
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseNumberParam(searchParams.get("page"), 1);
    const perPage = parseNumberParam(
      searchParams.get("perPage") ?? searchParams.get("limit"),
      defaultPageSize,
      1,
      maxPageSize
    );
    const skip = (page - 1) * perPage;

    const where = buildWhere(searchParams);
    const orderBy = resolveOrderBy(searchParams.get("sort"));

    const [items, total] = await Promise.all<[ArticleWithMeta[], number]>([
      prisma.article.findMany({
        where,
        orderBy,
        skip,
        take: perPage,
        include: articleInclude,
      }),
      prisma.article.count({ where }),
    ]);

    const totalPages = Math.max(Math.ceil(total / perPage), 1);

    return NextResponse.json({
      status: "success",
      message: "Daftar artikel berhasil diambil.",
      data: {
        meta: {
          page,
          perPage,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        items: items.map((article) =>
          serializeArticle(article, { includeContent: false })
        ),
      },
    });
  } catch (error) {
    console.error("Articles GET error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Terjadi kesalahan saat mengambil artikel.",
      },
      { status: 500 }
    );
  }
}
