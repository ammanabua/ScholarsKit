import { getServerSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession()
    session.destroy()

    const logoutUrl = `${process.env.NEXT_PUBLIC_COGNITO_ISSUER_URL}/logout?client_id=${process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID}&logout_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI || '')}`

    return NextResponse.redirect(logoutUrl);
}