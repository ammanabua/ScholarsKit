'use client'
import AiChat from '@/components/shared/AiChat'
import DocumentViewer from '@/components/shared/DocumentViewer'
import { Suspense, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

function DashboardContent() {
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

const DashboardPage = () => {
  return (
    <Suspense fallback={
      <div className="flex w-full min-h-screen bg-gray-50 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}

export default DashboardPage