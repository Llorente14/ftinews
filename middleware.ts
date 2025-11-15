import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Routes yang memerlukan authentication
const protectedRoutes = [
  "/admin",
  "/profile",
  "/bookmark",
  "/dashboard",
];

// Routes yang hanya bisa diakses oleh ADMIN
const adminOnlyRoutes = ["/admin"];

// Routes yang bisa diakses oleh ADMIN atau WRITER
const adminOrWriterRoutes = ["/dashboard"];

// Routes yang tidak boleh diakses jika sudah login (redirect ke home)
const guestOnlyRoutes = ["/login", "/registrasi"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token dari NextAuth
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;
  const userRole = token?.role as string | undefined;
  const userId = token?.sub || (token?.id as string | undefined);
  const userEmail = token?.email as string | undefined;
  const userName = token?.name as string | undefined;

  // Create response untuk menambahkan headers
  const response = NextResponse.next();

  // Add user info to headers if authenticated (for API routes to use)
  if (isAuthenticated && userId && userEmail && userName && userRole) {
    response.headers.set("x-user-id", userId);
    response.headers.set("x-user-email", userEmail);
    response.headers.set("x-user-name", userName);
    response.headers.set("x-user-role", userRole);
  }

  // 1. Check guest-only routes (login, register)
  // Jika sudah login, redirect ke home
  if (guestOnlyRoutes.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // 2. Check protected routes
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Jika belum login, redirect ke login
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 3. Check admin-only routes
    const isAdminOnlyRoute = adminOnlyRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isAdminOnlyRoute && userRole !== "ADMIN") {
      // Jika bukan admin, redirect ke home dengan pesan error
      return NextResponse.redirect(
        new URL("/?error=unauthorized", request.url)
      );
    }

    // 4. Check admin or writer routes
    const isAdminOrWriterRoute = adminOrWriterRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (
      isAdminOrWriterRoute &&
      userRole !== "ADMIN" &&
      userRole !== "WRITER"
    ) {
      // Jika bukan admin atau writer, redirect ke home
      return NextResponse.redirect(
        new URL("/?error=unauthorized", request.url)
      );
    }
  }

  // 5. Check API routes protection
  if (pathname.startsWith("/api")) {
    // Skip NextAuth API routes
    if (pathname.startsWith("/api/auth")) {
      return response;
    }

    // API routes yang memerlukan authentication
    const protectedApiRoutes = [
      "/api/bookmarks",
      "/api/comments",
      "/api/users/me",
      "/api/dashboard",
      "/api/admin",
    ];

    const isProtectedApiRoute = protectedApiRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isProtectedApiRoute) {
      // Jika belum login, return 401
      if (!isAuthenticated) {
        return NextResponse.json(
          { status: "error", message: "Unauthorized. Please login first." },
          { status: 401 }
        );
      }

      // Check admin-only API routes
      const adminOnlyApiRoutes = ["/api/admin"];

      const isAdminOnlyApiRoute = adminOnlyApiRoutes.some((route) =>
        pathname.startsWith(route)
      );

      if (isAdminOnlyApiRoute && userRole !== "ADMIN") {
        return NextResponse.json(
          { status: "error", message: "Forbidden. Admin access required." },
          { status: 403 }
        );
      }

      // Check admin or writer API routes
      const adminOrWriterApiRoutes = ["/api/dashboard"];

      const isAdminOrWriterApiRoute = adminOrWriterApiRoutes.some((route) =>
        pathname.startsWith(route)
      );

      if (
        isAdminOrWriterApiRoute &&
        userRole !== "ADMIN" &&
        userRole !== "WRITER"
      ) {
        return NextResponse.json(
          {
            status: "error",
            message: "Forbidden. Admin or Writer access required.",
          },
          { status: 403 }
        );
      }
    }
  }

  // Allow request to proceed with headers
  return response;
}

// Configure which routes should be processed by middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (public assets)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

