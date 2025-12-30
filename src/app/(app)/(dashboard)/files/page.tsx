'use client'
import React, { useState } from 'react'
import { FileText, Download, Trash2, Eye, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { 
  StoredFile, 
  deleteStoredFile, 
  setCurrentDocument 
} from '@/components/shared/DocumentViewer'
import { useUserFiles } from '@/hooks/useUserFiles'

const FilesPage = () => {
  const router = useRouter()
  const { files, isLoading: loading, error, refetch } = useUserFiles()
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleView = (file: StoredFile) => {
    // Set as current document and navigate to dashboard
    setCurrentDocument(file)
    router.push('/dashboard')
  }

  const handleDownload = (file: StoredFile) => {
    // Open file URL in new tab for download
    window.open(file.url, '_blank')
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

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Files</h1>
            <p className="text-gray-600 mt-2">View and manage all your uploaded documents</p>
          </div>
          <button
            onClick={refetch}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            title="Refresh files"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
        {error && (
          <p className="text-amber-600 text-sm mt-2">
            Could not fetch latest files from server. Showing cached files.
          </p>
        )}
      </div>

      <div className="flex-1 p-6">
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <FileText className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No files uploaded yet</h3>
            <p className="text-gray-500">Upload your first document to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {files.map((file) => (
              <div
                key={file.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-200"
              >
                {/* Thumbnail */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 h-40 flex items-center justify-center relative overflow-hidden group">
                  <FileText className="w-12 h-12 text-blue-400" />
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleView(file)}
                      className="opacity-0 group-hover:opacity-100 p-2 bg-white rounded-full hover:bg-gray-100 transition-all"
                      title="View file"
                    >
                      <Eye className="w-5 h-5 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDownload(file)}
                      className="opacity-0 group-hover:opacity-100 p-2 bg-white rounded-full hover:bg-gray-100 transition-all"
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
                    <p>Size: {file.size}</p>
                    <p>Uploaded: {file.uploadedAt}</p>
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