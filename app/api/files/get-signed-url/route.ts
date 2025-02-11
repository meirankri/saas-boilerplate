import { NextResponse } from "next/server";
import { validateSession } from "@/lib/lucia";
import { getSignedFileUrl } from "@/utils/cloudflare";
import env from "@/lib/env";
import { CloudflareStorageService } from "@/lib/storage/CloudflareStorageService";
import { logger } from "@/utils/logger";
export async function POST(request: Request) {
  try {
    const { user } = await validateSession();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileName } = await request.json();

    if (!fileName) {
      return NextResponse.json(
        { error: "fileName is required" },
        { status: 400 }
      );
    }

    const storageService = new CloudflareStorageService();

    const signedUrl = await storageService.getSignedFileUrl(fileName);

    return NextResponse.json({ url: signedUrl });
  } catch (error) {
    logger({
      message: "Get signed URL error",
      context: error,
    }).error();
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
