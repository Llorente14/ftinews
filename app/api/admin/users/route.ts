import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";
import type { Role } from "@/src/generated";

function unauthenticatedResponse() {
  return NextResponse.json(
    { status: "error", message: "Silakan login terlebih dahulu." },
    { status: 401 }
  );
}

function forbiddenResponse() {
  return NextResponse.json(
    {
      status: "error",
      message: "Hanya admin yang dapat mengakses endpoint ini.",
    },
    { status: 403 }
  );
}

function validateRole(role?: string): role is Role {
  return role === "USER" || role === "WRITER" || role === "ADMIN";
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return unauthenticatedResponse();
  }

  if (session.user.role !== "ADMIN") {
    return forbiddenResponse();
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      namaLengkap: true,
      email: true,
      nomorHandphone: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: { articles: true, comments: true, bookmarks: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    status: "success",
    message: "Daftar user berhasil diambil.",
    data: { users },
  });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return unauthenticatedResponse();
  }

  if (session.user.role !== "ADMIN") {
    return forbiddenResponse();
  }

  try {
    const body = await request.json();
    const {
      namaLengkap,
      email,
      nomorHandphone,
      password,
      role,
    }: {
      namaLengkap?: string;
      email?: string;
      nomorHandphone?: string;
      password?: string;
      role?: Role;
    } = body ?? {};

    if (!namaLengkap || !email || !nomorHandphone || !password) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Nama lengkap, email, nomor handphone, dan password wajib diisi.",
        },
        { status: 400 }
      );
    }

    if (role && !validateRole(role)) {
      return NextResponse.json(
        {
          status: "error",
          message: "Role tidak valid. Gunakan USER, WRITER, atau ADMIN.",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();

    const [existingEmail, existingPhone] = await Promise.all([
      prisma.user.findUnique({ where: { email: normalizedEmail } }),
      prisma.user.findUnique({ where: { nomorHandphone } }),
    ]);

    if (existingEmail) {
      return NextResponse.json(
        { status: "error", message: "Email sudah digunakan." },
        { status: 409 }
      );
    }

    if (existingPhone) {
      return NextResponse.json(
        { status: "error", message: "Nomor handphone sudah digunakan." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        namaLengkap,
        email: normalizedEmail,
        nomorHandphone,
        password: hashedPassword,
        role: role ?? "USER",
      },
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

    return NextResponse.json(
      {
        status: "success",
        message: "User baru berhasil dibuat.",
        data: { user },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { status: "error", message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
