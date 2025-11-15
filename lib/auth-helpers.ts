import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { authOptions } from "@/lib/auth";

/**
 * Get session from request
 * This function tries multiple methods to get the session:
 * 1. From request headers (set by middleware)
 * 2. From getServerSession (for browser cookies)
 * 3. From JWT token (for API clients)
 */
export async function getSessionFromRequest(
  request: NextRequest
): Promise<{
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
} | null> {
  // Try to get from headers (set by middleware)
  const userId = request.headers.get("x-user-id");
  const userEmail = request.headers.get("x-user-email");
  const userName = request.headers.get("x-user-name");
  const userRole = request.headers.get("x-user-role");

  if (userId && userEmail && userName && userRole) {
    return {
      user: {
        id: userId,
        email: userEmail,
        name: userName,
        role: userRole,
      },
    };
  }

  // Fallback: Try getServerSession (for browser cookies)
  try {
    const session = await getServerSession(authOptions);
    if (session?.user) return session;
  } catch (err) {
    console.error("getServerSession error:", err);
  }

  // Fallback: Try JWT token from cookies or Authorization header
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (token) {
      return {
        user: {
          id: (token.sub || token.id) as string,
          email: token.email as string,
          name: token.name as string,
          role: token.role as string,
        },
      };
    }
  } catch (err) {
    console.error("getToken error:", err);
  }

  return null;
}

/**
 * Check if user is authenticated
 */
export async function requireAuth(request: NextRequest) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return {
      session: null,
      error: {
        status: "error",
        message: "Silakan login terlebih dahulu.",
        statusCode: 401,
      },
    };
  }

  return { session, error: null };
}

/**
 * Check if user is admin
 */
export async function requireAdmin(request: NextRequest) {
  const authResult = await requireAuth(request);

  if (authResult.error) {
    return authResult;
  }

  const { session } = authResult;

  if (session.user.role !== "ADMIN") {
    return {
      session,
      error: {
        status: "error",
        message: "Hanya admin yang dapat mengakses endpoint ini.",
        statusCode: 403,
      },
    };
  }

  return { session, error: null };
}

/**
 * Check if user is admin or writer
 */
export async function requireAdminOrWriter(request: NextRequest) {
  const authResult = await requireAuth(request);

  if (authResult.error) {
    return authResult;
  }

  const { session } = authResult;

  if (session.user.role !== "ADMIN" && session.user.role !== "WRITER") {
    return {
      session,
      error: {
        status: "error",
        message: "Hanya admin atau writer yang dapat mengakses endpoint ini.",
        statusCode: 403,
      },
    };
  }

  return { session, error: null };
}

