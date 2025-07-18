"use server";

import api from "@/lib/apiCaller";
import { safeApiCall } from "@/lib/errorHandler";
import { setFetchOptions } from "@/lib/formatFetchOptions";
import { Audit } from "./definitions";
import { getSession } from "../auth/stateless-session";




export async function getAllAudits(): Promise<Audit[]> {
    //const options = setFetchOptions({ method: "GET" });

    //const session = await getSession();
    //if (!session) throw new Error(`No session data available`);

    //const accessToken = session?.user.accessToken.token;

    //const [err, status, msg, res] = await safeApiCall<Audit[]>(api.get(accessToken, `/audits`, options));
    //if (err || msg || status !== 200) return [];

    const mockAudits: Audit[] = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        timeStampUTC: new Date(Date.now() - i * 1000 * 60).toISOString(),
        auditFilterEvent: ["LOGIN", "LOGOUT", "READ", "WRITE", "DELETE"][i % 5],
        controller: ["UserController", "AuthController", "OrderController", "ProductController"][i % 4],
        action: ["create", "read", "update", "delete"][i % 4],
        userIdentity: `user${(i % 10) + 1}@example.com`,
        requestHeaders: JSON.stringify({
            "Content-Type": "application/json",
            Authorization: "Bearer abc123",
        }),
        requestConnection: JSON.stringify({
            remoteAddress: "192.168.1." + (i % 255),
            localPort: 443,
        }),
        requestPayload: JSON.stringify({
            payloadId: i + 1,
            data: `Sample payload ${i + 1}`,
        }),
        responseStatus: [200, 201, 400, 401, 500][i % 5],
        responseResult: JSON.stringify({
            result: i % 2 === 0 ? "OK" : "FAIL",
            itemsProcessed: i,
        }),
        responseMessage: i % 2 === 0 ? "Operation successful" : "An error occurred",
    }));

    return mockAudits; //res || [];
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