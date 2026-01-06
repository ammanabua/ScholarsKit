export interface StoredFile {
  id: string;
  name: string;
  uploadedAt: string;
  size: string;
  fileUrl: string;
  s3Key?: string; // S3 object key for deletion
  textS3Key?: string; // S3 text object key for deletion
  fileId?: string; // DynamoDB file ID for deletion
  textUrl?: string; // URL to extracted text file
  urlCreatedAt?: string; // Timestamp when signed URL was created (for expiration tracking)
}

export interface DocumentViewerProps {
  onDocumentChange?: (hasDocument: boolean) => void;
}
