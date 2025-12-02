import { getCognitoClient } from "@/lib/cognito";
import { getServerSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const client = await getCognitoClient()
        const session = await getServerSession()

        const params = client.callbackParams(req.url)
        const tokenSet = await client.callback(
            `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
            params,
            {
                nonce: session.nonce,
                state: session.state,
            }
        )

        const userInfo = await client.userinfo(tokenSet.access_token!)

        session.user = {
            id: userInfo.sub!,
            email: userInfo.email!,
            username: userInfo.preferred_username || userInfo.email || userInfo.sub!,
        }
        await session.save()

        NextResponse.redirect('/dashboard')
    } catch (error) {
        console.error('Error in auth callback:', error);
        return NextResponse.redirect('/login');
    }
}
    