import dotenv from "dotenv";
import path from "path";

// 1. Load env dulu
dotenv.config({ path: path.resolve(__dirname, ".env") });

console.log("🔍 Checking environment variables...");
console.log("SMTP_USER:", process.env.SMTP_USER);

// 2. Gunakan async function untuk import library SETELAH env ter-load
async function main() {
  // Import dinamis (ini kuncinya!)
  const { sendWelcomeEmail } = await import("./lib/email/nodemailer");

  console.log("📧 Mengirim test email...");

  try {
    await sendWelcomeEmail("ftinews.untar@gmail.com", "Test User"); // Ganti email tujuan jika perlu
    console.log("✅ Email berhasil dikirim!");
  } catch (error) {
    console.error("❌ Gagal mengirim email:", error);
  }
}

main();
