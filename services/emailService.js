// mailer/sendSummaryEmail.js
import { makeTransport } from "../config/mailer.js";

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

export const contactUsEmail = async (email, name, query) => {
  try {
    const response = await transporter.sendMail({
      from: email, 
      to: adminEmail,
      subject: `Query Mail by ${name}`,
      html: CONTACT_US_EMAIL_TEMPLATE.replace("{userName}", name)
        .replace("{userEmail}", email)
        .replace("{userMessage}", query),

      category: "Contact by user",
    });

    console.log("Query sent successfully", response);
  } catch (error) {
    console.error(`Error sending query`, error);
    throw new Error(`Error sending query: ${error}`);
  }
};

export const sendCopyOfContactUsEmailToUser = async (email, name, query) => {
  try {
    const response = await transporter.sendMail({
      from: sender,
      to: email,
      subject: `Query Mail by ${name} (Copy)`,
      html: CONTACT_US_EMAIL_TEMPLATE_COPY_TO_USER.replaceAll(
        "{userName}",
        name
      )
        .replace("{userEmail}", email)
        .replace("{userMessage}", query),
      category: "Contact by user Copy to user",
    });

    console.log("Query sent successfully", response);
  } catch (error) {
    console.error(`Error sending query`, error);
    throw new Error(`Error sending query: ${error}`);
  }
};
