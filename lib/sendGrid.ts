import sgMail from '@sendgrid/mail';
import env from "./env";
import { logger } from "@/utils/logger";

// Initialiser SendGrid avec votre clé API
sgMail.setApiKey(env.SENDGRID_API_KEY);

type SendEmailProps = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailProps) {
  try {
    logger({
      message: 'Attempting to send email',
      context: { to, subject }
    }).info();

    const msg = {
      to,
      from: {
        email: env.EMAIL_FROM,
        name: "Recruit AI"
      },
      subject,
      html
    };

    const response = await sgMail.send(msg);
    
    logger({
      message: 'Email sent successfully',
      context: { 
        statusCode: response[0].statusCode,
        headers: response[0].headers
      }
    }).info();

    return response;
  } catch (error) {
    logger({
      message: 'Error sending email',
      context: error
    }).error();
    throw error;
  }
}