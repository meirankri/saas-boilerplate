import { NextResponse } from "next/server";

import { validateSession } from "@/lib/lucia";
import { db } from "@/lib/database/db";
import { CloudflareStorageService } from "@/lib/storage/CloudflareStorageService";
import { logger } from "@/utils/logger";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("id", params);

    const { user } = await validateSession();
    const id = (await params).id;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const document = await db.document.findUnique({
      where: { id: id as string },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    if (document.createdBy !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
      const storageService = new CloudflareStorageService();
      const filePath = `${document.entityType}/${document.entityId}/${document.fileName}`;
      await storageService.deleteFile(filePath);
      await db.document.delete({
        where: { id: id as string },
      });

      return NextResponse.json({ success: true });
    } catch (cloudflareError) {
      logger({
        message: "Cloudflare delete error",
        context: cloudflareError,
      }).error();
      return NextResponse.json(
        { error: "Failed to delete file from storage" },
        { status: 500 }
      );
    }
  } catch (error) {
    logger({
      message: "Delete file error",
      context: error,
    }).error();
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
