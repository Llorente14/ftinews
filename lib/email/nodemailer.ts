// ============================================
// File: lib/email/nodemailer.ts
// ============================================

import * as nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

// ============================================
// TYPES
// ============================================

interface EmailResult {
  success: boolean;
  data?: { messageId: string };
  error?: unknown;
}

interface ContactFormData {
  nama: string;
  email: string;
  subjek: string;
  isiPesan: string;
}

// ============================================
// CONFIGURATION
// ============================================

const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
} as const;

const EMAIL_CONFIG = {
  from: process.env.EMAIL_FROM || "FTI News <noreply@ftinews.com>",
  replyTo: process.env.EMAIL_REPLY_TO || "support@ftinews.com",
  adminEmail: process.env.ADMIN_EMAIL || "admin@ftinews.com",
} as const;

// ============================================
// TRANSPORTER
// ============================================

let transporter: Transporter | null = null;

/**
 * Get or create nodemailer transporter (singleton pattern)
 */
function getTransporter(): Transporter {
  if (!transporter) {
    // Validate credentials
    if (!SMTP_CONFIG.auth.user || !SMTP_CONFIG.auth.pass) {
      throw new Error(
        "SMTP credentials missing. Please set SMTP_USER and SMTP_PASSWORD environment variables."
      );
    }

    transporter = nodemailer.createTransport(SMTP_CONFIG);

    // Log configuration (without sensitive data)
    console.log("📧 Email transporter initialized:", {
      host: SMTP_CONFIG.host,
      port: SMTP_CONFIG.port,
      secure: SMTP_CONFIG.secure,
      user: SMTP_CONFIG.auth.user,
    });
  }

  return transporter;
}

// ============================================
// EMAIL SENDING FUNCTIONS
// ============================================

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(
  email: string,
  name: string
): Promise<EmailResult> {
  try {
    const transporter = getTransporter();

    const info = await transporter.sendMail({
      from: EMAIL_CONFIG.from,
      to: email,
      subject: "Selamat Datang di FTI News! 🎉",
      html: getWelcomeEmailTemplate(name),
    });

    console.log("✅ Welcome email sent:", info.messageId);
    return { success: true, data: { messageId: info.messageId } };
  } catch (error) {
    console.error("❌ Error sending welcome email:", error);
    return { success: false, error };
  }
}

/**
 * Send password reset token email (6-digit code)
 */
export async function sendPasswordResetTokenEmail(
  email: string,
  name: string,
  token: string
): Promise<EmailResult> {
  try {
    const transporter = getTransporter();

    const info = await transporter.sendMail({
      from: EMAIL_CONFIG.from,
      to: email,
      subject: "Kode Reset Password - FTI News",
      html: getPasswordResetTokenTemplate(name, token),
    });

    console.log("✅ Password reset email sent:", info.messageId);
    return { success: true, data: { messageId: info.messageId } };
  } catch (error) {
    console.error("❌ Error sending password reset email:", error);
    return { success: false, error };
  }
}

/**
 * Send contact form notification to admin
 */
export async function sendContactNotification(
  data: ContactFormData
): Promise<EmailResult> {
  try {
    const transporter = getTransporter();

    const info = await transporter.sendMail({
      from: EMAIL_CONFIG.from,
      to: EMAIL_CONFIG.adminEmail,
      replyTo: data.email,
      subject: `Pesan Kontak: ${data.subjek}`,
      html: getContactNotificationTemplate(data),
    });

    console.log("✅ Contact notification sent:", info.messageId);
    return { success: true, data: { messageId: info.messageId } };
  } catch (error) {
    console.error("❌ Error sending contact notification:", error);
    return { success: false, error };
  }
}

/**
 * Send contact confirmation to sender
 */
export async function sendContactConfirmation(
  data: ContactFormData
): Promise<EmailResult> {
  try {
    const transporter = getTransporter();

    const info = await transporter.sendMail({
      from: EMAIL_CONFIG.from,
      to: data.email,
      subject: `Terima kasih, ${data.nama}! Pesan Anda sudah kami terima.`,
      html: getContactConfirmationTemplate(data),
    });

    console.log("✅ Contact confirmation sent:", info.messageId);
    return { success: true, data: { messageId: info.messageId } };
  } catch (error) {
    console.error("❌ Error sending contact confirmation:", error);
    return { success: false, error };
  }
}

