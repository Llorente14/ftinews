import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker/locale/id_ID"; // Menggunakan data bahasa Indonesia

const prisma = new PrismaClient();

// ID admin yang Anda berikan
const ADMIN_USER_ID = "cmhxkn6gq0000ii5sjywv6z39";

async function main() {
  console.log("🌱 Memulai proses seeding...");

  // 1. Seed Admin User (Idempotent)
  const hashedPassword = await bcrypt.hash("12345678", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: {},
    create: {
      id: ADMIN_USER_ID, // Tentukan ID di sini agar konsisten
      email: "admin@test.com",
      namaLengkap: "Super Administrator",
      nomorHandphone: "081200000000",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log(`👤 Admin user created/found: ${admin.email}`);

  // 2. Seed Articles
  console.log(`📰 Membuat 20 artikel acak...`);
  const categories = [
    "Teknologi",
    "Olahraga",
    "Gaya Hidup",
    "Ekonomi",
    "Internasional",
  ];

  for (let i = 0; i < 20; i++) {
    const title = faker.lorem.sentence({ min: 5, max: 10 });
    const slug = faker.helpers.slugify(title).toLowerCase();

    // Pastikan admin sudah ada sebelum membuat artikel
    if (!admin.id) {
      console.error(
        "Admin user ID tidak ditemukan, seeding artikel dibatalkan."
      );
      return;
    }

    const article = await prisma.article.upsert({
      where: { slug: slug }, // Kunci unik untuk idempotency
      update: {}, // Jangan perbarui jika sudah ada
      create: {
        title: title,
        slug: slug,
        description: faker.lorem.paragraph(2),
        content: faker.lorem.paragraphs(10, "<br/><br/>"), // Konten HTML
        imageUrl: faker.image.urlLoremFlickr({
          category: "business,news,technology,sports", // Kategori gambar
          width: 1280,
          height: 720,
        }),
        sourceLink: faker.internet.url(),
        publishedAt: faker.date.past({ years: 1 }), // Tanggal terbit acak dalam 1 tahun terakhir
        category: faker.helpers.arrayElement(categories),
        authorId: admin.id, // Gunakan ID admin yang sudah ada
      },
    });

    console.log(`📄 Artikel dibuat/ditemukan: ${article.title}`);
  }

  console.log("✅ Seeding selesai.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Terjadi error saat seeding:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
