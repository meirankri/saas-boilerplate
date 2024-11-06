"use server";
import { db } from "@/lib/database/db";
import { SignInSchema } from "@/types";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { sendEmail } from "@/lib/sendGrid";
import { logger } from "@/utils/logger";
import { addFreeTrialSubscription } from "@/lib/lucia/auth";
import { verifyRecaptcha } from "@/utils/recaptcha";

const generateMagicLink = async (email: string, userId: string) => {
  const token = jwt.sign({ email: email, userId }, process.env.JWT_SECRET!, {
    expiresIn: "5m",
  });

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/magic-link?token=${token}`;

  return {
    success: true,
    message: "Magic link generated successfully",
    data: {
      token,
      url,
    },
  };
};

export const signIn = async (values: z.infer<typeof SignInSchema>) => {
  try {
    SignInSchema.parse(values);

    const isVerified = await verifyRecaptcha();
    if (!isVerified) {
      return {
        success: false,
        message: "reCAPTCHA verification failed",
        data: null,
      };
    }

    const existedUser = await db.user.findUnique({
      where: { email: values.email },
    });

    if (existedUser) {
      const res = await generateMagicLink(values.email, existedUser.id);

      await db.magicLink.create({
        data: {
          userId: existedUser.id,
          token: res.data.token,
        },
      });
      await sendEmail({
        to: values.email,
        subject: "signup link",
        html: `<div>click to sign up ${res.data.url}</div>`,
      });
    } else {
      const user = await db.user.create({
        data: {
          email: values.email,
        },
      });
      const res = await generateMagicLink(values.email, user.id);

      await db.magicLink.create({
        data: {
          userId: user.id,
          token: res.data.token,
        },
      });

      await addFreeTrialSubscription(db, user.id);

      await sendEmail({
        to: values.email,
        subject: "signup link",
        html: `<div>click to sign up ${res.data.url}</div>`,
      });
    }

    return {
      success: true,
      message: "Magic link sent successfully",
      data: null,
    };
  } catch (error: any) {
    logger({
      message: "Failed to sign in",
      context: error,
    }).error();
    return {
      success: false,
      message: error?.message,
      data: null,
    };
  }
};
