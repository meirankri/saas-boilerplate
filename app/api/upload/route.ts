import { NextResponse } from "next/server";
import { FirebaseStorageService } from "@/lib/storage/FirebaseStorageService";
import { validateSession } from "@/lib/lucia";
import { db } from "@/lib/database/db";
import { StorageService } from "@/lib/storage/StorageService";
import { logger } from "@/utils/logger";

export async function POST(request: Request) {
  try {
    const { user } = await validateSession();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let storageService: StorageService;

    try {
      storageService = new FirebaseStorageService();
    } catch (error) {
      logger({
        message: "Error initializing Firebase storage service",
        context: error,
      }).error();
      return NextResponse.json(
        { error: "No storage service found" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const entityId = formData.get("entityId") as string;
    const entityType = formData.get("entityType") as string;

    if (!file || !entityId || !entityType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { url, size, newFileName } = await storageService.uploadFile(file, {
      entityId,
      entityType,
      createdBy: user.id,
    });

    const document = await db.document.create({
      data: {
        fileName: newFileName,
        fileUrl: url,
        fileSize: size,
        mimeType: file.type,
        entityId,
        entityType,
        createdBy: user.id,
      },
    });

    return NextResponse.json(document);
  } catch (error) {
    logger({
      message: "Upload error",
      context: error,
    }).error();
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
