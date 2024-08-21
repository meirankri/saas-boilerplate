import { NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { logger } from "@/utils/logger";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json(
      { error: "Product name is required" },
      { status: 400 }
    );
  }

  try {
    const product = await prisma.product.findFirst({
      where: { name: name },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ productId: product.id });
  } catch (error) {
    logger({
      message: "Failed to get product by name",
      context: error,
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
