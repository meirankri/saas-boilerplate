import { quotaService } from "@/actions/quotas";
import { NextResponse } from "next/server";
import { validateSession } from "@/lib/lucia";

export async function POST(request: Request) {
  const { user } = await validateSession();
  try {
    let productName = "",
      amount = 0;
    try {
      ({ productName, amount } = await request.json());
    } catch (e) {
      return NextResponse.json({ error: "No request body" }, { status: 400 });
    }
    const userId = user?.id;

    if (!userId || !productName || !amount) {
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
