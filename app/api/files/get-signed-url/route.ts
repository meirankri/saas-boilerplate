import { NextResponse } from "next/server";
import { validateSession } from "@/lib/lucia";
import { logger } from "@/utils/logger";
import { FirebaseStorageService } from "@/lib/storage/FirebaseStorageService";

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

    const storageService = new FirebaseStorageService();

    const signedUrl = await storageService.getFileURL(fileName);

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
