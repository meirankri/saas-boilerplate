import nodemailer from "nodemailer";
import env from "./env";

const transporter = nodemailer.createTransport({
  host: env.EMAIL_SERVER_HOST,
  port: Number(env.EMAIL_SERVER_PORT),
  secure: true,
  auth: {
    user: env.EMAIL_SERVER_USER,
    pass: env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  await transporter.sendMail({
    from: `"your name" <${env.EMAIL_FROM}>`,
    to,
    subject,
    html,
  });
}
