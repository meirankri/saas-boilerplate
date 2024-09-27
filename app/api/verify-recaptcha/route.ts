import env from "@/lib/env";
import { logger } from "@/utils/logger";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }

  const body = await req.json();
  const { token } = body;

  if (!token) {
    return NextResponse.json(
      { message: "Missing reCAPTCHA token" },
      { status: 400 }
    );
  }

  const secretKey = env.RECAPTCHA_SECRET_KEY;

  try {
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
      {
        method: "POST",
      }
    );

    const data = await response.json();

    if (data.success) {
      return NextResponse.json({ success: true, score: data.score });
    } else {
      return NextResponse.json(
        { success: false, message: "reCAPTCHA verification failed" },
        { status: 400 }
      );
    }
  } catch (error) {
    logger({
      message: "Server error during reCAPTCHA verification",
      context: error,
    }).error();
    return NextResponse.json(
      { message: "Server error during reCAPTCHA verification" },
      { status: 500 }
    );
  }
}