/**
 * Send newsletter confirmation email
 */
export async function sendNewsletterConfirmation(
  email: string
): Promise<EmailResult> {
  try {
    const transporter = getTransporter();

    const info = await transporter.sendMail({
      from: EMAIL_CONFIG.from,
      to: email,
      subject: "Terima Kasih Telah Berlangganan Newsletter FTI News! 📧",
      html: getNewsletterConfirmationTemplate(email),
    });

    console.log("✅ Newsletter confirmation sent:", info.messageId);
    return { success: true, data: { messageId: info.messageId } };
  } catch (error) {
    console.error("❌ Error sending newsletter confirmation:", error);
    return { success: false, error };
  }
}

// ============================================
// EMAIL TEMPLATES
// ============================================

/**
 * Base email wrapper for consistent styling
 */
function getEmailWrapper(content: string): string {
  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          ${content}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Email header component
 */
function getEmailHeader(title?: string): string {
  return `
<tr>
  <td style="background-color: #000000; padding: 40px; text-align: center;">
    <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
      FTI News
    </h1>
    ${
      title
        ? `<p style="margin: 10px 0 0; color: #cccccc; font-size: 14px; letter-spacing: 2px; text-transform: uppercase;">${title}</p>`
        : ""
    }
  </td>
</tr>`;
}

/**
 * Email footer component
 */
function getEmailFooter(): string {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const year = new Date().getFullYear();

  return `
<tr>
  <td style="background-color: #000000; padding: 30px 40px; text-align: center;">
    <p style="margin: 0 0 10px; color: #ffffff; font-size: 14px;">
      Butuh bantuan? <a href="${baseUrl}/contact" style="color: #ffffff; text-decoration: underline;">Hubungi kami</a>
    </p>
    <p style="margin: 0 0 15px; color: #999999; font-size: 13px;">
      FTI News - Portal Berita Teknologi Informasi
    </p>
    <div style="margin: 15px 0 0;">
      <a href="${baseUrl}" style="color: #999999; text-decoration: none; font-size: 12px; margin: 0 10px;">Website</a>
      <span style="color: #666666;">|</span>
      <a href="${baseUrl}/about" style="color: #999999; text-decoration: none; font-size: 12px; margin: 0 10px;">Tentang</a>
      <span style="color: #666666;">|</span>
      <a href="${baseUrl}/privacy" style="color: #999999; text-decoration: none; font-size: 12px; margin: 0 10px;">Privasi</a>
    </div>
    <p style="margin: 20px 0 0; color: #666666; font-size: 11px;">
      © ${year} FTI News. All rights reserved.
    </p>
  </td>
</tr>`;
}

/**
 * Feature list component
 */
function getFeatureItem(text: string): string {
  return `
<tr>
  <td style="padding: 12px 0;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="width: 30px; vertical-align: top;">
          <div style="width: 24px; height: 24px; background-color: #000000; color: #ffffff; border-radius: 50%; text-align: center; line-height: 24px; font-size: 14px; font-weight: bold;">✓</div>
        </td>
        <td style="padding-left: 15px; color: #333333; font-size: 15px; line-height: 1.6;">
          ${text}
        </td>
      </tr>
    </table>
  </td>
</tr>`;
}

/**
 * Welcome email template
 */
function getWelcomeEmailTemplate(name: string): string {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const features = [
    "Membaca artikel teknologi terkini",
    "Menyimpan artikel favorit Anda",
    "Berkomentar dan berdiskusi dengan komunitas",
    "Mendapatkan notifikasi artikel terbaru",
  ];

  return getEmailWrapper(`
    ${getEmailHeader("Portal Berita Teknologi Informasi")}
    
    <tr>
      <td style="padding: 50px 40px 30px;">
        <h2 style="margin: 0 0 20px; color: #000000; font-size: 28px; font-weight: 600; line-height: 1.3;">
          Selamat Datang, ${name}! 🎉
        </h2>
        <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
          Terima kasih telah bergabung dengan <strong>FTI News</strong>. Kami sangat senang Anda menjadi bagian dari komunitas kami!
        </p>
        <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
          Dengan akun Anda, sekarang Anda dapat:
        </p>
        
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 0 0 30px;">
          ${features.map(getFeatureItem).join("")}
        </table>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td align="center" style="padding: 20px 0 30px;">
              <a href="${baseUrl}/articles" style="display: inline-block; padding: 16px 40px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; letter-spacing: 0.5px;">
                Jelajahi Artikel
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td style="padding: 0 40px 40px;">
        <div style="background-color: #f8f8f8; border-left: 4px solid #000000; padding: 20px; border-radius: 4px;">
          <p style="margin: 0 0 10px; color: #000000; font-size: 15px; font-weight: 600;">
            💡 Tips untuk Memulai:
          </p>
          <p style="margin: 0; color: #555555; font-size: 14px; line-height: 1.6;">
            Kunjungi dashboard Anda untuk mempersonalisasi profil dan mulai menjelajahi konten yang sesuai dengan minat Anda!
          </p>
        </div>
      </td>
    </tr>

    ${getEmailFooter()}
  `);
}

/**
 * Password reset token template
 */
function getPasswordResetTokenTemplate(name: string, token: string): string {
  return getEmailWrapper(`
    ${getEmailHeader()}
    
    <tr>
      <td style="padding: 50px 40px;">
        <h2 style="margin: 0 0 20px; color: #000000; font-size: 24px; font-weight: 600;">
          Kode Reset Password Anda
        </h2>
        <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
          Hai ${name},
        </p>
        <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
          Kami menerima permintaan untuk mereset password akun Anda. Gunakan kode di bawah ini untuk mengatur password baru:
        </p>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td align="center" style="padding: 30px 0;">
              <div style="padding: 20px 50px; background-color: #f0f0f0; border-radius: 8px; font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #000000;">
                ${token}
              </div>
            </td>
          </tr>
        </table>

        <div style="background-color: #fff9e6; border-left: 4px solid #ffcc00; padding: 20px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0 0 10px; color: #000000; font-size: 14px; font-weight: 600;">
            ⚠️ Penting:
          </p>
          <p style="margin: 0; color: #555555; font-size: 14px; line-height: 1.6;">
            Kode ini akan kadaluarsa dalam <strong>10 menit</strong>. Jika Anda tidak meminta reset password, abaikan email ini.
          </p>
        </div>
      </td>
    </tr>

    ${getEmailFooter()}
  `);
}

/**
 * Contact notification template (to admin)
 */
function getContactNotificationTemplate(data: ContactFormData): string {
  return getEmailWrapper(`
    <tr>
      <td style="background-color: #000000; padding: 30px 40px; text-align: center;">
        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">
          📬 Pesan Kontak Baru
        </h1>
      </td>
    </tr>

    <tr>
      <td style="padding: 40px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
              <strong style="color: #000000; font-size: 14px;">Dari:</strong><br>
              <span style="color: #333333; font-size: 16px;">${data.nama}</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
              <strong style="color: #000000; font-size: 14px;">Email:</strong><br>
              <a href="mailto:${data.email}" style="color: #000000; font-size: 16px; text-decoration: underline;">${data.email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
              <strong style="color: #000000; font-size: 14px;">Subjek:</strong><br>
              <span style="color: #333333; font-size: 16px;">${data.subjek}</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 0;">
              <strong style="color: #000000; font-size: 14px;">Pesan:</strong><br><br>
              <div style="background-color: #f8f8f8; padding: 20px; border-radius: 6px; border-left: 4px solid #000000;">
                <p style="margin: 0; color: #333333; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${data.isiPesan}</p>
              </div>
            </td>
          </tr>
        </table>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td align="center" style="padding: 20px 0 0;">
              <a href="mailto:${data.email}" style="display: inline-block; padding: 14px 35px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 15px; font-weight: 600;">
                Balas Email
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td style="background-color: #f8f8f8; padding: 20px 40px; text-align: center; border-top: 1px solid #e5e5e5;">
        <p style="margin: 0; color: #666666; font-size: 12px;">
          Email ini dikirim otomatis dari form kontak FTI News
        </p>
      </td>
    </tr>
  `);
}

/**
 * Contact confirmation template (to sender)
 */
function getContactConfirmationTemplate(data: ContactFormData): string {
  const year = new Date().getFullYear();

  return getEmailWrapper(`
    ${getEmailHeader()}
    
    <tr>
      <td style="padding: 40px;">
        <h2 style="margin: 0 0 20px; color: #000000; font-size: 22px; font-weight: 600;">
          Halo ${data.nama},
        </h2>
        <p style="margin: 0 0 16px; color: #333333; font-size: 15px; line-height: 1.6;">
          Terima kasih telah menghubungi <strong>FTI News</strong>. Kami sudah menerima pesan Anda dengan rincian sebagai berikut:
        </p>
        <div style="background-color: #f8f8f8; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <p style="margin: 0 0 10px; color: #000000; font-size: 14px;"><strong>Subjek:</strong> ${
            data.subjek
          }</p>
          <p style="margin: 0; color: #333333; font-size: 14px; line-height: 1.6; white-space: pre-line;">${
            data.isiPesan
          }</p>
        </div>
        <p style="margin: 0 0 16px; color: #333333; font-size: 15px; line-height: 1.6;">
          Tim kami akan meninjau pesan Anda dan memberikan tanggapan secepatnya. Jika ada informasi tambahan, silakan balas email ini.
        </p>
        <p style="margin: 0; color: #666666; font-size: 14px;">
          Salam hangat,<br />
          <strong>Tim FTI News</strong>
        </p>
      </td>
    </tr>
    
    <tr>
      <td style="background-color: #000000; padding: 25px 40px; text-align: center;">
        <p style="margin: 0; color: #999999; font-size: 12px;">
          © ${year} FTI News. All rights reserved.
        </p>
      </td>
    </tr>
  `);
}

/**
 * Newsletter confirmation template
 */
function getNewsletterConfirmationTemplate(email: string): string {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const year = new Date().getFullYear();

  return getEmailWrapper(`
    <tr>
      <td style="background-color: #000000; padding: 40px; text-align: center;">
        <h1 style="margin: 0; color: #ffffff; font-size: 48px;">📧</h1>
        <h2 style="margin: 15px 0 0; color: #ffffff; font-size: 24px; font-weight: 600;">
          Terima Kasih!
        </h2>
      </td>
    </tr>

    <tr>
      <td style="padding: 50px 40px;">
        <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
          Anda telah berhasil berlangganan newsletter <strong>FTI News</strong>!
        </p>
        <p style="margin: 0 0 30px; color: #333333; font-size: 16px; line-height: 1.6;">
          Setiap minggu, kami akan mengirimkan update artikel teknologi terbaru langsung ke <strong>${email}</strong>.
        </p>

        <div style="background-color: #000000; color: #ffffff; padding: 30px; border-radius: 8px; margin: 30px 0;">
          <p style="margin: 0 0 15px; font-size: 18px; font-weight: 600;">
            📚 Yang Akan Anda Dapatkan:
          </p>
          <ul style="margin: 0; padding-left: 20px; line-height: 1.8; font-size: 15px;">
            <li>Artikel teknologi pilihan setiap minggu</li>
            <li>Tips dan tutorial programming</li>
            <li>Update tren industri tech</li>
            <li>Akses eksklusif ke konten premium</li>
          </ul>
        </div>

        <p style="margin: 30px 0 0; color: #666666; font-size: 13px; line-height: 1.6; text-align: center;">
          Tidak ingin menerima email lagi? 
          <a href="${baseUrl}/unsubscribe?email=${encodeURIComponent(
    email
  )}" style="color: #000000; text-decoration: underline;">Berhenti berlangganan</a>
        </p>
      </td>
    </tr>

    <tr>
      <td style="background-color: #000000; padding: 30px 40px; text-align: center;">
        <p style="margin: 0 0 10px; color: #ffffff; font-size: 14px;">
          FTI News - Portal Berita Teknologi Informasi
        </p>
        <p style="margin: 0; color: #666666; font-size: 11px;">
          © ${year} FTI News. All rights reserved.
        </p>
      </td>
    </tr>
  `);
}
