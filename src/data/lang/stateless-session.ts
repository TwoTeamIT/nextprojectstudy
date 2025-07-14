"use server";

import { cookies } from 'next/headers';
import { SessionPayload } from './definitions';
import { jwtVerify, SignJWT } from 'jose';
import { Locale } from '@/i18n-config';
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

export async function createLanguageSession(lang: Locale, expiryDate: string) {
    const cookieStore = await cookies();
    const expiresAt = new Date(expiryDate);
    const session = await encrypt({ lang, expiresAt });

    cookieStore.set('language', session, {
        httpOnly: true,
        secure: false, //process.env.NODE_ENV === 'production',
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    });
}

export async function updateLanguageSession(expiryDate: string, newLang: Locale) {
    const cookieStore = await cookies();
    const session = cookieStore.get('language')?.value;
    const payload = await decrypt(session);

    if (!session || !payload) return null;

    const expires = new Date(expiryDate);
    const newSession = await encrypt({ lang: newLang, expiresAt: expires });

    cookieStore.set('language', newSession, {
        httpOnly: true,
        secure: false, // process.env.NODE_ENV === 'production',
        expires: expires,
        sameSite: 'lax',
        path: '/',
    });
}

export async function deleteLanguageSession() {
    const cookieStore = await cookies();
    cookieStore.delete('language');
}

export async function getLanguageSession() {
    const cookieStore = await cookies();
    const cookie = cookieStore.get('language')?.value;
    const session = await decrypt(cookie);

    if (!session?.lang) return undefined;

    return {
        lang: session.lang,
        expiresAt: session.expiresAt,
    }
}