import { quotaService } from "@/actions/quotas";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const productName = searchParams.get("productName");

  if (!userId || !productName) {
    return NextResponse.json(
      { error: "Missing userId or productName" },
      { status: 400 }
    );
  }
  try {
    const quotaInfo = await quotaService.getQuotaInfo(userId, productName);

    if (!quotaInfo) {
      return NextResponse.json({
        remaining: 0,
        total: 0,
        productName: productName,
      });
    }

    return NextResponse.json({
      remaining: quotaInfo.remaining,
      total: quotaInfo.product.quota,
      productName: quotaInfo.product.name,
    });
  } catch (error) {
    console.error("Failed to fetch quota info:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
