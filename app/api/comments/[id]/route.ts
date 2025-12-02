import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import { commentInclude, serializeComment } from "../_helpers";

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const comment = await prisma.comment.findUnique({
      where: { id },
      include: commentInclude, // Mengambil data relasi (author, article, dll)
    });

    if (!comment) {
      return NextResponse.json(
        { status: "error", message: "Komentar tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: "success",
      data: { comment: serializeComment(comment) },
    });
  } catch (error) {
    console.error("Comments GET error:", error);
    return NextResponse.json(
      { status: "error", message: "Terjadi kesalahan saat mengambil komentar." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth(request);
  if (authResult.error) {
    return NextResponse.json(
      { status: authResult.error.status, message: authResult.error.message },
      { status: authResult.error.statusCode }
    );
  }
  const { session } = authResult;

  const { id } = await params;
  const comment = await prisma.comment.findUnique({
    where: { id },
    include: commentInclude,
  });

  if (!comment || comment.userId !== session.user.id) {
    return NextResponse.json(
      { status: "error", message: "Komentar tidak ditemukan atau bukan milik Anda." },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();
    const { content }: { content?: string } = body ?? {};

    const validation = validateContent(content);
    if (!validation.ok) {
      return NextResponse.json(
        { status: "error", message: validation.message },
        { status: 400 }
      );
    }

    const updated = await prisma.comment.update({
      where: { id: comment.id },
      data: { content: validation.value },
      include: commentInclude,
    });

    return NextResponse.json({
      status: "success",
      message: "Komentar berhasil diperbarui.",
      data: { comment: serializeComment(updated) },
    });
  } catch (error) {
    console.error("Comments PATCH error:", error);
    return NextResponse.json(
      { status: "error", message: "Terjadi kesalahan saat mengubah komentar." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth(request);
  if (authResult.error) {
    return NextResponse.json(
      { status: authResult.error.status, message: authResult.error.message },
      { status: authResult.error.statusCode }
    );
  }
  const { session } = authResult;

  const { id } = await params;
  const comment = await prisma.comment.findUnique({
    where: { id },
    select: { id: true, userId: true },
  });

  if (!comment) {
    return NextResponse.json(
      { status: "error", message: "Komentar tidak ditemukan." },
      { status: 404 }
    );
  }

  const isOwner = comment.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    return NextResponse.json(
      { status: "error", message: "Anda tidak memiliki izin untuk menghapus komentar ini." },
      { status: 403 }
    );
  }

  await prisma.comment.delete({ where: { id: comment.id } });

  return NextResponse.json({
    status: "success",
    message: "Komentar berhasil dihapus.",
  });
}
