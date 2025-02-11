import { FileUpload } from "./FileUpload";

interface FileUploadWrapperProps {
  entityId: string;
  entityType: string;
}

export function FileUploadWrapper({
  entityId,
  entityType,
}: FileUploadWrapperProps) {
  return <FileUpload entityId={entityId} entityType={entityType} />;
}
