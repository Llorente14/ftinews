import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

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
  const bookmark = await prisma.bookmark.findUnique({
    where: { id },
  });

  if (!bookmark || bookmark.userId !== session.user.id) {
    return NextResponse.json(
      { status: "error", message: "Bookmark tidak ditemukan." },
      { status: 404 }
    );
  }

  await prisma.bookmark.delete({ where: { id: bookmark.id } });

  return NextResponse.json({
    status: "success",
    message: "Bookmark berhasil dihapus.",
  });
}
