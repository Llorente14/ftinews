import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { commentInclude, serializeComment, type CommentWithUser } from "./_helpers";

function validateContent(content?: string) {
  const trimmed = content?.trim();
  if (!trimmed) {
    return { ok: false, message: "Konten komentar tidak boleh kosong." } as const;
  }
  if (trimmed.length > 2000) {
    return {
      ok: false,
      message: "Konten komentar maksimal 2000 karakter.",
    } as const;
  }
  return { ok: true, value: trimmed } as const;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const articleId = searchParams.get("articleId");

  if (!articleId) {
    return NextResponse.json(
      { status: "error", message: "Parameter articleId wajib diisi." },
      { status: 400 }
    );
  }

  const comments = await prisma.comment.findMany({
    where: { articleId },
    include: commentInclude,
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({
    status: "success",
    message: "Daftar komentar berhasil diambil.",
    data: { items: comments.map(serializeComment), count: comments.length },
  });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { status: "error", message: "Silakan login terlebih dahulu." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { articleId, content }: { articleId?: string; content?: string } = body ?? {};

    if (!articleId) {
      return NextResponse.json(
        { status: "error", message: "articleId wajib diisi." },
        { status: 400 }
      );
    }

    const validation = validateContent(content);
    if (!validation.ok) {
      return NextResponse.json(
        { status: "error", message: validation.message },
        { status: 400 }
      );
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { id: true },
    });

    if (!article) {
      return NextResponse.json(
        { status: "error", message: "Artikel tidak ditemukan." },
        { status: 404 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        articleId,
        userId: session.user.id,
        content: validation.value,
      },
      include: commentInclude,
    });

    return NextResponse.json(
      {
        status: "success",
        message: "Komentar berhasil ditambahkan.",
        data: { comment: serializeComment(comment) },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Comments POST error:", error);
    return NextResponse.json(
      { status: "error", message: "Terjadi kesalahan saat menambah komentar." },
      { status: 500 }
    );
  }
}
