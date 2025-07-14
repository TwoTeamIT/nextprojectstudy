"use server";

import api from "@/lib/apiCaller";
import { safeApiCall } from "@/lib/errorHandler";
import { setFetchOptions } from "@/lib/formatFetchOptions";
import { Audit } from "./definitions";
import { getSession } from "../auth/stateless-session";

export async function getAllAudits(): Promise<Audit[]> {
    const options = setFetchOptions({ method: "GET" });

    const session = await getSession();
    if (!session) throw new Error(`No session data available`);

    const accessToken = session?.user.accessToken.token;

    const [err, status, msg, res] = await safeApiCall<Audit[]>(api.get(accessToken, `/audits`, options));
    if (err || msg || status !== 200) return [];

    return res || [];
}

export async function getAuditDetails(id: string): Promise<Audit | undefined> {
    const options = setFetchOptions({ method: "GET" });

    const session = await getSession();
    if (!session) throw new Error(`No session data available`);

    const accessToken = session?.user.accessToken.token;

    const [err, status, msg, res] = await safeApiCall<Audit>(api.get(accessToken, `/audits/${id}`, options))
    if (err || msg || status !== 200) return undefined;

    return res || undefined;
}