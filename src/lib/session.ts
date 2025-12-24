import { cookies } from "next/headers";
import { getIronSession, IronSession } from "iron-session";

export interface User {
    id: string;
    username: string;
    email: string;
    [key: string]: string | number | undefined;
}

export interface SessionData {
    user?: User;
    nonce?: string;
    state?: string;
    accessToken?: string;
    refreshToken?: string;
    preferences?: {
        theme?: string;
        notifyProduct?: boolean;
        notifySecurity?: boolean;
    };
}

export const sessionOptions = {
    cookieName: "app_session",
    // Use server-only env var - never expose session password to client
    password: process.env.SESSION_PASSWORD!,
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: 'lax' as const,
        // Cookie expires in 7 days (in seconds)
        maxAge: 60 * 60 * 24 * 7,
    },
}

export async function getServerSession(): Promise<IronSession<SessionData>> {
    return getIronSession<SessionData>(await cookies(), sessionOptions);
}