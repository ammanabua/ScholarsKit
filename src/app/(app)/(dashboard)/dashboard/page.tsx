'use client'
import AiChat from '@/components/shared/AiChat'
import DocumentViewer from '@/components/shared/DocumentViewer'
import { useAuth } from '@/hooks/useAuth'
import { User } from '@/lib/session'
import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

const DashboardPage = ({ user }: { user?: User }) => {
  useAuth(user)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const loginSuccess = searchParams.get('login') === 'success'
    if (loginSuccess) {
      toast.success('Signed in successfully!')
      // Clean the URL to remove the query flag
      router.replace('/dashboard')
    }
  }, [searchParams, router])
  
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