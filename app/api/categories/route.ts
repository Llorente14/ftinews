import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Get all articles with their categories
    const articles = await prisma.article.findMany({
      where: {
        category: {
          not: null,
        },
      },
      select: {
        category: true,
      },
    });

    // Count categories
    const categoryCounts: Record<string, number> = {};

    articles.forEach((article) => {
      if (article.category) {
        categoryCounts[article.category] =
          (categoryCounts[article.category] || 0) + 1;
      }
    });

    // Convert to array and sort by count (descending)
    const categories = Object.entries(categoryCounts)
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({
      status: "success",
      message: "Daftar kategori berhasil diambil.",
      data: {
        categories,
      },
    });
  } catch (error) {
    console.error("Categories GET error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Terjadi kesalahan saat mengambil kategori.",
      },
      { status: 500 }
    );
  }
}
