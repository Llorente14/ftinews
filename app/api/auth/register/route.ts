// File: app/api/auth/register/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { sendWelcomeEmail } from "@/lib/email/nodemailer";

/**
 * POST /api/auth/register
 *
 * Register new user dengan validasi lengkap + welcome email
 */

// ============================================
// VALIDATION SCHEMA
// ============================================

const registerSchema = z.object({
  namaLengkap: z
    .string()
    .min(3, "Nama lengkap minimal 3 karakter")
    .max(100, "Nama lengkap maksimal 100 karakter")
    .regex(/^[a-zA-Z\s]+$/, "Nama hanya boleh berisi huruf dan spasi"),

  email: z
    .string()
    .email("Format email tidak valid")
    .toLowerCase()
    .transform((email) => email.trim()),

  nomorHandphone: z
    .string()
    .regex(/^(\+62|62|0)[0-9]{9,12}$/, "Format nomor handphone tidak valid")
    .transform((phone) => {
      // Normalize phone number to 08xxx format
      if (phone.startsWith("+62")) {
        return "0" + phone.slice(3);
      } else if (phone.startsWith("62")) {
        return "0" + phone.slice(2);
      }
      return phone;
    }),

  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .max(100, "Password maksimal 100 karakter")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password harus mengandung huruf besar, huruf kecil, dan angka"
    ),
});

// ============================================
// TYPE DEFINITIONS
// ============================================

interface RegisterSuccessResponse {
  success: true;
  data: {
    user: {
      id: string;
      namaLengkap: string;
      email: string;
      nomorHandphone: string;
      role: string;
      createdAt: string;
    };
  };
  message: string;
}

interface RegisterErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

type RegisterResponse = RegisterSuccessResponse | RegisterErrorResponse;

// ============================================
// ERROR CODES
// ============================================

const ERROR_CODES = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  EMAIL_EXISTS: "EMAIL_EXISTS",
  PHONE_EXISTS: "PHONE_EXISTS",
  INTERNAL_ERROR: "INTERNAL_SERVER_ERROR",
} as const;

// ============================================
// MAIN HANDLER
// ============================================

export async function POST(
  request: NextRequest
): Promise<NextResponse<RegisterResponse>> {
  try {
    // 1. Parse request body
    const body = await request.json();

    // 2. Validate input
    const validationResult = registerSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ERROR_CODES.VALIDATION_ERROR,
            message: "Data tidak valid",
            details: validationResult.error.flatten().fieldErrors,
          },
        },
        { status: 400 }
      );
    }

    const { namaLengkap, email, nomorHandphone, password } =
      validationResult.data;

    // 3. Check if email or phone already exists (parallel queries)
    const [existingEmail, existingPhone] = await Promise.all([
      prisma.user.findUnique({
        where: { email },
        select: { id: true },
      }),
      prisma.user.findUnique({
        where: { nomorHandphone },
        select: { id: true },
      }),
    ]);

    // 4. Handle duplicate email
    if (existingEmail) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ERROR_CODES.EMAIL_EXISTS,
            message:
              "Email sudah terdaftar. Silakan gunakan email lain atau login.",
          },
        },
        { status: 409 }
      );
    }

    // 5. Handle duplicate phone
    if (existingPhone) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ERROR_CODES.PHONE_EXISTS,
            message:
              "Nomor handphone sudah terdaftar. Silakan gunakan nomor lain.",
          },
        },
        { status: 409 }
      );
    }

    // 6. Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 7. Create user
    const user = await prisma.user.create({
      data: {
        namaLengkap,
        email,
        nomorHandphone,
        password: hashedPassword,
        role: "USER",
      },
      select: {
        id: true,
        namaLengkap: true,
        email: true,
        nomorHandphone: true,
        role: true,
        createdAt: true,
      },
    });

    // 8. Send welcome email (fire and forget - don't block response)
    sendWelcomeEmail(user.email, user.namaLengkap).catch((error) => {
      console.error("[Register] Failed to send welcome email:", error);
      // Don't fail registration if email fails
    });

    // 9. Log registration event (optional analytics)
    logRegistrationEvent(user.id, {
      email: user.email,
      role: user.role,
      registeredAt: user.createdAt,
    }).catch(console.error);

    // 10. Return success response
    return NextResponse.json(
      {
        success: true,
        data: {
          user: {
            ...user,
            createdAt: user.createdAt.toISOString(),
          },
        },
        message:
          "Registrasi berhasil! Cek email Anda untuk informasi lebih lanjut.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/auth/register] Error:", error);

    // Handle Prisma errors
    if (error && typeof error === "object" && "code" in error) {
      const prismaError = error as { code: string };

      // P2002: Unique constraint violation (shouldn't happen due to checks above)
      if (prismaError.code === "P2002") {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: ERROR_CODES.EMAIL_EXISTS,
              message: "Email atau nomor handphone sudah terdaftar.",
            },
          },
          { status: 409 }
        );
      }
    }

    // Generic error
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
// HELPER FUNCTIONS
// ============================================

/**
 * Log registration event for analytics
 */
async function logRegistrationEvent(
  userId: string,
  metadata: {
    email: string;
    role: string;
    registeredAt: Date;
  }
) {
  // TODO: Send to analytics service (Google Analytics, Mixpanel, etc.)
  console.log("[Analytics] User registered:", {
    userId,
    ...metadata,
    timestamp: new Date().toISOString(),
  });

  // Example: Send to external analytics
  // await fetch("https://analytics.example.com/events", {
  //   method: "POST",
  //   body: JSON.stringify({
  //     event: "user_registered",
  //     userId,
  //     ...metadata,
  //   }),
  // });
}
