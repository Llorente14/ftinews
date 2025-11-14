// File: app/api/users/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // 1. Cari user berdasarkan ID
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        // PENTING: Hanya pilih field yang aman untuk publik
        id: true,
        namaLengkap: true,
        email: true, // Opsional: boleh ditampilkan atau tidak
        role: true,
        createdAt: true,
        // Ambil juga artikel yang ditulis oleh user ini
        articles: {
          select: {
            id: true,
            title: true,
            slug: true,
            publishedAt: true,
            imageUrl: true,
            description: true,
          },
          orderBy: { createdAt: "desc" }, // Urutkan dari berita terbaru
        },
        _count: {
          select: { articles: true }, // Hitung total artikel
        },
      },
    });

    // 2. Jika user tidak ditemukan
    if (!user) {
      return NextResponse.json(
        { status: "error", message: "User tidak ditemukan." },
        { status: 404 }
      );
    }

    // 3. Return data
    return NextResponse.json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { status: "error", message: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
