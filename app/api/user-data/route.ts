import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/lucia";
import { fetchUserQuotas, fetchUserFeatures } from "@/actions/user-data";
import { logger } from "@/utils/logger";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const quotas = await fetchUserQuotas(user.id);
    const features = await fetchUserFeatures(user.id);
    return NextResponse.json({ quotas, features });
  } catch (error) {
    logger({
      message: "Failed to fetch user data",
      context: error,
    }).error();
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
