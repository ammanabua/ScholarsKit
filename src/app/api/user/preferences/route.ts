import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { sessionOptions, SessionData } from '@/lib/session'

export async function POST(request: Request) {
  try {
    const { theme, notifyProduct, notifySecurity } = await request.json()

    const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
    session.preferences = {
      theme,
      notifyProduct: Boolean(notifyProduct),
      notifySecurity: Boolean(notifySecurity),
    }
    await session.save()

    return NextResponse.json({ ok: true, preferences: session.preferences })
  } catch (error) {
    console.error('Save preferences error:', error)
    const message = error instanceof Error ? error.message : 'Unable to save preferences'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
