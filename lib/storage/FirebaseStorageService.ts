// FirebaseStorageService.ts

import { StorageService } from "./StorageService"; // Assurez-vous que l'interface est bien exportée depuis ce fichier ou définie ici.
import {
  uploadFile as firebaseUploadFile,
  deleteFile as firebaseDeleteFile,
  getFileURL,
} from "@/utils/firebaseStorage";

export class FirebaseStorageService implements StorageService {
  /**
   * Upload d'un fichier sur Firebase Storage.
   * Génère un nouveau nom de fichier basé sur l'entité, un timestamp et le nom original.
   */
  async uploadFile(
    file: File,
    options: { entityId: string; entityType: string; createdBy: string }
  ): Promise<{ url: string; size: number; newFileName: string }> {
    // Génération d'un nom de fichier unique
    const timestamp = Date.now();
    const newFileName = `${options.entityType}-${options.entityId}-${timestamp}-${file.name}`;
    // Définition du chemin complet dans le bucket
    const path = `uploads/${options.entityType}/${options.entityId}/${newFileName}`;

    // Upload du fichier en utilisant l'utilitaire Firebase
    const url = await firebaseUploadFile(file, path);

    return {
      url,
      size: file.size,
      newFileName: path, // On retourne le chemin complet pour faciliter la suppression ultérieure
    };
  }

  /**
   * Suppression d'un fichier dans Firebase Storage.
   * Le paramètre fileName correspond ici au chemin complet du fichier dans le bucket.
   */
  async deleteFile(fileName: string): Promise<void> {
    await firebaseDeleteFile(fileName);
  }

  async getFileURL(fileName: string): Promise<string> {
    return await getFileURL(fileName);
  }
}
