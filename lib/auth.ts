import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Adapter } from "next-auth/adapters";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,

  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true, // Auto-link jika email sama
    }),

    // Credentials Provider (Email/Password)
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password wajib diisi");
        }

        // Cari user berdasarkan email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });

        if (!user || !user.password) {
          throw new Error("Email atau password salah");
        }

        // Verifikasi password
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Email atau password salah");
        }

        // Return user object (akan disimpan di session)
        return {
          id: user.id,
          email: user.email,
          namaLengkap: user.namaLengkap,
          role: user.role,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt", // Menggunakan JWT untuk session
    maxAge: 30 * 24 * 60 * 60, // 30 hari
  },

  pages: {
    signIn: "/auth/login", // Custom login page
    error: "/auth/error", // Error page
    newUser: "/auth/welcome", // Redirect untuk new user (optional)
  },

  callbacks: {
    // Callback saat user login dengan Google
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        // Cek apakah user sudah ada di database
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          // Buat user baru untuk Google login
          await prisma.user.create({
            data: {
              email: user.email!,
              namaLengkap: user.name || "Google User",
              password: "", // Google user tidak punya password
              nomorHandphone: "", // Bisa diisi nanti
              role: "USER",
            },
          });
        }
      }

      return true; // Allow sign in
    },

    // Callback untuk JWT token
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role ?? "";
        token.email = user.email ?? "";
        token.name = user.name ?? "";
      }

      // Update session (e.g., after profile update)
      if (trigger === "update" && session) {
        token.name = session.name ?? "";
        token.email = session.email ?? "";
        token.name = session.name;
        token.email = session.email;
      }

      return token;
    },

    // Callback untuk session (data yang bisa diakses di client)
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }

      return session;
    },
  },

  events: {
    // Event saat user berhasil login
    async signIn({ user, account, isNewUser }) {
      console.log(`User ${user.email} logged in via ${account?.provider}`);
    },
  },

  debug: process.env.NODE_ENV === "development", // Enable debug di development
};
