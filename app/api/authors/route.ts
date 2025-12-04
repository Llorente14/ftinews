import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Ambil semua user yang memiliki artikel (authors)
    const authors = await prisma.user.findMany({
      where: {
        articles: {
          some: {}, // User yang memiliki minimal 1 artikel
        },
      },
      select: {
        id: true,
        namaLengkap: true,
        email: true,
        role: true,
        _count: {
          select: {
            articles: true, // Hitung jumlah artikel
          },
        },
      },
      orderBy: {
        namaLengkap: "asc", // Urutkan berdasarkan nama A-Z
      },
    });

    return NextResponse.json({
      status: "success",
      message: "Daftar author berhasil diambil.",
      data: {
        authors: authors.map((author) => ({
          id: author.id,
          namaLengkap: author.namaLengkap,
          email: author.email,
          role: author.role,
          articleCount: author._count.articles,
        })),
      },
    });
  } catch (error) {
    console.error("Authors GET error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Terjadi kesalahan saat mengambil daftar author.",
      },
      { status: 500 }
    );
  }
}

