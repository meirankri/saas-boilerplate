"use client";

import { useState } from "react";
import { FileDisplayWrapper } from "../FileDisplay/FileDisplayWrapper";
import { toast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";

interface Document {
  id: string;
  entityId: string;
  entityType: string;
  fileName: string;
}

interface FileListProps {
  initialDocuments: Document[];
}

export function FileList({ initialDocuments }: FileListProps) {
  const [documents, setDocuments] = useState(initialDocuments);
  const t = useTranslations("FileManagement");

  const refreshDocuments = async () => {
    try {
      const response = await fetch("/api/documents");
      if (!response.ok) throw new Error(t("loadError"));
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      toast({
        title: t("loadError"),
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{t("yourFiles")}</h2>
      {documents.length === 0 ? (
        <p className="text-gray-500">{t("noFiles")}</p>
      ) : (
        <div className="space-y-4">
          {documents.map((doc) => (
            <FileDisplayWrapper
              key={doc.id}
              id={doc.id}
              entityId={doc.entityId}
              entityType={doc.entityType}
              fileName={doc.fileName}
              onDelete={refreshDocuments}
            />
          ))}
        </div>
      )}
    </div>
  );
}
