import { z } from "zod";
import { publicProcedure } from "../trpc";
import { sendEmail } from "@/lib/sendGrid";
import env from "@/lib/env";
import { logger } from "@/utils/logger";

export const contactRouter = publicProcedure
  .input(
    z.object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email format"),
      message: z.string().min(1, "Message is required"),
    })
  )
  .mutation(async (opts) => {
    try {
      const { name, email, message } = opts.input;
      await sendEmail({
        to: env.EMAIL_FROM,
        subject: "New contact message",
        html: `
          <h1>New contact message</h1>
          <p><strong>Name :</strong> ${name}</p>
          <p><strong>Email :</strong> ${email}</p>
          <p><strong>Message :</strong> ${message}</p>
        `,
      });

      return { success: true, message: "Email sent successfully" };
    } catch (error) {
      logger({
        message: "Error sending email",
        context: error,
      }).error();
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.reduce((acc, err) => {
          const field = err.path[0] as string;
          return { ...acc, [field]: err.message };
        }, {});

        return {
          success: false,
          errors: formattedErrors,
        };
      }
      return {
        success: false,
        errors: { server: "Failed to send email" },
      };
    }
  });
