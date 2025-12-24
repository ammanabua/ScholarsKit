import { getServerSession } from '@/lib/session'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await getServerSession()
    console.log('Session check - user exists:', !!session.user)
    console.log('Session check - user data:', session.user ? { id: session.user.id, email: session.user.email } : null)
    return NextResponse.json({ user: session.user || null })
  } catch (error) {
    console.error('Session fetch error:', error)
    return NextResponse.json({ user: null })
  }
}
