import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";
import type { Prisma, Role } from "@/src/generated";

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

async function ensureAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) return { session: null, error: unauthenticatedResponse() };
  if (session.user.role !== "ADMIN") {
    return { session, error: forbiddenResponse() };
  }
  return { session, error: null };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await ensureAdmin();
  if (error || !session) return error ?? unauthenticatedResponse();

  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      namaLengkap: true,
      email: true,
      nomorHandphone: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: { articles: true, bookmarks: true, comments: true },
      },
    },
  });

  if (!user) {
    return NextResponse.json(
      { status: "error", message: "User tidak ditemukan." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    status: "success",
    message: "Detail user berhasil diambil.",
    data: { user },
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await ensureAdmin();
  if (error || !session) return error ?? unauthenticatedResponse();

  const { id } = await params;
  try {
    const body = await request.json();
    const {
      namaLengkap,
      nomorHandphone,
      role,
      password,
    }: {
      namaLengkap?: string;
      nomorHandphone?: string;
      role?: Role;
      password?: string;
    } = body ?? {};

    if (
      typeof namaLengkap === "undefined" &&
      typeof nomorHandphone === "undefined" &&
      typeof role === "undefined" &&
      typeof password === "undefined"
    ) {
      return NextResponse.json(
        { status: "error", message: "Tidak ada perubahan yang dikirim." },
        { status: 400 }
      );
    }

    if (role && !validateRole(role)) {
      return NextResponse.json(
        { status: "error", message: "Role tidak valid." },
        { status: 400 }
      );
    }

    if (session.user.id === id && role && role !== "ADMIN") {
      return NextResponse.json(
        {
          status: "error",
          message: "Anda tidak dapat menurunkan role diri sendiri dari ADMIN.",
        },
        { status: 400 }
      );
    }

    const data: Prisma.UserUncheckedUpdateInput = {};

    if (typeof namaLengkap !== "undefined") data.namaLengkap = namaLengkap;
    if (typeof nomorHandphone !== "undefined") {
      const existingPhone = await prisma.user.findFirst({
        where: {
          nomorHandphone,
          NOT: { id },
        },
      });

      if (existingPhone) {
        return NextResponse.json(
          { status: "error", message: "Nomor handphone sudah digunakan." },
          { status: 409 }
        );
      }
      data.nomorHandphone = nomorHandphone;
    }

    if (typeof role !== "undefined") data.role = role;

    if (typeof password !== "undefined") {
      if (!password || password.length < 8) {
        return NextResponse.json(
          {
            status: "error",
            message: "Password minimal 8 karakter.",
          },
          { status: 400 }
        );
      }
      data.password = await bcrypt.hash(password, 12);
    }

    const user = await prisma.user.update({
      where: { id },
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
      message: "User berhasil diperbarui.",
      data: { user },
    });
  } catch (err) {
    console.error("Update user error:", err);
    return NextResponse.json(
      { status: "error", message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await ensureAdmin();
  if (error || !session) return error ?? unauthenticatedResponse();

  const { id } = await params;
  if (session.user.id === id) {
    return NextResponse.json(
      { status: "error", message: "Anda tidak dapat menghapus akun sendiri." },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    return NextResponse.json(
      { status: "error", message: "User tidak ditemukan." },
      { status: 404 }
    );
  }

  await prisma.user.delete({ where: { id } });

  return NextResponse.json({
    status: "success",
    message: "User berhasil dihapus.",
  });
}
