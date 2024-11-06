import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/sendGrid";
import env from "@/lib/env";

export async function POST(request: Request) {
  const { name, email, message } = await request.json();

  try {
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

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { message: "Error sending email" },
      { status: 500 }
    );
  }
}
