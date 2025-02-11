import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { R2 } from "@/config/storage";
import { logger } from "@/utils/logger";

export const uploadFile = async (
  file: Buffer,
  bucket: string,
  fileName: string
) => {
  try {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: fileName,
      Body: file,
    });

    return await R2.send(command);
  } catch (error) {
    logger({
      message: "R2 upload error",
      context: error,
    }).error();
    throw error;
  }
};

export const getFile = async (bucket: string, fileName: string) => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: fileName,
  });

  const response = await R2.send(command);

  if (!response.Body) {
    throw new Error("Fichier non trouvé");
  }

  const blob = await response.Body.transformToByteArray();
  const file = new Blob([blob], {
    type: response.ContentType || "application/octet-stream",
  });

  const url = URL.createObjectURL(file);

  return {
    url,
    filename: fileName,
    cleanup: () => URL.revokeObjectURL(url),
  };
};

export const deleteFile = async (
  bucket: string,
  fileName: string
): Promise<void> => {
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: fileName,
  });
  await R2.send(command);
};

export const getSignedFileUrl = async (bucket: string, fileName: string) => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: fileName,
  });

  const signedUrl = await getSignedUrl(R2, command, { expiresIn: 3600 });
  return signedUrl;
};
