import { NextResponse } from "next/server";
import { quotaService } from "@/actions/quotas";

export async function POST(request: Request) {
  try {
    const { userId, productName } = await request.json();

    if (!userId || !productName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const resetQuota = await quotaService.resetQuota(userId, productName);

    return NextResponse.json({
      remaining: resetQuota.remaining,
      total: resetQuota.product.quota,
      productName: resetQuota.product.name,
    });
  } catch (error) {
    console.error("Failed to reset quota:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
