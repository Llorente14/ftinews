import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Pastikan path ini benar
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { email, token, password } = await request.json();

    if (!email || !token || !password) {
      return NextResponse.json(
        { status: "error", message: "Email, token, dan password harus diisi" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { status: "error", message: "Password minimal 8 karakter" },
        { status: 400 }
      );
    }

    // 1. Cari user berdasarkan EMAIL
    const user = await prisma.user.findFirst({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json(
        { status: "error", message: "Link tidak valid" },
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
        { status: "error", message: "Token salah atau tidak valid" },
        { status: 400 }
      );
    }

    // 4. Token valid! Hash password baru
    const hashedPassword = await bcrypt.hash(password, 12);

    // 5. Update password user dan HAPUS token reset
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({
      status: "success",
      message: "Password berhasil direset. Silakan login.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { status: "error", message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}