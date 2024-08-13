import { quotaService } from "@/actions/quotas";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId, productName, amount } = await request.json();

    if (!userId || !productName || amount === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedQuota = await quotaService.decrementQuota(
      userId,
      productName,
      amount
    );

    return NextResponse.json({
      remaining: updatedQuota.remaining,
      total: updatedQuota.product.quota,
      productName: updatedQuota.product.name,
    });
  } catch (error) {
    console.error("Failed to decrement quota:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
