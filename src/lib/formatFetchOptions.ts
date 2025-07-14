import { PACKAGE_VERSION, TITLE } from "@/configs";

interface IFetchOptions {
  method?: 'POST' | 'GET' | 'DELETE' | "PATCH";
  body?: BodyInit;
  keepAlive?: boolean;
  bearerToken?: string;
  applicationName?: string;
  mode?: RequestMode;
}

export type FetchOptions = IFetchOptions;

export function formatFetchOptions(args: FetchOptions): RequestInit {
  const { method, body, keepAlive = true, bearerToken, applicationName, mode } = args;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept-Encoding': ' gzip, deflate, br',
    Accept: '*/*',
    'Access-Control-Allow-Origin': '*/*',
    'Access-Control-Request-Method': method || 'GET',
    'Access-Control-Request-Headers': 'Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers, API-Key',
    'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Private-Network': 'true',
    'Access-Control-Max-Age': '7200',
    ...(keepAlive && { Connection: 'keep-alive' }),
    ...(applicationName && { 'Application-Name': applicationName }),
    ...(bearerToken && { Authorization: 'Bearer ' + bearerToken }),

  };

  const options: RequestInit = {
    method: method,
    headers: headers,
    body: method !== undefined && method !== 'GET' ? body : undefined,
    keepalive: keepAlive,
    mode: mode,
    credentials: "include"
  };

  return options;
}

interface IRequestOptions {
  method: "GET" | "POST" | "DELETE" | "PATCH";
  bearerToken?: string;
  body?: BodyInit;
}
export type RequestOptions = IRequestOptions;

export function setFetchOptions(args: RequestOptions): RequestInit {
  const { method, body, bearerToken } = args;

  const options = formatFetchOptions({
    method: method,
    body: body,
    ...(bearerToken && { bearerToken: bearerToken }),
    keepAlive: true,
    mode: "cors",
    applicationName: `${TITLE}/${PACKAGE_VERSION}`,
  });

  return options
}