'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { User } from '@/lib/session'
import GeneralLoader from '@/components/shared/GeneralLoader'

interface AuthProviderProps {
  children: ReactNode
  requireAuth?: boolean
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | undefined>(undefined)

  const protectedRoutes = ['/dashboard', '/courses', '/files', '/settings']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch('/api/auth/session')
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error('Failed to fetch session:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSession()
  }, [])

  useEffect(() => {
    if (!isLoading && isProtectedRoute && !user) {
      router.push('/sign-in')
    }
  }, [isLoading, isProtectedRoute, user, router])

  if (isLoading) {
    return <GeneralLoader />
  }

  if (isProtectedRoute && !user) {
    return <GeneralLoader />
  }

  return <>{children}</>
}
