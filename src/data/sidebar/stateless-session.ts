"use server";

import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from 'jose';
import { SessionPayload } from './definitions';
import { SECRET } from '@/configs';

const secretKey = SECRET; //process.env.SECRET;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(payload.expiresAt)
        .sign(key);
}

export async function decrypt(session: string | undefined = '') {
    try {
        const { payload } = await jwtVerify(session, key, {
            algorithms: ['HS256'],
        });
        return payload as SessionPayload;
    } catch {
        return null;
    }
}

export async function createSidebarSession(sidebarExpanded: boolean = true) {
    const cookieStore = await cookies();
    const expiresAt = new Date();
    expiresAt.setDate(new Date().getDate() + 365);
    const session = await encrypt({ sidebarExpanded, expiresAt });

    cookieStore.set('sidebar', session, {
        httpOnly: true,
        secure: false, //process.env.NODE_ENV === 'production',
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    });
}

export async function updateSidebarSession(sidebarExpanded: boolean = true) {
    const cookieStore = await cookies();
    const session = cookieStore.get('sidebar')?.value;
    const payload = await decrypt(session);

    if (!session || !payload) return null;

    const expiresAt = new Date();
    expiresAt.setDate(new Date().getDate() + 365);
    const newSession = await encrypt({ sidebarExpanded, expiresAt });

    cookieStore.set('sidebar', newSession, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
        domain: undefined
    });
}

export async function deleteSidebarSession() {
    const cookieStore = await cookies();
    cookieStore.delete('sidebar');
}

export async function getSidebarSession() {
    const cookieStore = await cookies();
    const cookie = cookieStore.get('sidebar')?.value;
    const session = await decrypt(cookie);

    if (!session) {
        await createSidebarSession();
        return getSidebarSession();
    }

    return {
        sidebarExpanded: session.sidebarExpanded,
        expiresAt: session.expiresAt,
    }
}

/*
export async function getSidebarState(): Promise<boolean> {
    const cookieStore = cookies();
    const sidebarState = cookieStore.get('sidebarExpanded');
    return sidebarState?.value === 'true';
}

export async function setSidebarState(open: boolean): Promise<void> {
    const cookieStore = cookies();
    cookieStore.set('sidebarExpanded', open.toString(), { path: '/', httpOnly: false });
}
*/

