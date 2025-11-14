import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

function unauthenticated() {
  return NextResponse.json(
    { status: "error", message: "Silakan login terlebih dahulu." },
    { status: 401 }
  );
}

function validateUpdatePayload(body: unknown) {
  const payload = body as {
    namaLengkap?: string;
    nomorHandphone?: string;
    password?: string;
  };

  const updates: {
    namaLengkap?: string;
    nomorHandphone?: string;
    password?: string;
  } = {};

  if (typeof payload.namaLengkap !== "undefined") {
    const trimmed = payload.namaLengkap?.trim();
    if (!trimmed) {
      return { ok: false, message: "Nama lengkap tidak boleh kosong." } as const;
    }
    if (trimmed.length > 120) {
      return { ok: false, message: "Nama lengkap maksimal 120 karakter." } as const;
    }
    updates.namaLengkap = trimmed;
  }

  if (typeof payload.nomorHandphone !== "undefined") {
    const trimmed = payload.nomorHandphone?.trim();
    if (!trimmed) {
      return { ok: false, message: "Nomor handphone tidak boleh kosong." } as const;
    }
    if (!/^\+?[0-9]{9,15}$/.test(trimmed)) {
      return {
        ok: false,
        message: "Nomor handphone harus berisi 9-15 digit dan boleh diawali '+'.",
      } as const;
    }
    updates.nomorHandphone = trimmed;
  }

  if (typeof payload.password !== "undefined") {
    const pwd = payload.password ?? "";
    if (pwd.length < 8) {
      return { ok: false, message: "Password minimal 8 karakter." } as const;
    }
    if (pwd.length > 64) {
      return { ok: false, message: "Password maksimal 64 karakter." } as const;
    }
    updates.password = pwd;
  }

  if (!Object.keys(updates).length) {
    return { ok: false, message: "Tidak ada perubahan yang dikirim." } as const;
  }

  return { ok: true, value: updates } as const;
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return unauthenticated();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      namaLengkap: true,
      email: true,
      nomorHandphone: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { status: "error", message: "Akun tidak ditemukan." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    status: "success",
    message: "Profil berhasil diambil.",
    data: { user },
  });
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return unauthenticated();

  try {
    const body = await request.json();
    const validation = validateUpdatePayload(body);

    if (!validation.ok) {
      return NextResponse.json(
        { status: "error", message: validation.message },
        { status: 400 }
      );
    }

    const updates = validation.value;
    const data: Parameters<typeof prisma.user.update>[0]["data"] = {};

    if (updates.namaLengkap) {
      data.namaLengkap = updates.namaLengkap;
    }

    if (updates.nomorHandphone) {
      const existingPhone = await prisma.user.findFirst({
        where: {
          nomorHandphone: updates.nomorHandphone,
          NOT: { id: session.user.id },
        },
        select: { id: true },
      });

      if (existingPhone) {
        return NextResponse.json(
          { status: "error", message: "Nomor handphone sudah digunakan." },
          { status: 409 }
        );
      }

      data.nomorHandphone = updates.nomorHandphone;
    }

    if (updates.password) {
      data.password = await bcrypt.hash(updates.password, 12);
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data,
      select: {
        id: true,
        namaLengkap: true,
        email: true,
        nomorHandphone: true,
        role: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      status: "success",
      message: "Profil berhasil diperbarui.",
      data: { user },
    });
  } catch (error) {
    console.error("Profile PATCH error:", error);
    return NextResponse.json(
      { status: "error", message: "Terjadi kesalahan saat memperbarui profil." },
      { status: 500 }
    );
  }
}

