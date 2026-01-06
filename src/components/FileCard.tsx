import { StoredFile } from "@/interfaces/DocumentViewer"
import { deleteStoredFile, setCurrentDocument } from "@/utils/helpers"
import { formatSizeToMB, formatUploadDate } from "@/utils/helpers"
import { FileText, Eye, Download, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { JSX, useState } from "react"
import { toast } from "react-toastify"
import { useUserFiles } from "@/hooks/useUserFiles"

type FileCardProps = {
    file: StoredFile,
}


const FileCard = ({ file }: FileCardProps): JSX.Element => {
    const router = useRouter()
    const { refetch } = useUserFiles()

    const [deleting, setDeleting] = useState<string | null>(null)

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

  return (
    <>
        <div
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
    </>
  )
}

export default FileCard