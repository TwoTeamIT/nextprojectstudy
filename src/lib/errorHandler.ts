'use server';

import { DEBUG } from "@/configs";

export async function safeApiCall<T>(
    promise: Promise<Response>
): Promise<[null, number | null, string | null, T | null] | [Error, number | null, string | null, null]> {
    return promise
        .then(res => {
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) return res.json();
            try { return res; }
            catch {
                return [new Error(res.statusText || res.status.toString()), null, null, null] as [Error, null, null, null];
            }
        })
        .then(async (res) => {
            if (!res.status?.toString()?.startsWith('2') && !res.ok) {
                let resObj;
                if (typeof res === 'object' && (res.detail || res.message)) resObj = res;
                else if (res.body && res.bodyUsed) {
                    const reader = res.body.getReader();
                    const decoder = new TextDecoder();

                    let response = "";
                    let done = false;

                    while (!done) {
                        const { value, done: readerDone } = await reader.read();
                        done = readerDone;

                        if (value) {
                            response += decoder.decode(value, { stream: true });
                            if (DEBUG) console.log("Received chunk:", decoder.decode(value, { stream: true }));
                        }
                    }

                    resObj = JSON.parse(response);
                    resObj.status = resObj.status ?? res.status;
                }
                else {
                    if (DEBUG) console.log("Final response:", res);
                    return [(`HTTP Error: ${res.status}`) as unknown as Error, res.status, res.statusText, null] as [Error, number | null, string | null, null];
                }

                if (DEBUG) console.log("Final response:", resObj);
                return [(resObj.title ?? resObj.statusText ?? `HTTP Error: ${resObj.status}`) as Error, resObj.status, resObj.message ?? resObj.detail, null] as [Error, number | null, string | null, null];
            }

            const status = res.status;
            const message = res.message ?? null;
            const result: T | null = res.result as T ?? null;

            return [null, status, message, result] as [null, number, string | null, T];
        })
        .catch(error => [error as Error, null, null, null]);
}

export async function safeApiCallWithBody<T>(
    promise: Promise<Response>,
    body: BodyInit
): Promise<[null, number | null, string | null, T | null] | [Error, number | null, string | null, null]> {
    return promise
        .then(res => {
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) return res.json();
            try { return res; }
            catch {
                return [new Error(res.statusText || res.status.toString()), null, null, null] as [Error, null, null, null];
            }
        })
        .then(async (res) => {
            if (!res.status?.toString()?.startsWith('2') && !res.ok) {
                let resObj;
                if (typeof res === 'object' && (res.detail || res.message)) resObj = res;
                else if (res.body && res.bodyUsed) {
                    const reader = res.body.getReader();
                    const decoder = new TextDecoder();

                    let response = "";
                    let done = false;

                    while (!done) {
                        const { value, done: readerDone } = await reader.read();
                        done = readerDone;

                        if (value) {
                            response += decoder.decode(value, { stream: true });
                            if (DEBUG) console.log("Received chunk:", decoder.decode(value, { stream: true }));
                        }
                    }

                    resObj = JSON.parse(response);
                    resObj.status = resObj.status ?? res.status;
                }
                else {
                    if (DEBUG) console.log("Final response:", res);
                    return [(`HTTP Error: ${res.status}`) as unknown as Error, res.status, res.statusText, null] as [Error, number | null, string | null, null];
                }

                if (DEBUG) console.log("Final response:", resObj);
                return [(resObj.title ?? resObj.statusText ?? `HTTP Error: ${resObj.status}`) as Error, resObj.status, resObj.message ?? resObj.detail ?? body.toString(), null] as [Error, number | null, string | null, null];
            }

            const status = res.status;
            const message = res.message ?? body.toString();
            const result: T | null = res.result as T ?? null;

            return [null, status, message ?? body.toString(), result] as [null, number, string | null, T];
        })
        .catch(error => [error as Error, null, null, null]);
}
