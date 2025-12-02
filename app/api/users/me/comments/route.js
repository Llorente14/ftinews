import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth"; // Sesuaikan path auth helper kamu

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Ambil komentar milik user yang sedang login
    const comments = await prisma.comment.findMany({
      where: {
        author: { email: session.user.email }, // Filter berdasarkan email user
      },
      include: {
        article: {
          select: { title: true, slug: true }, // Ambil judul & slug artikel terkait
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ status: "success", data: comments });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Error fetching comments" },
      { status: 500 }
    );
  }
}
