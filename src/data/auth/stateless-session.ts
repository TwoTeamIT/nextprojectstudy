"use server";

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { AuthUser, JWTToken, SessionPayload } from './definitions';
import { SECRET } from '@/configs';

const secretKey = SECRET; //process.env.SECRET;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(key);
}

export async function encryptTokens(payload: { accessToken: JWTToken, refreshToken: JWTToken }) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(key);
}

export async function decrypt(session: string) {
    try {
        const { payload } = await jwtVerify(session, key, {
            algorithms: ['HS256'],
        });
        return payload as SessionPayload;
    } catch {
        return null;
    }
}

export async function createSession(user: AuthUser, expiryDate: string) {
    const cookieStore = await cookies();
    const expiresAt = new Date(expiryDate);
    const session = await encrypt({ user, expiresAt });

    cookieStore.set('session', session, {
        httpOnly: true,
        secure: false, //process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24,
        sameSite: 'lax',
        path: '/',
    });
}

export async function updateSessionTokens(accessToken: JWTToken, refreshToken: JWTToken) {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    if (!session) return null;

    const payload = await decrypt(session);
    if (!payload) return null;

    if (typeof payload.user !== 'object' || payload.user === null)
        throw new Error('Invalid session payload: user is not an object');

    const updatedPayload = {
        ...payload,
        user: { ...payload.user, accessToken: accessToken, refreshToken: refreshToken }
    };

    const expires = new Date(refreshToken.expiryDate);
    const newSession = await encrypt({ ...updatedPayload, expiresAt: expires });

    cookieStore.set('session', newSession, {
        httpOnly: true,
        secure: false, //process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24,
        sameSite: 'lax',
        path: '/'
    });

    return true;
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
}

export async function deleteSessionMiddleware() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
    return;
}

export async function verifySession() {
    const cookieStore = await cookies();
    const cookie = cookieStore.get('session')?.value;
    if (!cookie) return undefined;
    const session = await decrypt(cookie);

    if (!session?.user) return undefined;

    return { isAuth: true, user: session.user, expiresAt: session.expiresAt };
}

export async function getSession(): Promise<SessionPayload | undefined> {
    const cookieStore = await cookies();
    const cookie = cookieStore.get('session')?.value;
    if (!cookie) return undefined;
    const session = await decrypt(cookie);

    if (!session?.user) return undefined;

    return {
        user: session.user,
        expiresAt: session.expiresAt,
    }
}

export async function getSessionTokens<E extends new (message?: string) => Error>(
    errorsToCatch?: E[]
): Promise<[null, string, string] | [InstanceType<E>]> {
    return getSession()
        .then(session => {
            if (!session) throw new Error('No session data available');

            const accessToken = session?.user?.accessToken?.token;
            const refreshToken = session?.user?.refreshToken?.token;

            if (!accessToken && !refreshToken) throw new Error('Missing access and refresh token');
            else if (!accessToken) throw new Error('Missing access token');
            else if (!refreshToken) throw new Error('Missing refresh token');

            return [null, accessToken, refreshToken] as [null, string, string];
        })
        .catch(error => {
            if (errorsToCatch == undefined || errorsToCatch.some(e => error instanceof e))
                return [error];
            throw error;
        });
}