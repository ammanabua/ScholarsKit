import { getServerSession } from '@/lib/session'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await getServerSession()
    return NextResponse.json({ user: session.user || null })
  } catch (error) {
    console.error('Session fetch error:', error)
    return NextResponse.json({ user: null })
  }
}
