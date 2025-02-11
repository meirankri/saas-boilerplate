import { NextResponse } from "next/server";
import { validateSession } from "@/lib/lucia";
import { db } from "@/lib/database/db";
import { logger } from "@/utils/logger";
export async function GET() {
  try {
    const { user } = await validateSession();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const documents = await db.document.findMany({
      where: {
        createdBy: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(documents);
  } catch (error) {
    logger({
      message: "Get documents error",
      context: error,
    }).error();
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
