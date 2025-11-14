import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { articleInclude, serializeArticle } from "../_helpers";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const article = await prisma.article.findUnique({
      where: { slug },
      include: articleInclude,
    });

    if (!article) {
      return NextResponse.json(
        { status: "error", message: "Artikel tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: "success",
      message: "Detail artikel berhasil diambil.",
      data: { article: serializeArticle(article) },
    });
  } catch (error) {
    console.error("Article detail GET error:", error);
    return NextResponse.json(
      { status: "error", message: "Terjadi kesalahan saat mengambil artikel." },
      { status: 500 }
    );
  }
}
