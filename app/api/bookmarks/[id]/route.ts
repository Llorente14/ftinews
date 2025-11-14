import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

function unauthenticatedResponse() {
  return NextResponse.json(
    { status: "error", message: "Silakan login terlebih dahulu." },
    { status: 401 }
  );
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return unauthenticatedResponse();

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
