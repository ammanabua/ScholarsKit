'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { StoredFile, saveStoredFiles, getStoredFiles } from '@/components/shared/DocumentViewer'

const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL

interface UseUserFilesResult {
  files: StoredFile[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Hook that listens to user authentication state and loads files associated with that user.
 * Files are fetched from the backend when the user is authenticated and cached in localStorage.
 */
export function useUserFiles(): UseUserFilesResult {
  const { user, isLoading: authLoading } = useAuth()
  const [files, setFiles] = useState<StoredFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUserFiles = useCallback(async (userId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Fetch files from backend for this user using path parameter
      const res = await fetch(`${API_GATEWAY_URL}/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        throw new Error('Failed to fetch files from server')
      }

      const data = await res.json()
      
      // Transform backend response to StoredFile format
      // Adjust this mapping based on your actual API response structure
      const fetchedFiles: StoredFile[] = (data.files || data || []).map((file: {
        fileId?: string;
        id?: string;
        fileName?: string;
        name?: string;
        uploadedAt?: string;
        createdAt?: string;
        fileSize?: string | number;
        size?: string;
        fileUrl?: string;
        permanentUrl?: string;
        s3Key?: string;
        textS3Key?: string;
        textUrl?: string;
      }) => ({
        id: file.fileId || file.id || crypto.randomUUID(),
        name: file.fileName || file.name || 'Unknown',
        uploadedAt: file.uploadedAt || file.createdAt || new Date().toISOString().split('T')[0],
        size: typeof file.fileSize === 'number' 
          ? formatFileSize(file.fileSize) 
          : file.fileSize || file.size || 'Unknown',
        fileUrl: file.fileUrl || file.permanentUrl || '',
        textUrl: file.textUrl || '',
        s3Key: file.s3Key || '',
        textS3Key: file.textS3Key || '',
        fileId: file.fileId || file.id,
      }))

      // Save to localStorage for offline access
      saveStoredFiles(fetchedFiles)
      setFiles(fetchedFiles)
    } catch (err) {
      console.error('Error fetching user files:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      
      // Fall back to localStorage if backend fails
      const cachedFiles = getStoredFiles()
      setFiles(cachedFiles)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refetch = useCallback(async () => {
    if (user?.id) {
      await fetchUserFiles(user.id)
    }
  }, [user?.id, fetchUserFiles])

  // Listen for user changes and fetch files
  useEffect(() => {
    if (authLoading) {
      // Still loading auth state
      return
    }

    if (user?.id) {
      // User is logged in, fetch their files
      fetchUserFiles(user.id)
    } else {
      // User is logged out, clear files
      setFiles([])
      saveStoredFiles([])
      setIsLoading(false)
    }
  }, [user?.id, authLoading, fetchUserFiles])

  return { files, isLoading, error, refetch }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
