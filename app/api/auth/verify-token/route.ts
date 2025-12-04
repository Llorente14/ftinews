import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Pastikan path ini benar
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { email, token } = await request.json();

    if (!email || !token) {
      return NextResponse.json(
        { status: "error", message: "Email dan token harus diisi" },
        { status: 400 }
      );
    }

    // 1. Cari user berdasarkan EMAIL
    const user = await prisma.user.findFirst({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json(
        { status: "error", message: "Token tidak valid" },
        { status: 400 }
      );
    }

    // 2. Cek token dan expiry
    if (
      !user.resetToken ||
      !user.resetTokenExpiry ||
      user.resetTokenExpiry < new Date()
    ) {
      return NextResponse.json(
        { status: "error", message: "Token tidak valid atau sudah kadaluarsa" },
        { status: 400 }
      );
    }

    // 3. Validasi token menggunakan bcrypt.compare
    const isTokenValid = await bcrypt.compare(token, user.resetToken);

    if (!isTokenValid) {
      return NextResponse.json(
        { status: "error", message: "Token salah" },
        { status: 400 }
      );
    }

    // 4. Sukses! Kirim respon sukses
    return NextResponse.json({
      status: "success",
      message: "Token berhasil diverifikasi.",
    });

  } catch (error) {
    console.error("Verify token error:", error);
    return NextResponse.json(
      { status: "error", message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}