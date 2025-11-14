type MailPayload = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

export async function sendMail(_payload: MailPayload): Promise<void> {
  // Placeholder: integrate with real mail service (Resend, SendGrid, Nodemailer, etc.)
  if (process.env.NODE_ENV !== "production") {
    console.info("[mailer] sendMail called", _payload);
  }
}
