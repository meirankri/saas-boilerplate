import { FileDisplay } from "./FileDisplay";

interface FileDisplayWrapperProps {
  id: string;
  entityId: string;
  entityType: string;
  fileName: string;
  onDelete?: () => void;
}

export function FileDisplayWrapper({
  id,
  entityId,
  entityType,
  fileName,
  onDelete,
}: FileDisplayWrapperProps) {
  return (
    <FileDisplay
      id={id}
      entityId={entityId}
      entityType={entityType}
      fileName={fileName}
      onDelete={onDelete}
    />
  );
}
