'use client'
import AiChat from '@/components/shared/AiChat'
import DocumentViewer from '@/components/shared/DocumentViewer'
import { useAuth } from '@/hooks/useAuth'
import { User } from '@/lib/session'

const DashboardPage = ({ user }: { user?: User }) => {
  useAuth(user)
  
  return (
    <div className="flex w-full min-h-screen bg-gray-50">
        {/* MAIN CONTENT */}
        <DocumentViewer />
        {/* Right Sidebar - AI Chat */}
        <AiChat />
    </div>
  )
}

export default DashboardPage