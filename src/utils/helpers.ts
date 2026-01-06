import { StoredFile } from "@/interfaces/DocumentViewer"


export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Format date to "23rd October, 2025; 10:00 AM"
export const formatUploadDate = (dateString: string | undefined): string => {
  if (!dateString) return 'Unknown'
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    
    const day = date.getDate()
    const month = date.toLocaleString('en-US', { month: 'long' })
    const year = date.getFullYear()
    const time = date.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    
    // Get ordinal suffix
    const getOrdinal = (n: number): string => {
      const s = ['th', 'st', 'nd', 'rd']
      const v = n % 100
      return n + (s[(v - 20) % 10] || s[v] || s[0])
    }
    
    return `${getOrdinal(day)} ${month}, ${year}; ${time}`
  } catch {
    return dateString
  }
}

// Convert any size string or number to MB format
export const formatSizeToMB = (size: string | number | undefined): string => {
  if (size === undefined || size === null) return 'Unknown'
  
  // If it's a number, treat as bytes
  if (typeof size === 'number') {
    const mb = size / (1024 * 1024)
    return mb < 0.01 ? '< 0.01 MB' : mb.toFixed(2) + ' MB'
  }
  
  if (!size || size === 'Unknown') return 'Unknown'
  
  // Try to parse the size string
  const match = String(size).match(/^([\d.]+)\s*(Bytes|KB|MB|GB)$/i)
  if (!match) return String(size)
  
  const value = parseFloat(match[1])
  const unit = match[2].toUpperCase()
  
  let bytes = 0
  switch (unit) {
    case 'BYTES':
      bytes = value
      break
    case 'KB':
      bytes = value * 1024
      break
    case 'MB':
      bytes = value * 1024 * 1024
      break
    case 'GB':
      bytes = value * 1024 * 1024 * 1024
      break
    default:
      return String(size)
  }
  
  // Convert to MB
  const mb = bytes / (1024 * 1024)
  return mb < 0.01 ? '< 0.01 MB' : mb.toFixed(2) + ' MB'
}

export const FILES_STORAGE_KEY = 'scholarskit_files';
export const CURRENT_DOC_KEY = 'scholarskit_current_doc';
const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

export const getStoredFiles = (): StoredFile[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(FILES_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveStoredFiles = (files: StoredFile[]) => {
  localStorage.setItem(FILES_STORAGE_KEY, JSON.stringify(files));
};

// Delete file from localStorage only
export const deleteStoredFileLocal = (fileId: string) => {
  const files = getStoredFiles();
  const updatedFiles = files.filter(f => f.id !== fileId);
  saveStoredFiles(updatedFiles);
  // Clear current doc if it was the deleted file
  const currentDoc = localStorage.getItem(CURRENT_DOC_KEY);
  if (currentDoc) {
    const parsed = JSON.parse(currentDoc);
    if (parsed.id === fileId) {
      localStorage.removeItem(CURRENT_DOC_KEY);
    }
  }
  return updatedFiles;
};

// Delete file from backend (S3 and DynamoDB) and localStorage
export const deleteStoredFile = async (file: StoredFile): Promise<StoredFile[]> => {
  // Call API Gateway to delete from S3 and DynamoDB
  if (file.s3Key || file.fileId) {
    try {
      const res = await fetch(API_GATEWAY_URL ?? '', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          s3Key: file.s3Key,
          textS3Key: file.textS3Key,
          fileId: file.fileId,
          fileName: file.name,
        }),
      });
      if (!res.ok) {
        throw new Error('Failed to delete from server');
      }
    } catch (error) {
      console.error('Error deleting from backend:', error);
      throw error;
    }
  }
  
  // Delete from localStorage
  return deleteStoredFileLocal(file.id);
};

export const setCurrentDocument = (file: StoredFile | null) => {
  if (file) {
    localStorage.setItem(CURRENT_DOC_KEY, JSON.stringify(file));
  } else {
    localStorage.removeItem(CURRENT_DOC_KEY);
  }
};

export const getCurrentDocument = (): StoredFile | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(CURRENT_DOC_KEY);
  return stored ? JSON.parse(stored) : null;
};

