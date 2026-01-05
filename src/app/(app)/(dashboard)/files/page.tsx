'use client'
import React, { useState, useRef, DragEvent } from 'react'
import { FileText, Download, Trash2, Eye, RefreshCw, CloudUpload } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { 
  deleteStoredFile, 
  setCurrentDocument,
  getStoredFiles,
  saveStoredFiles
} from '@/components/shared/DocumentViewer'
import { StoredFile } from '@/interfaces/DocumentViewer'
import { useUserFiles } from '@/hooks/useUserFiles'
import { useAuth } from '@/providers/AuthProvider'

const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Format date to "23rd October, 2025; 10:00 AM"
const formatUploadDate = (dateString: string | undefined): string => {
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
const formatSizeToMB = (size: string | number | undefined): string => {
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

const FilesPage = () => {
  const router = useRouter()
  const { user } = useAuth()
  const { files, isLoading: loading, error, refetch } = useUserFiles()
  const [deleting, setDeleting] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  // Process and upload a file
  const processFile = async (selectedFile: File) => {
    if (!selectedFile.type.includes('pdf')) {
      toast.error('Please upload a PDF file')
      return
    }
    
    const MAX_FILE_SIZE = 3 * 1024 * 1024 // 3MB in bytes
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error('File size must be less than 3MB')
      return
    }
    
    setUploading(true)

    const reader = new FileReader()
    reader.onload = async () => {
      const base64Content = (reader.result as string).split(',')[1]
      const payload = {
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileContent: base64Content,
        userId: user?.id
      }
      try {
        const res = await fetch(API_GATEWAY_URL ?? '', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })
        if (!res.ok) {
          throw new Error('Upload failed')
        }
        const data = await res.json()
        console.log('Upload response:', data)
        console.log('Data keys:', Object.keys(data))
        // Prefer permanentUrl over fileUrl (fileUrl may be presigned/temporary)
        const urlToUse =  data.fileUrl
        console.log('URL to use:', urlToUse)
        if (urlToUse) {
          const newFile: StoredFile = {
            id: data.fileId || data.id || '',
            name: selectedFile.name,
            uploadedAt: new Date().toISOString(),
            size: formatFileSize(selectedFile.size),
            fileUrl: urlToUse,
            textUrl: data.textUrl || '',
            s3Key: data.s3Key || data.key,
            textS3Key: data.textS3Key || data.textKey || '',
            fileId: data.fileId || data.id,
            urlCreatedAt: new Date().toISOString(), // Track when signed URL was created
          }
          console.log('New file object:', newFile)
          // Add to files list
          const existingFiles = getStoredFiles()
          saveStoredFiles([newFile, ...existingFiles])
          // Set as current document and open in viewer
          setCurrentDocument(newFile)
          toast.success('File uploaded successfully')
          router.push('/dashboard')
        } else {
          toast.error('Upload succeeded but no file URL received')
        }
      } catch (error) {
        toast.error('Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
      } finally {
        setUploading(false)
      }
    }
    reader.onerror = () => {
      const error = reader.error
      toast.error(`Failed to read file: ${error?.message || 'Unknown error'}`)
      setUploading(false)
    }
    reader.readAsDataURL(selectedFile)
  }

  // File input handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return
    await processFile(selectedFile)
  }

  // Drag and drop handlers
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget as Node)) {
      setIsDragging(false)
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      await processFile(files[0])
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleView = (file: StoredFile) => {
    // Set as current document and navigate to dashboard
    setCurrentDocument(file)
    router.push('/dashboard')
  }

  const handleDownload = (file: StoredFile) => {
    // Open file URL in new tab for download
    window.open(file.fileUrl, '_blank')
  }

  const handleDelete = async (file: StoredFile) => {
    setDeleting(file.id)
    try {
      await deleteStoredFile(file)
      // Refetch files from server after deletion
      await refetch()
      toast.success('File deleted successfully')
    } catch (error) {
      toast.error('Failed to delete file: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading files...</div>
      </div>
    )
  }

  console.log('Files:', files)

  // Sort files by most recent first
  const sortedFiles = [...files].sort((a, b) => {
    const dateA = new Date(a.uploadedAt || 0).getTime()
    const dateB = new Date(b.uploadedAt || 0).getTime()
    return dateB - dateA
  })

  return (
    <div 
      ref={dropZoneRef}
      className="flex-1 flex flex-col relative min-h-screen"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Drag overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-500 bg-opacity-20 z-50 flex items-center justify-center border-4 border-dashed border-blue-500 rounded-lg h-screen">
          <div className="text-center">
            <CloudUpload className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <p className="text-xl font-semibold text-blue-700">Drop your PDF here</p>
            <p className="text-blue-600">Release to upload</p>
          </div>
        </div>
      )}

      {/* Upload overlay */}
      {uploading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-gray-700">Uploading file...</p>
          </div>
        </div>
      )}

      <div className="border-b border-gray-800 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Files</h1>
            <p className="text-gray-600 mt-2">View and manage all your uploaded documents</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleUploadClick}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CloudUpload className="w-5 h-5" />
              Upload PDF
            </button>
            <button
              onClick={refetch}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              title="Refresh files"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
        {error && (
          <p className="text-amber-600 text-sm mt-2">
            Could not fetch latest files from server. Showing cached files.
          </p>
        )}
      </div>

      <div className="flex-1 p-6">
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <CloudUpload className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No files uploaded yet</h3>
            <p className="text-gray-500 mb-4">Drag and drop a PDF here, or click the button below</p>
            <button
              onClick={handleUploadClick}
              disabled={uploading}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CloudUpload className="w-5 h-5" />
              Upload PDF
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedFiles.map((file) => (
              <div
                key={file.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-200"
              >
                {/* Thumbnail */}
                <div className="bg-gray-50 h-40 flex items-center justify-center relative overflow-hidden group">
                  <FileText className="w-12 h-12 text-blue-200" />
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/40 md:bg-black/0 md:group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleView(file)}
                      className="md:opacity-0 md:group-hover:opacity-100 p-2 bg-white rounded-full hover:bg-gray-100 transition-all shadow-md"
                      title="View file"
                    >
                      <Eye className="w-5 h-5 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDownload(file)}
                      className="md:opacity-0 md:group-hover:opacity-100 p-2 bg-white rounded-full hover:bg-gray-100 transition-all shadow-md"
                      title="Download file"
                    >
                      <Download className="w-5 h-5 text-green-600" />
                    </button>
                  </div>
                </div>

                {/* File Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 truncate text-sm mb-2" title={file.name}>
                    {file.name}
                  </h3>
                  <div className="text-xs text-gray-500 space-y-1 mb-4">
                    <p>Size: {formatSizeToMB(file.size)}</p>
                    <p>Uploaded: {formatUploadDate(file.uploadedAt)}</p>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(file)}
                    disabled={deleting === file.id}
                    className="w-full py-2 px-3 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                    {deleting === file.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default FilesPage