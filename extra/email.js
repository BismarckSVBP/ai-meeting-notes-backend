
import nodemailer from "nodemailer";

export function makeTransport() {
  const port = parseInt(process.env.SMTP_PORT || "465");

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendSummaryEmail({ to, subject, text, html }) {
  try {
    const transporter = makeTransport();
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      text,
      html,
    });

    console.log("📧 Sent email to:", to, "messageId:", info.messageId);
    return info.messageId;
  } catch (err) {
    console.error("❌ Email send failed:", err);
    throw err; 
  }
}
