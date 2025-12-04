"use strict";
// ============================================
// File: lib/email/nodemailer.ts
// ============================================
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWelcomeEmail = sendWelcomeEmail;
exports.sendPasswordResetTokenEmail = sendPasswordResetTokenEmail;
exports.sendContactNotification = sendContactNotification;
exports.sendContactConfirmation = sendContactConfirmation;
exports.sendNewsletterConfirmation = sendNewsletterConfirmation;
var nodemailer_1 = require("nodemailer");
// ============================================
// NODEMAILER CONFIGURATION
// ============================================
// Create reusable transporter
// Support untuk Gmail, SMTP server, atau service lainnya
var createTransporter = function () {
    // Konfigurasi dari environment variables
    var config = {
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER || process.env.EMAIL_FROM_USER,
            pass: process.env.SMTP_PASSWORD || process.env.EMAIL_FROM_PASSWORD,
        },
    };
    // Jika menggunakan Gmail dengan App Password
    // Atau jika menggunakan SMTP server lain
    return nodemailer_1.default.createTransport(config);
};
// Email configuration
var EMAIL_CONFIG = {
    from: process.env.EMAIL_FROM || "FTI News <noreply@ftinews.com>",
    replyTo: process.env.EMAIL_REPLY_TO || "support@ftinews.com",
};
// ============================================
// EMAIL SENDING FUNCTIONS
// ============================================
/**
 * Send welcome email to new user
 */
