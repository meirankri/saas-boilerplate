import { NextResponse } from "next/server";

import { quotaService } from "@/actions/quotas";
import { validateSession } from "@/lib/lucia";
import { logger } from "@/utils/logger";

export async function GET(request: Request) {
  const { user } = await validateSession();
  const { searchParams } = new URL(request.url);
  const userId = user?.id;
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
    logger({
      message: "Failed to get quota info",
      context: error,
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
