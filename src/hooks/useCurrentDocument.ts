'use client'

import { useState, useEffect, useCallback } from 'react'
import { StoredFile, getCurrentDocument, setCurrentDocument as setStoredCurrentDocument } from '@/components/shared/DocumentViewer'

interface UseCurrentDocumentResult {
  currentDocument: StoredFile | null
  setCurrentDocument: (file: StoredFile | null) => void
  hasDocument: boolean
}

/**
 * Hook to manage the current document being viewed.
 * Syncs with localStorage and provides reactive state.
 */
export function useCurrentDocument(): UseCurrentDocumentResult {
  const [currentDocument, setCurrentDocumentState] = useState<StoredFile | null>(null)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = getCurrentDocument()
    if (saved) {
      setCurrentDocumentState(saved)
    }
  }, [])

  const setCurrentDocument = useCallback((file: StoredFile | null) => {
    setCurrentDocumentState(file)
    setStoredCurrentDocument(file)
  }, [])

  return {
    currentDocument,
    setCurrentDocument,
    hasDocument: currentDocument !== null,
  }
}
