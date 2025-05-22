import nodemailer from "nodemailer";
import fs from "fs/promises";

async function sendEmail({ to, subject, html }) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER, // your Gmail address
        pass: process.env.EMAIL_PASS, // app password (not your actual Gmail password!)
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM, // e.g., '"Cape Rides" <noreply@caperides.com>'
      to: to,
      subject: subject,
      html: html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

async function processTemplate(templatePath, data) {
  try {
    let template = await fs.readFile(templatePath, "utf-8");
    for (const key in data) {
      const regex = new RegExp(`{{${key}}}`, "g");
      template = template.replace(regex, data[key]);
    }
    return template;
  } catch (error) {
    console.error("Error processing template:", error);
    // Optionally, re-throw the error or return a default/error template
    // For now, just logging and returning an empty string or null
    return null; // Or throw error;
  }
}

export { sendEmail, processTemplate };
