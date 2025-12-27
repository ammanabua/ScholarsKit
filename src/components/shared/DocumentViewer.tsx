'use client'
import { ArrowRight, FileText, FolderPlus, PlusCircle } from 'lucide-react'
import React, { useRef, useState } from 'react'
import GeneralLoader from './GeneralLoader';
import { toast } from 'react-toastify';
import { useAuth } from '@/providers/AuthProvider';

const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

const DocumentViewer = () => {
  const { user } = useAuth();
  const [docUrl, setDocUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  console.log('DocumentViewer rendered with user:', user?.id);

  const handleUploadDocument = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
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
        console.log('Upload response:', data);
        console.log('Data keys:', Object.keys(data));
        const urlToUse = data.url || data.permanentUrl;
        if (urlToUse) {
          console.log('Setting docUrl to:', urlToUse);
          // Use the signed URL directly - no need to fetch as blob
          setDocUrl(urlToUse);
          setPdfError(null);
        } else {
          console.warn('No url in response');
        }
        toast.success('File uploaded successfully');
      } catch (error) {
        toast.error('Upload failed ' + (error instanceof Error ? error.message : 'Unknown error'));
        alert('Upload failed');
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => {
      const error = reader.error;
      console.error('FileReader error:', error);
      alert(`Failed to read file: ${error?.message || 'Unknown error'}`);
      setLoading(false);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleCreateCourse = () => {
    // Logic to handle course creation
    console.log("Create Course clicked");
  };

  return (
    <div className="flex w-full max-h-screen overflow-y-scroll">
      <div className="bg-white w-full">
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-gray-600" />
            <span className="text-gray-800 font-medium">Welcome {user?.username || user?.email || 'User'}</span>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
        <div className="w-full">
          <input
            type="file"
            accept="application/pdf"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <div className='flex flex-col w-full min-h-[60vh] items-center justify-center gap-4'>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              {docUrl ? 'Your Document' : 'Get Started with ScholarsKit'}
            </h1>
            <div className='flex gap-4'>
              <button onClick={handleUploadDocument} className='flex border border-yellow-600 p-4 rounded-lg text-gray-700 gap-2 cursor-pointer' disabled={loading}><PlusCircle />Upload</button>
              <button onClick={handleCreateCourse} className='flex border border-yellow-600 p-4 rounded-lg text-gray-700 gap-2 cursor-pointer'><FolderPlus />Create a Course</button>
            </div>
            {loading && <GeneralLoader />}
            {docUrl && (
              <div className="mt-8 w-full flex flex-col items-center">
                {pdfError && <p className="text-red-600 mb-4">Error loading PDF: {pdfError}</p>}
                <iframe
                  ref={iframeRef}
                  src={docUrl}
                  width="100%"
                  height="600"
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