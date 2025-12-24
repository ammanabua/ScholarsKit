import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { sessionOptions, SessionData } from '@/lib/session'

export async function GET() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
  if (!session.user) {
    return NextResponse.json({ user: null, preferences: null }, { status: 200 })
  }
  return NextResponse.json({ user: session.user, preferences: session.preferences ?? null }, { status: 200 })
}
