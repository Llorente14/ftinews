// File: lib/prisma.ts

import { PrismaClient } from "@prisma/client";

// Deklarasikan 'prisma' pada objek global NodeJS
declare global {
  var prisma: PrismaClient | undefined;
}

// Cek jika 'prisma' sudah ada di global, jika tidak, buat baru.
// Ini mencegah pembuatan instance PrismaClient baru setiap kali
// ada hot-reload di Next.js (mode development).
const client = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = client;
}

export default client;
