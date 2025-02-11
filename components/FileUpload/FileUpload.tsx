"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";

import { toast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";
import env from "@/lib/env";
import { logger } from "@/utils/logger";

interface FileUploadProps {
  entityId: string;
  entityType: string;
}

export function FileUpload({ entityId, entityType }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const t = useTranslations("FileUpload");
  const maxFileSize = env.NEXT_PUBLIC_MAX_FILE_SIZE;

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async (acceptedFiles) => {
      try {
        const file = acceptedFiles[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("entityId", entityId);
        formData.append("entityType", entityType);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const data = await response.json();
        toast({
          title: t("uploadSuccess"),
          description: data.message,
        });
      } catch (error) {
        logger({
          message: "Upload error",
          context: error,
        }).error();
        toast({
          title: t("uploadError"),
          description:
            error instanceof Error ? error.message : "Erreur inconnue",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    },
    maxSize: maxFileSize,
    onDropRejected: () => {
      toast({
        title: t("uploadError"),
        description: t("fileTooLarge", {
          maxSize: Math.round(maxFileSize / (1024 * 1024)),
        }),
        variant: "destructive",
      });
    },
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
    >
      <input {...getInputProps()} />
      {isUploading ? (
        <p>{t("uploading")}</p>
      ) : (
        <div>
          <p>{t("upload")}</p>
          <p className="text-sm text-gray-500 mt-1">
            {t("maxFileSize", {
              maxSize: Math.round(maxFileSize / (1024 * 1024)),
            })}
          </p>
        </div>
      )}
    </div>
  );
}
