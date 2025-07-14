/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

'use server';

import { setFetchOptions } from "./formatFetchOptions";
import { BearerToken, TokenType } from "./apiInterceptor";
import { API_URL, DEBUG } from "@/configs";

export async function refreshTokens(refreshToken: string): Promise<BearerToken> {
    const options = setFetchOptions({ method: "POST", body: JSON.stringify({ refreshToken: refreshToken }) });
    const newTokens: BearerToken = await fetch(API_URL.concat("authentication/refresh-tokens/"), options)
        .then(res => {
            if (res.status === 200) return res.json();
            else throw new Error(res.status.toString() || JSON.stringify(res));
        })
        .then(res => {
            const tokens: BearerToken = {
                accessToken: res.result.accessToken,
                accessTokenExpiry: res.result.accessTokenExpiry,
                refreshToken: res.result.refreshToken,
                refreshTokenExpiry: res.result.refreshTokenExpiry
            };

            return tokens;
        })
        .catch((err: any) => Promise.reject(err));

    return newTokens;
}

export async function checkTokenValidity(token: string, type: TokenType): Promise<boolean> {
    const options = setFetchOptions(
        {
            method: type === "access" ? "GET" : "POST",
            ...(type === "access" && { bearerToken: token }),
            ...(type === "refresh" && { body: JSON.stringify({ refreshToken: token }) })
        }
    );

    const url = API_URL.concat("authentication/check-", type.toString(), "-token");

    let isTokenValid: boolean;
    try {
        isTokenValid = await fetch(url, options).then(res => { if (DEBUG) console.log(type, res.ok); return res.ok; }).catch((_) => false);
    } catch (err) { isTokenValid = false; }

    return isTokenValid;
}