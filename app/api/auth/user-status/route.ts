import { getAuthStatus } from "@/lib/lucia/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const { user, subscription } = await getAuthStatus();
  return NextResponse.json({ user, subscription });
}
