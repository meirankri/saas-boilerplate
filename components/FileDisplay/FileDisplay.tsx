"use client";

import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface FileDisplayProps {
  id: string;
  entityId: string;
  entityType: string;
  fileName: string;
  onDelete?: () => void;
}

export function FileDisplay({
  id,
  entityId,
  entityType,
  fileName,
  onDelete,
}: FileDisplayProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const t = useTranslations("FileManagement");

  const getFile = async () => {
    try {
      setIsLoading(true);
      const fullPath = `${fileName}`;

      const response = await fetch("/api/files/get-signed-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileName: fullPath }),
      });

      if (!response.ok) {
        throw new Error(t("downloadError"));
      }

      const { url } = await response.json();
      window.open(url, "_blank");
    } catch (error) {
      toast({
        title: t("downloadError"),
        description: error instanceof Error ? error.message : "Erreur inconnue",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFile = async () => {
    const confirm = window.confirm(t("deleteConfirmation"));
    if (!confirm) return;
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/files/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(t("deleteError"));
      }

      toast({
        title: t("deleteSuccess"),
      });

      onDelete?.();
    } catch (error) {
      toast({
        title: t("deleteError"),
        description: error instanceof Error ? error.message : "Erreur inconnue",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg">
      <div className="flex-1">
        <p className="font-medium">{fileName}</p>
        <p className="text-sm text-gray-500">
          {entityType} - {entityId}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={getFile}
          disabled={isLoading || isDeleting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? t("loading") : t("download")}
        </button>
        <button
          onClick={deleteFile}
          disabled={isLoading || isDeleting}
          className="p-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          title={t("delete")}
        >
          {isDeleting ? "..." : <Trash2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
