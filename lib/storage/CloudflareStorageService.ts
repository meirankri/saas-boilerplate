import { StorageService } from "./StorageService";
import { uploadFile, deleteFile, getSignedFileUrl } from "@/utils/cloudflare";
import env from "@/lib/env";
import { logger } from "@/utils/logger";

export class CloudflareStorageService implements StorageService {
  async uploadFile(
    file: File,
    options: {
      entityId: string;
      entityType: string;
      createdBy: string;
    }
  ): Promise<{ url: string; size: number; newFileName: string }> {
    try {
      // Convertir le File en Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const newFileName = `${Date.now()}-${file.name}`;
      // Créer un nom de fichier unique sans inclure le bucket
      const fileName = `${options.entityType}/${options.entityId}/${newFileName}`;

      // Upload vers R2
      await uploadFile(buffer, env.CLOUDFLARE_BUCKET, fileName);

      // Construire l'URL publique
      const fileUrl = `${env.CLOUDFLARE_URL}/${fileName}`;

      return {
        url: fileUrl,
        size: file.size,
        newFileName,
      };
    } catch (error) {
      logger({
        message: `Failed to upload file: ${error.message}`,
        context: { fileName: file.name },
      }).error();
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    await deleteFile(env.CLOUDFLARE_BUCKET, fileName);
  }

  async getSignedFileUrl(fileName: string): Promise<string> {
    return getSignedFileUrl(env.CLOUDFLARE_BUCKET, fileName);
  }
}
