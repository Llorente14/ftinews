import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; 
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { sendPasswordResetTokenEmail } from "@/lib/email/nodemailer"; // Pastikan path ini benar

// Fungsi untuk generate token 6-digit
function generateNumericToken() {
  return crypto.randomInt(100000, 999999).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { status: "error", message: "Email tidak boleh kosong" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Selalu kirim respon sukses untuk keamanan
    if (!user) {
      console.log(`Permintaan reset (gagal): Email ${email} tidak ditemukan.`);
      return NextResponse.json({
        status: "success",
        message:
          "Jika email Anda terdaftar, kami telah mengirimkan kode reset.",
      });
    }

    // 1. Generate kode 6-digit
    const resetToken = generateNumericToken(); 
    
    // 2. Hash kode ini untuk disimpan di database
    const hashedToken = await bcrypt.hash(resetToken, 10);

    // 3. Token berlaku selama 10 menit
    const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 menit

    // 4. Simpan token ke database
    await prisma.user.update({
      where: { email },
      data: {
        resetToken: hashedToken,
        resetTokenExpiry,
      },
    });

    // 5. Kirim email dengan KODE ASLI 6-digit
    const emailResult = await sendPasswordResetTokenEmail(
      user.email,
      user.namaLengkap,
      resetToken // Kirim kode 6-digit asli
    );

    if (!emailResult.success) {
      console.error("Gagal mengirim email kode reset:", emailResult.error);
      return NextResponse.json(
        { status: "error", message: "Gagal mengirim email. Coba lagi." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "success",
      message:
        "Jika email Anda terdaftar, kami telah mengirimkan kode reset.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { status: "error", message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}