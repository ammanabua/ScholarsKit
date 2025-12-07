import { NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { sessionOptions } from '@/lib/session'

export async function GET(request: Request) {
  const cookieStore = await cookies()
  const session = await getIronSession(cookieStore, sessionOptions)

  // Destroy local session
  session.destroy()

  // If a hosted UI logout is configured, redirect there
  const url = new URL(request.url)
  const clientId = process.env.COGNITO_CLIENT_ID || process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID
  const hostedDomain = process.env.COGNITO_HOSTED_UI_DOMAIN || process.env.NEXT_PUBLIC_COGNITO_HOSTED_UI_DOMAIN
  const postLogout = process.env.COGNITO_LOGOUT_REDIRECT_URI || `${url.origin}/`

  if (clientId && hostedDomain) {
    const logoutUrl = new URL(`https://${hostedDomain}/logout`)
    logoutUrl.searchParams.set('client_id', clientId)
    logoutUrl.searchParams.set('logout_uri', postLogout)
    return NextResponse.redirect(logoutUrl.toString())
  }

  return NextResponse.redirect(postLogout)
}
