import { NextRequest, NextResponse } from "next/server";
import { updateSessionCookie } from "@/actions/auth.actions";

export async function GET(request: NextRequest) {
  await updateSessionCookie();
  return NextResponse.json({ success: true });
}