function sendWelcomeEmail(email, name) {
    return __awaiter(this, void 0, void 0, function () {
        var transporter, mailOptions, info, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    transporter = createTransporter();
                    mailOptions = {
                        from: EMAIL_CONFIG.from,
                        to: email,
                        subject: "Selamat Datang di FTI News! 🎉",
                        html: getWelcomeEmailTemplate(name),
                    };
                    return [4 /*yield*/, transporter.sendMail(mailOptions)];
                case 1:
                    info = _a.sent();
                    console.log("Welcome email sent successfully:", info.messageId);
                    return [2 /*return*/, { success: true, data: { messageId: info.messageId } }];
                case 2:
                    error_1 = _a.sent();
                    console.error("Error sending welcome email:", error_1);
                    return [2 /*return*/, { success: false, error: error_1 }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * KIRIM KODE RESET PASSWORD (6-DIGIT)
 */
function sendPasswordResetTokenEmail(email, name, token // Ini adalah kode 6-digit
) {
    return __awaiter(this, void 0, void 0, function () {
        var transporter, mailOptions, info, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    transporter = createTransporter();
                    mailOptions = {
                        from: EMAIL_CONFIG.from,
                        to: email,
                        subject: "Kode Reset Password - FTI News",
                        html: getPasswordResetTokenTemplate(name, token), // Panggil template baru
                    };
                    return [4 /*yield*/, transporter.sendMail(mailOptions)];
                case 1:
                    info = _a.sent();
                    console.log("Password reset KODE email sent successfully:", info.messageId);
                    return [2 /*return*/, { success: true, data: { messageId: info.messageId } }];
                case 2:
                    error_2 = _a.sent();
                    console.error("Error sending password reset KODE email:", error_2);
                    return [2 /*return*/, { success: false, error: error_2 }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Send contact form notification to admin
 */
function sendContactNotification(data) {
    return __awaiter(this, void 0, void 0, function () {
        var adminEmail, transporter, mailOptions, info, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    adminEmail = process.env.ADMIN_EMAIL || "admin@ftinews.com";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    transporter = createTransporter();
                    mailOptions = {
                        from: EMAIL_CONFIG.from,
                        to: adminEmail,
                        replyTo: data.email,
                        subject: "Pesan Kontak: ".concat(data.subjek),
                        html: getContactNotificationTemplate(data),
                    };
                    return [4 /*yield*/, transporter.sendMail(mailOptions)];
                case 2:
                    info = _a.sent();
                    console.log("Contact notification sent successfully:", info.messageId);
                    return [2 /*return*/, { success: true, data: { messageId: info.messageId } }];
                case 3:
                    error_3 = _a.sent();
                    console.error("Error sending contact notification:", error_3);
                    return [2 /*return*/, { success: false, error: error_3 }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Send contact confirmation to the sender
 */
function sendContactConfirmation(data) {
    return __awaiter(this, void 0, void 0, function () {
        var transporter, mailOptions, info, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    transporter = createTransporter();
                    mailOptions = {
                        from: EMAIL_CONFIG.from,
                        to: data.email,
                        subject: "Terima kasih, ".concat(data.nama, "! Pesan Anda sudah kami terima."),
                        html: getContactConfirmationTemplate({
                            nama: data.nama,
                            subjek: data.subjek,
                            isiPesan: data.isiPesan,
                        }),
                    };
                    return [4 /*yield*/, transporter.sendMail(mailOptions)];
                case 1:
                    info = _a.sent();
                    console.log("Contact confirmation sent successfully:", info.messageId);
                    return [2 /*return*/, { success: true, data: { messageId: info.messageId } }];
                case 2:
                    error_4 = _a.sent();
                    console.error("Error sending contact confirmation:", error_4);
                    return [2 /*return*/, { success: false, error: error_4 }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Send newsletter confirmation email
 */
function sendNewsletterConfirmation(email) {
    return __awaiter(this, void 0, void 0, function () {
        var transporter, mailOptions, info, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    transporter = createTransporter();
                    mailOptions = {
                        from: EMAIL_CONFIG.from,
                        to: email,
                        subject: "Terima Kasih Telah Berlangganan Newsletter FTI News! 📧",
                        html: getNewsletterConfirmationTemplate(email),
                    };
                    return [4 /*yield*/, transporter.sendMail(mailOptions)];
                case 1:
                    info = _a.sent();
                    console.log("Newsletter confirmation sent successfully:", info.messageId);
                    return [2 /*return*/, { success: true, data: { messageId: info.messageId } }];
                case 2:
                    error_5 = _a.sent();
                    console.error("Error sending newsletter confirmation:", error_5);
                    return [2 /*return*/, { success: false, error: error_5 }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// ============================================
// EMAIL TEMPLATES
// ============================================
/**
 * Welcome email template - Black & White theme
 */
function getWelcomeEmailTemplate(name) {
    return "\n<!DOCTYPE html>\n<html lang=\"id\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Welcome to FTI News</title>\n</head>\n<body style=\"margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;\">\n  <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n    <tr>\n      <td align=\"center\" style=\"padding: 40px 20px;\">\n        <table role=\"presentation\" width=\"600\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" style=\"background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);\">\n          \n          <tr>\n            <td style=\"background-color: #000000; padding: 40px 40px 30px; text-align: center;\">\n              <h1 style=\"margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;\">\n                FTI News\n              </h1>\n              <p style=\"margin: 10px 0 0; color: #cccccc; font-size: 14px; letter-spacing: 2px; text-transform: uppercase;\">\n                Portal Berita Teknologi Informasi\n              </p>\n            </td>\n          </tr>\n\n          <tr>\n            <td style=\"padding: 50px 40px 30px;\">\n              <h2 style=\"margin: 0 0 20px; color: #000000; font-size: 28px; font-weight: 600; line-height: 1.3;\">\n                Selamat Datang, ".concat(name, "! \uD83C\uDF89\n              </h2>\n              <p style=\"margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;\">\n                Terima kasih telah bergabung dengan <strong>FTI News</strong>. Kami sangat senang Anda menjadi bagian dari komunitas kami!\n              </p>\n              <p style=\"margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;\">\n                Dengan akun Anda, sekarang Anda dapat:\n              </p>\n              \n              <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" style=\"margin: 0 0 30px;\">\n                <tr>\n                  <td style=\"padding: 12px 0;\">\n                    <table role=\"presentation\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n                      <tr>\n                        <td style=\"width: 30px; vertical-align: top;\">\n                          <div style=\"width: 24px; height: 24px; background-color: #000000; color: #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold;\">\u2713</div>\n                        </td>\n                        <td style=\"padding-left: 15px; color: #333333; font-size: 15px; line-height: 1.6;\">\n                          Membaca artikel teknologi terkini\n                        </td>\n                      </tr>\n                    </table>\n                  </td>\n                </tr>\n                <tr>\n                  <td style=\"padding: 12px 0;\">\n                    <table role=\"presentation\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n                      <tr>\n                        <td style=\"width: 30px; vertical-align: top;\">\n                          <div style=\"width: 24px; height: 24px; background-color: #000000; color: #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold;\">\u2713</div>\n                        </td>\n                        <td style=\"padding-left: 15px; color: #333333; font-size: 15px; line-height: 1.6;\">\n                          Menyimpan artikel favorit Anda\n                        </td>\n                      </tr>\n                    </table>\n                  </td>\n                </tr>\n                <tr>\n                  <td style=\"padding: 12px 0;\">\n                    <table role=\"presentation\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n                      <tr>\n                        <td style=\"width: 30px; vertical-align: top;\">\n                          <div style=\"width: 24px; height: 24px; background-color: #000000; color: #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold;\">\u2713</div>\n                        </td>\n                        <td style=\"padding-left: 15px; color: #333333; font-size: 15px; line-height: 1.6;\">\n                          Berkomentar dan berdiskusi dengan komunitas\n                        </td>\n                      </tr>\n                    </table>\n                  </td>\n                </tr>\n                <tr>\n                  <td style=\"padding: 12px 0;\">\n                    <table role=\"presentation\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n                      <tr>\n                        <td style=\"width: 30px; vertical-align: top;\">\n                          <div style=\"width: 24px; height: 24px; background-color: #000000; color: #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold;\">\u2713</div>\n                        </td>\n                        <td style=\"padding-left: 15px; color: #333333; font-size: 15px; line-height: 1.6;\">\n                          Mendapatkan notifikasi artikel terbaru\n                        </td>\n                      </tr>\n                    </table>\n                  </td>\n                </tr>\n              </table>\n\n              <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n                <tr>\n                  <td align=\"center\" style=\"padding: 20px 0 30px;\">\n                    <a href=\"").concat(process.env.NEXTAUTH_URL, "/articles\" style=\"display: inline-block; padding: 16px 40px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; letter-spacing: 0.5px; transition: background-color 0.3s;\">\n                      Jelajahi Artikel\n                    </a>\n                  </td>\n                </tr>\n              </table>\n            </td>\n          </tr>\n\n          <tr>\n            <td style=\"padding: 0 40px 40px;\">\n              <div style=\"background-color: #f8f8f8; border-left: 4px solid #000000; padding: 20px; border-radius: 4px;\">\n                <p style=\"margin: 0 0 10px; color: #000000; font-size: 15px; font-weight: 600;\">\n                  \uD83D\uDCA1 Tips untuk Memulai:\n                </p>\n                <p style=\"margin: 0; color: #555555; font-size: 14px; line-height: 1.6;\">\n                  Kunjungi dashboard Anda untuk mempersonalisasi profil dan mulai menjelajahi konten yang sesuai dengan minat Anda!\n                </p>\n              </div>\n            </td>\n          </tr>\n\n          <tr>\n            <td style=\"background-color: #000000; padding: 30px 40px; text-align: center;\">\n              <p style=\"margin: 0 0 10px; color: #ffffff; font-size: 14px;\">\n                Butuh bantuan? <a href=\"").concat(process.env.NEXTAUTH_URL, "/contact\" style=\"color: #ffffff; text-decoration: underline;\">Hubungi kami</a>\n              </p>\n              <p style=\"margin: 0 0 15px; color: #999999; font-size: 13px;\">\n                FTI News - Portal Berita Teknologi Informasi\n              </p>\n              <div style=\"margin: 15px 0 0;\">\n                <a href=\"").concat(process.env.NEXTAUTH_URL, "\" style=\"color: #999999; text-decoration: none; font-size: 12px; margin: 0 10px;\">Website</a>\n                <span style=\"color: #666666;\">|</span>\n                <a href=\"").concat(process.env.NEXTAUTH_URL, "/about\" style=\"color: #999999; text-decoration: none; font-size: 12px; margin: 0 10px;\">Tentang Kami</a>\n                <span style=\"color: #666666;\">|</span>\n                <a href=\"").concat(process.env.NEXTAUTH_URL, "/privacy\" style=\"color: #999999; text-decoration: none; font-size: 12px; margin: 0 10px;\">Privasi</a>\n              </div>\n              <p style=\"margin: 20px 0 0; color: #666666; font-size: 11px;\">\n                \u00A9 ").concat(new Date().getFullYear(), " FTI News. All rights reserved.\n              </p>\n            </td>\n          </tr>\n        </table>\n      </td>\n    </tr>\n  </table>\n</body>\n</html>\n  ");
}
/**
 * Template Email untuk Kode Reset Password (6-digit)
 */
function getPasswordResetTokenTemplate(name, token) {
    return "\n<!DOCTYPE html>\n<html lang=\"id\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Reset Password</title>\n</head>\n<body style=\"margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;\">\n  <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n    <tr>\n      <td align=\"center\" style=\"padding: 40px 20px;\">\n        <table role=\"presentation\" width=\"600\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" style=\"background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);\">\n          \n          <tr>\n            <td style=\"background-color: #000000; padding: 40px 40px 30px; text-align: center;\">\n              <h1 style=\"margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;\">FTI News</h1>\n            </td>\n          </tr>\n\n          <tr>\n            <td style=\"padding: 50px 40px;\">\n              <h2 style=\"margin: 0 0 20px; color: #000000; font-size: 24px; font-weight: 600;\">\n                Kode Reset Password Anda\n              </h2>\n              <p style=\"margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;\">\n                Hai ".concat(name, ",\n              </p>\n              <p style=\"margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;\">\n                Kami menerima permintaan untuk mereset password akun Anda. Gunakan kode sekali pakai di bawah ini untuk mengatur password baru Anda:\n              </p>\n\n              <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n                <tr>\n                  <td align=\"center\" style=\"padding: 30px 0;\">\n                    <div style=\"padding: 16px 40px; background-color: #f0f0f0; border-radius: 6px; font-size: 32px; font-weight: 700; letter-spacing: 5px; color: #000000;\">\n                      ").concat(token, "\n                    </div>\n                  </td>\n                </tr>\n              </table>\n\n              <div style=\"background-color: #fff9e6; border-left: 4px solid #ffcc00; padding: 20px; border-radius: 4px; margin: 20px 0;\">\n                <p style=\"margin: 0 0 10px; color: #000000; font-size: 14px; font-weight: 600;\">\n                  \u26A0\uFE0F Penting:\n                </p>\n                <p style=\"margin: 0; color: #555555; font-size: 14px; line-height: 1.6;\">\n                  Kode ini akan kadaluarsa dalam <strong>10 menit</strong>. Jika Anda tidak merasa meminta reset password, abaikan email ini.\n                </p>\n              </div>\n            </td>\n          </tr>\n\n          <tr>\n            <td style=\"background-color: #000000; padding: 30px 40px; text-align: center;\">\n              <p style=\"margin: 0 0 10px; color: #ffffff; font-size: 14px;\">\n                Butuh bantuan? <a href=\"").concat(process.env.NEXTAUTH_URL, "/contact\" style=\"color: #ffffff; text-decoration: underline;\">Hubungi kami</a>\n              </p>\n              <p style=\"margin: 0; color: #666666; font-size: 11px;\">\n                \u00A9 ").concat(new Date().getFullYear(), " FTI News. All rights reserved.\n              </p>\n            </td>\n          </tr>\n        </table>\n      </td>\n    </tr>\n  </table>\n</body>\n</html>\n  ");
}
/**
 * Contact notification template (to admin)
 */
function getContactNotificationTemplate(data) {
    return "\n<!DOCTYPE html>\n<html lang=\"id\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Pesan Kontak Baru</title>\n</head>\n<body style=\"margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;\">\n  <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n    <tr>\n      <td align=\"center\" style=\"padding: 40px 20px;\">\n        <table role=\"presentation\" width=\"600\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" style=\"background-color: #ffffff; border-radius: 8px; overflow: hidden;\">\n          \n          <tr>\n            <td style=\"background-color: #000000; padding: 30px 40px; text-align: center;\">\n              <h1 style=\"margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;\">\n                Pesan Kontak Baru\n              </h1>\n            </td>\n          </tr>\n\n          <tr>\n            <td style=\"padding: 40px;\">\n              <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n                <tr>\n                  <td style=\"padding: 12px 0; border-bottom: 1px solid #e5e5e5;\">\n                    <strong style=\"color: #000000; font-size: 14px;\">Dari:</strong><br>\n                    <span style=\"color: #333333; font-size: 16px;\">".concat(data.nama, "</span>\n                  </td>\n                </tr>\n                <tr>\n                  <td style=\"padding: 12px 0; border-bottom: 1px solid #e5e5e5;\">\n                    <strong style=\"color: #000000; font-size: 14px;\">Email:</strong><br>\n                    <a href=\"mailto:").concat(data.email, "\" style=\"color: #000000; font-size: 16px; text-decoration: underline;\">").concat(data.email, "</a>\n                  </td>\n                </tr>\n                <tr>\n                  <td style=\"padding: 12px 0; border-bottom: 1px solid #e5e5e5;\">\n                    <strong style=\"color: #000000; font-size: 14px;\">Subjek:</strong><br>\n                    <span style=\"color: #333333; font-size: 16px;\">").concat(data.subjek, "</span>\n                  </td>\n                </tr>\n                <tr>\n                  <td style=\"padding: 20px 0;\">\n                    <strong style=\"color: #000000; font-size: 14px;\">Pesan:</strong><br><br>\n                    <div style=\"background-color: #f8f8f8; padding: 20px; border-radius: 6px; border-left: 4px solid #000000;\">\n                      <p style=\"margin: 0; color: #333333; font-size: 15px; line-height: 1.6; white-space: pre-wrap;\">").concat(data.isiPesan, "</p>\n                    </div>\n                  </td>\n                </tr>\n              </table>\n\n              <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n                <tr>\n                  <td align=\"center\" style=\"padding: 20px 0 0;\">\n                    <a href=\"mailto:").concat(data.email, "\" style=\"display: inline-block; padding: 14px 35px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 15px; font-weight: 600;\">\n                      Balas Email\n                    </a>\n                  </td>\n                </tr>\n              </table>\n            </td>\n          </tr>\n\n          <tr>\n            <td style=\"background-color: #f8f8f8; padding: 20px 40px; text-align: center; border-top: 1px solid #e5e5e5;\">\n              <p style=\"margin: 0; color: #666666; font-size: 12px;\">\n                Email ini dikirim otomatis dari form kontak FTI News\n              </p>\n            </td>\n          </tr>\n        </table>\n      </td>\n    </tr>\n  </table>\n</body>\n</html>\n  ");
}
/**
 * Contact confirmation template (to sender)
 */
function getContactConfirmationTemplate(data) {
    return "\n<!DOCTYPE html>\n<html lang=\"id\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Konfirmasi Pesan</title>\n</head>\n<body style=\"margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;\">\n  <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n    <tr>\n      <td align=\"center\" style=\"padding: 40px 20px;\">\n        <table role=\"presentation\" width=\"600\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" style=\"background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);\">\n          <tr>\n            <td style=\"background-color: #000000; padding: 30px 40px; text-align: center;\">\n              <h1 style=\"margin: 0; color: #ffffff; font-size: 26px; font-weight: 700;\">FTI News</h1>\n            </td>\n          </tr>\n          <tr>\n            <td style=\"padding: 40px;\">\n              <h2 style=\"margin: 0 0 20px; color: #000000; font-size: 22px; font-weight: 600;\">\n                Halo ".concat(data.nama, ",\n              </h2>\n              <p style=\"margin: 0 0 16px; color: #333333; font-size: 15px; line-height: 1.6;\">\n                Terima kasih telah menghubungi <strong>FTI News</strong>. Kami sudah menerima pesan Anda dengan rincian sebagai berikut:\n              </p>\n              <div style=\"background-color: #f8f8f8; border-radius: 8px; padding: 20px; margin: 20px 0;\">\n                <p style=\"margin: 0 0 10px; color: #000000; font-size: 14px;\"><strong>Subjek:</strong> ").concat(data.subjek, "</p>\n                <p style=\"margin: 0; color: #333333; font-size: 14px; line-height: 1.6; white-space: pre-line;\">").concat(data.isiPesan, "</p>\n              </div>\n              <p style=\"margin: 0 0 16px; color: #333333; font-size: 15px; line-height: 1.6;\">\n                Tim kami akan meninjau pesan Anda dan memberikan tanggapan secepatnya. Jika ada informasi tambahan, silakan balas email ini.\n              </p>\n              <p style=\"margin: 0; color: #666666; font-size: 14px;\">\n                Salam hangat,<br />\n                <strong>Tim FTI News</strong>\n              </p>\n            </td>\n          </tr>\n          <tr>\n            <td style=\"background-color: #000000; padding: 25px 40px; text-align: center;\">\n              <p style=\"margin: 0; color: #999999; font-size: 12px;\">\n                \u00A9 ").concat(new Date().getFullYear(), " FTI News. All rights reserved.\n              </p>\n            </td>\n          </tr>\n        </table>\n      </td>\n    </tr>\n  </table>\n</body>\n</html>\n  ");
}
/**
 * Newsletter confirmation template
 */
function getNewsletterConfirmationTemplate(email) {
    return "\n<!DOCTYPE html>\n<html lang=\"id\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Newsletter Confirmation</title>\n</head>\n<body style=\"margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;\">\n  <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n    <tr>\n      <td align=\"center\" style=\"padding: 40px 20px;\">\n        <table role=\"presentation\" width=\"600\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" style=\"background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);\">\n          \n          <tr>\n            <td style=\"background-color: #000000; padding: 40px; text-align: center;\">\n              <h1 style=\"margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;\">\uD83D\uDCE7</h1>\n              <h2 style=\"margin: 15px 0 0; color: #ffffff; font-size: 24px; font-weight: 600;\">\n                Terima Kasih!\n              </h2>\n            </td>\n          </tr>\n\n          <tr>\n            <td style=\"padding: 50px 40px;\">\n              <p style=\"margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;\">\n                Anda telah berhasil berlangganan newsletter <strong>FTI News</strong>!\n              </p>\n              <p style=\"margin: 0 0 30px; color: #333333; font-size: 16px; line-height: 1.6;\">\n                Setiap minggu, kami akan mengirimkan update artikel teknologi terbaru, tips, dan insight langsung ke inbox Anda di <strong>".concat(email, "</strong>.\n              </p>\n\n              <div style=\"background-color: #000000; color: #ffffff; padding: 30px; border-radius: 6px; margin: 30px 0;\">\n                <p style=\"margin: 0 0 15px; font-size: 18px; font-weight: 600;\">\n                  Yang Akan Anda Dapatkan:\n                </p>\n                <ul style=\"margin: 0; padding-left: 20px; line-height: 1.8;\">\n                  <li>Artikel teknologi pilihan setiap minggu</li>\n                  <li>Tips dan tutorial programming</li>\n                  <li>Update tren industri tech</li>\n                  <li>Akses eksklusif ke konten premium</li>\n                </ul>\n              </div>\n\n              <p style=\"margin: 30px 0 0; color: #666666; font-size: 14px; line-height: 1.6;\">\n                Tidak ingin menerima email lagi? Anda dapat <a href=\"").concat(process.env.NEXTAUTH_URL, "/unsubscribe?email=").concat(encodeURIComponent(email), "\" style=\"color: #000000; text-decoration: underline;\">berhenti berlangganan</a> kapan saja.\n              </p>\n            </td>\n          </tr>\n\n          <tr>\n            <td style=\"background-color: #000000; padding: 30px 40px; text-align: center;\">\n              <p style=\"margin: 0 0 10px; color: #ffffff; font-size: 14px;\">\n                FTI News - Portal Berita Teknologi Informasi\n              </p>\n              <p style=\"margin: 0; color: #666666; font-size: 11px;\">\n                \u00A9 ").concat(new Date().getFullYear(), " FTI News. All rights reserved.\n              </p>\n            </td>\n          </tr>\n        </table>\n      </td>\n    </tr>\n  </table>\n</body>\n</html>\n  ");
}
