import { NextRequest, NextResponse } from 'next/server';
import { deleteSessionMiddleware, getSession, updateSessionTokens } from './data/auth/stateless-session';
import { i18n } from "./i18n-config";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { getLanguageSession } from './data/lang/stateless-session';
import { checkTokenValidity, refreshTokens } from './lib/middlewareInterceptorSetter';
import { JWTToken, SessionPayload as AuthSessionPayload } from './data/auth/definitions';
import { DEBUG, PROTECTED_ROUTES } from './configs';

async function getLocale(request: NextRequest): Promise<string | undefined> {
    const cookieLang = await getLanguageSession();
    if (cookieLang && cookieLang.lang) return cookieLang.lang;

    // Negotiator expects plain object so we need to transform headers
    const negotiatorHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

    const locales: readonly string[] = i18n.locales;

    // Use negotiator and intl-localematcher to get best locale
    const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
        locales as string[],
    );

    return matchLocale(languages, locales, i18n.defaultLocale);
}

async function checkAndUpdateSession(session: AuthSessionPayload): Promise<boolean> {
    let updated = false;
    if (session.user != null) {
        const isAccessTokenValid = await checkTokenValidity(session.user.accessToken.token, 'access');
        if (!isAccessTokenValid) {
            const isRefreshTokenValid = await checkTokenValidity(session.user.refreshToken.token, 'refresh');
            if (!isRefreshTokenValid) await deleteSessionMiddleware();
            else {
                const tokens = await refreshTokens(session.user.refreshToken.token);
                const newAccessToken: JWTToken = { token: tokens.accessToken, expiryDate: tokens.accessTokenExpiry };
                const newRefreshToken: JWTToken = { token: tokens.refreshToken, expiryDate: tokens.refreshTokenExpiry };

                const res = await updateSessionTokens(newAccessToken, newRefreshToken);
                if (res) updated = res;
            }
        }
    }
    return updated;
}

export default async function middleware(request: NextRequest) {
    if (DEBUG) console.log('   -> Middleware triggered for:', request.url);

    // 1. Check if the current route is protected or public
    const pathname = request.nextUrl.pathname;
    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.includes(route));

    // 2. Decrypt the session from the cookie
    let session = await getSession();

    // 3. Check tokens validity before each navigation request
    if (session) {
        const updated = await checkAndUpdateSession(session);

        // 4. Update session state after poossible tokens refresh
        if (updated) session = await getSession();
    }

    // 5. Check if there is any supported locale in the pathname
    let locale: string | undefined;
    const pathnameIsMissingLocale = !i18n.locales.some((loc) => {
        if (pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`) {
            locale = loc;
            return true;
        }
        return false;
    });

    let finalPathname = '';

    const isInexistentLocale = locale && !i18n.locales.some(loc => loc === locale);

    if (pathnameIsMissingLocale) {
        locale = await getLocale(request);
        finalPathname = `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`;
    }
    else if (isInexistentLocale)
        finalPathname = `/${i18n.defaultLocale}${pathname.replace(`/${locale}`, '')}`;
    else finalPathname = `${pathname.startsWith("/") ? "" : "/"}${pathname}`;

    if (DEBUG) console.log('   -> Final pathname:', finalPathname);

    // 6. Redirect
    if (isProtectedRoute && !session?.user) return NextResponse.redirect(new URL(`/${locale}/`, request.url));

    if (session?.user) {
        if (DEBUG) console.log('   -> User Found, redirecting to:', finalPathname);
        if (session.user.resetPassword && !finalPathname.includes(`reset-password`))
            return NextResponse.redirect(new URL(`/${locale}/profile/reset-password`, request.url));
        if (pathname === '/' || pathname === `/${locale}`)
            return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
    }

    if (pathnameIsMissingLocale || isInexistentLocale) {
        if (DEBUG) console.log('   -> Redirecting to:', finalPathname);
        return NextResponse.redirect(new URL(finalPathname, request.url));
    }

    return NextResponse.next();
}

export const config = {
    // Matcher ignoring `/_next/` and `/api/` 
    matcher: ["/((?!api/|_next/static|_next/image|favicon.ico).*)"],
};