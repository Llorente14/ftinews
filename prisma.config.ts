import { defineConfig, env } from "prisma/config";
import "dotenv/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
  // @ts-expect-error: Definisi tipe untuk properti 'seed' belum tersedia di versi config saat ini, tapi didukung oleh CLI.
  seed: {
    command: "npx tsx prisma/seed.ts",
  },
});
