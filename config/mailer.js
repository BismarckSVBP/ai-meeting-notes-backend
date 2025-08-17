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
