import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendNewsletterConfirmation } from "@/lib/email/nodemailer";

function validateEmail(email?: string) {
  const normalized = email?.trim().toLowerCase();
  if (!normalized) {
    return { ok: false, message: "Email wajib diisi." } as const;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalized)) {
    return { ok: false, message: "Format email tidak valid." } as const;
  }
  return { ok: true, value: normalized } as const;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email }: { email?: string } = body ?? {};

    const validation = validateEmail(email);
    if (!validation.ok) {
      return NextResponse.json(
        { status: "error", message: validation.message },
        { status: 400 }
      );
    }

    const existing = await prisma.subscriber.findUnique({
      where: { email: validation.value },
    });

    if (existing) {
      return NextResponse.json({
        status: "success",
        message: "Email sudah terdaftar sebagai subscriber.",
        data: { subscriber: { id: existing.id, email: existing.email } },
      });
    }

    const subscriber = await prisma.subscriber.create({
      data: { email: validation.value },
      select: { id: true, email: true, createdAt: true },
    });

    // <--- PERBAIKAN DI SINI
    // Gunakan email yang sudah divalidasi (validation.value),
    // bukan 'email' mentah yang bisa jadi undefined.
    sendNewsletterConfirmation(validation.value).catch(console.error);

    return NextResponse.json(
      {
        status: "success",
        message: "Berhasil berlangganan newsletter.",
        data: { subscriber },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Subscribe POST error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Terjadi kesalahan saat memproses langganan.",
      },
      { status: 500 }
    );
  }
}
