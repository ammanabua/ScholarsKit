'use client'
import AiChat from '@/components/shared/AiChat'
import DocumentViewer from '@/components/shared/DocumentViewer'
import React from 'react'

const page = () => {
  return (
    <div className="flex w-full min-h-screen bg-gray-50">
        {/* MAIN CONTENT */}
        <DocumentViewer />
        {/* Right Sidebar - AI Chat */}
        <AiChat />
    </div>
  )
}

export default page