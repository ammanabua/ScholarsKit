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
}

export const sessionOptions = {
    cookieName: "app_session",
    password: process.env.SESSION_PASSWORD!,
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
}

export async function getServerSession(): Promise<IronSession<SessionData>> {
    return getIronSession<SessionData>(await cookies(), sessionOptions);
}