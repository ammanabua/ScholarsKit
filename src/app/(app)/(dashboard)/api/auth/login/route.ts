import { getCognitoClient } from "@/lib/cognito";
import { generators } from "openid-client";
import { getServerSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
    const client = await getCognitoClient()
    const session = await getServerSession()
    
    const nonce = generators.nonce()
    const state = generators.state()

    session.nonce = nonce
    session.state = state
    await session.save()

    const authUrl = client.authorizationUrl({
        scope: 'openid email profile',
        nonce,
        state,
    })


    return NextResponse.redirect(authUrl);
}