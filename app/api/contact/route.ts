// File: app/api/contact/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import {
  sendContactNotification,
  sendContactConfirmation,
} from "@/lib/email/nodemailer";

/**
 * POST /api/contact
 *
 * Handle contact form submissions with email notifications
 *
 * @example
 * // Request
 * POST /api/contact
 * {
 *   "nama": "John Doe",
 *   "email": "john@example.com",
 *   "subjek": "Pertanyaan tentang artikel",
 *   "isiPesan": "Saya ingin bertanya tentang..."
 * }
 *
 * // Success Response (201)
 * {
 *   "success": true,
 *   "data": {
 *     "contact": {
 *       "id": "clx123",
 *       "nama": "John Doe",
 *       "email": "john@example.com",
 *       "subjek": "Pertanyaan tentang artikel",
 *       "isiPesan": "Saya ingin bertanya tentang...",
 *       "createdAt": "2024-11-14T10:00:00.000Z"
 *     }
 *   },
 *   "message": "Pesan berhasil dikirim! Kami akan segera menghubungi Anda."
 * }
 *
 * // Error Response (400)
 * {
 *   "success": false,
 *   "error": {
 *     "code": "VALIDATION_ERROR",
 *     "message": "Data tidak valid",
 *     "details": {
 *       "nama": ["Nama wajib diisi"],
 *       "email": ["Format email tidak valid"]
 *     }
 *   }
 * }
 */

// ============================================
// VALIDATION SCHEMA
// ============================================

const contactSchema = z.object({
  nama: z
    .string()
    .min(1, "Nama wajib diisi")
    .max(100, "Nama maksimal 100 karakter")
    .trim()
    .refine((val) => val.length >= 3, "Nama minimal 3 karakter"),

  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid")
    .toLowerCase()
    .trim(),

  subjek: z
    .string()
    .min(3, "Subjek minimal 3 karakter")
    .max(150, "Subjek maksimal 150 karakter")
    .trim(),

  isiPesan: z
    .string()
    .min(10, "Pesan minimal 10 karakter")
    .max(2000, "Pesan maksimal 2000 karakter")
    .trim(),
});

// ============================================
// TYPE DEFINITIONS
// ============================================

interface ContactSuccessResponse {
  success: true;
  data: {
    contact: {
      id: string;
      nama: string;
      email: string;
      subjek: string;
      isiPesan: string;
      createdAt: string;
    };
  };
  message: string;
}

interface ContactErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

type ContactResponse = ContactSuccessResponse | ContactErrorResponse;

// ============================================
// ERROR CODES
// ============================================

const ERROR_CODES = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INTERNAL_ERROR: "INTERNAL_SERVER_ERROR",
  DATABASE_ERROR: "DATABASE_ERROR",
} as const;

// ============================================
// MAIN HANDLER
// ============================================

export async function POST(
  request: NextRequest
): Promise<NextResponse<ContactResponse>> {
  try {
    // 1. Parse request body
    const body = await request.json();

    // 2. Validate input with Zod
    const validationResult = contactSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ERROR_CODES.VALIDATION_ERROR,
            message: "Data tidak valid. Periksa kembali input Anda.",
            details: validationResult.error.flatten().fieldErrors,
          },
        },
        { status: 400 }
      );
    }

    const { nama, email, subjek, isiPesan } = validationResult.data;

    // 3. Save contact submission to database
    const contact = await prisma.contactSubmission.create({
      data: {
        nama,
        email,
        subjek,
        isiPesan,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        subjek: true,
        isiPesan: true,
        createdAt: true,
      },
    });

    // 4. Send notification email to ADMIN (fire and forget)
    // Email ini berisi detail lengkap pesan untuk admin
    sendContactNotification({
      nama: contact.nama,
      email: contact.email,
      subjek: contact.subjek,
      isiPesan: contact.isiPesan,
    }).catch((error) => {
      console.error("[Contact API] Failed to send admin notification:", error);
      // Don't fail the request if email fails
    });

    // 5. Send confirmation email to USER (fire and forget)
    // Email ini konfirmasi ke user bahwa pesan sudah diterima
    sendContactConfirmation({
      nama: contact.nama,
      email: contact.email,
      subjek: contact.subjek,
      isiPesan: contact.isiPesan,
    }).catch((error: unknown) => {
      console.error("[Contact API] Failed to send user confirmation:", error);
      // Don't fail the request if email fails
    });

    // 6. Return success response
    return NextResponse.json(
      {
        success: true,
        data: {
          contact: {
            ...contact,
            createdAt: contact.createdAt.toISOString(),
          },
        },
        message:
          "Pesan berhasil dikirim! Kami akan menghubungi Anda dalam 1-2 hari kerja.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/contact] Error:", error);

    // Handle Prisma-specific errors
    if (error && typeof error === "object" && "code" in error) {
      const prismaError = error as { code: string; meta?: unknown };

      console.error("Prisma error details:", {
        code: prismaError.code,
        meta: prismaError.meta,
      });

      return NextResponse.json(
        {
          success: false,
          error: {
            code: ERROR_CODES.DATABASE_ERROR,
            message:
              "Terjadi kesalahan saat menyimpan pesan. Silakan coba lagi.",
          },
        },
        { status: 500 }
      );
    }

    // Generic server error
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ERROR_CODES.INTERNAL_ERROR,
          message: "Terjadi kesalahan pada server. Silakan coba lagi nanti.",
        },
      },
      { status: 500 }
    );
  }
}

// ============================================
// Optional: GET endpoint to retrieve submissions (admin only)
// ============================================

/**
 * GET /api/contact
 *
 * Retrieve all contact submissions (Admin only)
 * Note: Implement authentication middleware first
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check here
    // const session = await getServerSession();
    // if (!session || session.user.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [contacts, total] = await Promise.all([
      prisma.contactSubmission.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.contactSubmission.count(),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          contacts: contacts.map((c) => ({
            ...c,
            createdAt: c.createdAt.toISOString(),
          })),
        },
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET /api/contact] Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: ERROR_CODES.INTERNAL_ERROR,
          message: "Terjadi kesalahan saat mengambil data.",
        },
      },
      { status: 500 }
    );
  }
}
