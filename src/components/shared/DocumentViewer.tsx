'use client'
import { CloudUpload } from 'lucide-react'
import React, { useEffect, useRef, useState, DragEvent } from 'react'
import GeneralLoader from './GeneralLoader';
import { toast } from 'react-toastify';
import { useAuth } from '@/providers/AuthProvider';
import { StoredFile } from '@/interfaces/DocumentViewer';

const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;
export const FILES_STORAGE_KEY = 'scholarskit_files';
export const CURRENT_DOC_KEY = 'scholarskit_current_doc';



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

interface DocumentViewerProps {
  onDocumentChange?: (hasDocument: boolean) => void;
}

const DocumentViewer = ({ onDocumentChange }: DocumentViewerProps = {}) => {
  const { user } = useAuth();
  const [currentFile, setCurrentFileState] = useState<StoredFile | null>(null);
  const [loading, setLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Wrapper to update state and notify parent
  const setCurrentFile = (file: StoredFile | null) => {
    setCurrentFileState(file);
    setCurrentDocument(file);
    onDocumentChange?.(file !== null);
  };

  // Check if signed URL has expired (1 hour from creation)
  const isUrlExpired = (file: StoredFile | null): boolean => {
    if (!file?.urlCreatedAt) return false; // No timestamp = assume valid (legacy files)
    const createdAt = new Date(file.urlCreatedAt).getTime();
    const now = Date.now();
    const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
    return now - createdAt > oneHour;
  };

  // Load persisted current document on mount
  useEffect(() => {
    const savedDoc = getCurrentDocument();
    console.log('DocumentViewer loading saved doc:', savedDoc);
    console.log('Saved doc fileUrl:', savedDoc?.fileUrl);
    if (savedDoc) {
      // Check if URL has expired
      if (isUrlExpired(savedDoc)) {
        console.log('Document URL has expired, clearing current document');
        setCurrentDocument(null);
        onDocumentChange?.(false);
        return;
      }
      setCurrentFileState(savedDoc);
      onDocumentChange?.(true);
    }
  }, [onDocumentChange]);

  // Check for URL expiration periodically (every minute)
  useEffect(() => {
    if (!currentFile) return;

    const checkExpiration = () => {
      if (isUrlExpired(currentFile)) {
        console.log('Document URL has expired, unmounting viewer');
        setCurrentFile(null);
        setPdfError(null);
      }
    };

    // Check every minute
    const interval = setInterval(checkExpiration, 60 * 1000);

    // Also check immediately in case it just expired
    checkExpiration();

    return () => clearInterval(interval);
  }, [currentFile]);

  console.log('DocumentViewer rendered with user:', user?.id);
  console.log('Current file state:', currentFile?.name, 'URL:', currentFile?.fileUrl);

  const handleUploadDocument = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const processFile = async (selectedFile: File) => {
    if (!selectedFile.type.includes('pdf')) {
      toast.error('Please upload a PDF file');
      return;
    }
    
    const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB in bytes
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error('File size must be less than 3MB');
      return;
    }
    
    setLoading(true);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Content = (reader.result as string).split(',')[1];
      const payload = {
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileContent: base64Content,
        userId: user?.id // Include user ID for DynamoDB
      };
      try {
        const res = await fetch(API_GATEWAY_URL ?? '', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          throw new Error('Upload failed');
        }
        const data = await res.json();
        console.log('Upload response (full):', JSON.stringify(data, null, 2));
        console.log('Data keys:', Object.keys(data));
        console.log('data.fileUrl:', data.fileUrl);
        console.log('data.permanentUrl:', data.permanentUrl);
        console.log('data.url:', data.url);
        console.log('data.signedUrl:', data.signedUrl);
        // Use fileUrl (signed URL) for immediate viewing after upload
        const urlToUse = data.fileUrl;
        if (urlToUse) {
          console.log('Setting docUrl to:', urlToUse);
          // Create file metadata with backend IDs for deletion
          const newFile: StoredFile = {
            id: crypto.randomUUID(),
            name: selectedFile.name,
            uploadedAt: new Date().toISOString().split('T')[0],
            size: formatFileSize(selectedFile.size),
            fileUrl: urlToUse,
            textUrl: data.textUrl || '',
            s3Key: data.s3Key || data.key, // S3 object key
            textS3Key: data.textS3Key || data.textKey || '', // S3 text object key
            fileId: data.fileId || data.id, // DynamoDB file ID
            urlCreatedAt: new Date().toISOString(), // Track when signed URL was created
          };
          // Add to files list
          const existingFiles = getStoredFiles();
          saveStoredFiles([newFile, ...existingFiles]);
          // Set as current document (wrapper handles localStorage and callback)
          setCurrentFile(newFile);
          setPdfError(null);
        } else {
          console.warn('No fileUrl in response');
        }
        toast.success('File uploaded successfully');
      } catch (error) {
        toast.error('Upload failed ' + (error instanceof Error ? error.message : 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => {
      const error = reader.error;
      console.error('FileReader error:', error);
      toast.error(`Failed to read file: ${error?.message || 'Unknown error'}`);
      setLoading(false);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    await processFile(selectedFile);
  };

  // Drag and drop handlers
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set isDragging to false if we're leaving the drop zone entirely
    if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  console.log('User:', user);
  return (
    <div className="flex w-full max-h-screen">
      <div className="bg-white w-full">
        <div className="w-full">
          <input
            type="file"
            accept="application/pdf"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <div className='flex flex-col w-full min-h-screen items-center justify-center gap-4'>
            {!currentFile && (
              <div className="w-full max-w-xl px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
                  Get Started with ScholarsKit
                </h1>
                <p className="text-gray-500 text-center mb-8">
                  Upload a PDF document to begin studying with AI assistance
                </p>
                
                {/* Drag and Drop Zone */}
                <div
                  ref={dropZoneRef}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={handleUploadDocument}
                  className={`
                    relative cursor-pointer
                    border-2 border-dashed rounded-2xl
                    p-12 transition-all duration-300 ease-in-out
                    flex flex-col items-center justify-center gap-4
                    ${isDragging 
                      ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
                      : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50'
                    }
                    ${loading ? 'pointer-events-none opacity-60' : ''}
                  `}
                >
                  {loading ? (
                    <GeneralLoader />
                  ) : (
                    <>
                      <div className={`
                        p-4 rounded-full transition-all duration-300
                        ${isDragging ? 'bg-blue-100' : 'bg-gradient-to-br from-blue-100 to-purple-100'}
                      `}>
                        <CloudUpload className={`
                          w-10 h-10 transition-all duration-300
                          ${isDragging ? 'text-blue-600 scale-110' : 'text-blue-500'}
                        `} />
                      </div>
                      
                      <div className="text-center">
                        <p className="text-lg font-medium text-gray-700">
                          {isDragging ? 'Drop your file here' : 'Drag & drop your PDF here'}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          or <span className="text-blue-600 font-medium hover:text-blue-700">browse files</span>
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <div className="h-px w-12 bg-gray-300"></div>
                        <span className="text-xs text-gray-400 uppercase tracking-wide">PDF only • Max 3MB</span>
                        <div className="h-px w-12 bg-gray-300"></div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
            {currentFile && (
              <div className="w-full flex flex-col items-center h-screen">
                {pdfError && <p className="text-red-600 mb-4">Error loading PDF: {pdfError}</p>}
                <iframe
                  ref={iframeRef}
                  src={currentFile.fileUrl}
                  className="w-full h-full"
                  style={{ border: '1px solid #ccc', borderRadius: '4px' }}
                  title="PDF Viewer"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default DocumentViewer;