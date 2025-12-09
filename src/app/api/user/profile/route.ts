import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { sessionOptions, SessionData } from '@/lib/session'

export async function POST(request: Request) {
  try {
    const { fullName, avatar } = await request.json()

    const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
    if (!session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Store simple profile fields in session (demo purposes)
    session.user.name = fullName || session.user.name
    if (avatar) {
      // Optionally store a small avatar URL or identifier
      session.user.avatar = avatar
    }
    await session.save()

    return NextResponse.json({ ok: true, user: session.user })
  } catch (error) {
    console.error('Save profile error:', error)
    const message = error instanceof Error ? error.message : 'Unable to save profile'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
