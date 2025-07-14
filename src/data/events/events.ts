
import api from "@/lib/apiCaller";
import { safeApiCall } from "@/lib/errorHandler";
import { setFetchOptions } from "@/lib/formatFetchOptions";
import { Event } from "./definitions";
import { getSession } from "../auth/stateless-session";

//boolean = true è il default
export async function getAllEvents(): Promise<Event[]> {
    const options = setFetchOptions({ method: "GET" });

    const session = await getSession();
    if (!session) throw new Error(`No session data available`);

    const accessToken = session?.user.accessToken.token;

    const [err, status, msg, res] = await safeApiCall<Event[]>(api.get(accessToken, `/event/calendar`, options));
    if (err || msg || status !== 200) return [];

    return res || [];
}