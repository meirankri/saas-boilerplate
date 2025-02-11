export interface StorageService {
  uploadFile(
    file: File,
    options: {
      entityId: string;
      entityType: string;
      createdBy: string;
    }
  ): Promise<{
    url: string;
    size: number;
    newFileName: string;
  }>;

  deleteFile(fileName: string): Promise<void>;
}
