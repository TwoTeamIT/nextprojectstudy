/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

interface IBearerToken {
  accessToken: string;
  accessTokenExpiry: string;
  refreshToken: string;
  refreshTokenExpiry: string;
}

export type BearerToken = IBearerToken;

export type TokenType = 'access' | 'refresh';

export class ApiInterceptor {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async handleRequest(accessToken: string, url: string, options?: RequestInit): Promise<Response> {
    const finalURL = this.formatBaseUrl(this.baseUrl).concat(this.formatUrl(url));
    const finalOptions = {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: 'Bearer ' + accessToken
      }
    };

    return await fetch(finalURL, finalOptions);
  }

  private formatBaseUrl(baseUrl: string): string {
    let resultString: string = baseUrl + '/';
    while (resultString.endsWith('//')) resultString = resultString.slice(0, -1);

    return resultString;
  }

  private formatUrl(url: string): string {
    let resultString: string = '/' + url;
    while (resultString.startsWith('/')) resultString = resultString.slice(1);

    return resultString;
  }

  /*
        GET
    */
  public get(url: string, options: RequestInit): Promise<Response>;
  public get(accessToken: string, url: string, options: RequestInit): Promise<Response>;

  public get(arg1: string, arg2: RequestInit | string, arg3?: RequestInit): Promise<Response> {
    const accessToken = arg1;
    const url = typeof arg2 === 'string' ? (arg2 as string) : arg1;
    const options: RequestInit = typeof arg2 === 'string' ? (arg3 as RequestInit) : arg2;

    options.method = 'GET';

    return this.handleRequest(accessToken, url, options);
  }

  /*
        POST
    */
  public post(url: string, options: RequestInit, rawData?: any): Promise<Response>;
  public post(accessToken: string, url: string, options: RequestInit, rawData?: any): Promise<Response>;

  public post(arg1: string, arg2?: any | string, arg3?: RequestInit, arg4?: any): Promise<Response> {
    // Logica comune per entrambe le firme di sovraccarico
    const accessToken = arg1;
    const url = typeof arg2 === 'string' ? (arg2 as string) : arg1;
    const options = typeof arg2 === 'string' ? (arg3 as RequestInit) : arg2;
    const rawData = arg4;

    options.method = 'POST';
    options.body = rawData ? JSON.stringify(rawData) : options.body;

    return this.handleRequest(accessToken, url, options);
  }

  /*
        DELETE
    */
  public delete(url: string, options: RequestInit, rawData?: any): Promise<Response>;
  public delete(accessToken: string, url: string, options: RequestInit, rawData?: any): Promise<Response>;

  public delete(arg1: string, arg2?: any | string, arg3?: RequestInit, arg4?: any): Promise<Response> {
    const accessToken = arg1;
    const url = typeof arg2 === 'string' ? (arg2 as string) : arg1;
    const options = typeof arg2 === 'string' ? (arg3 as RequestInit) : arg2;
    const rawData = arg4;

    options.method = 'DELETE';
    options.body = rawData ? JSON.stringify(rawData) : options.body;

    return this.handleRequest(accessToken, url, options);
  }

  /*
    PATCH
  */
  public patch(url: string, options: RequestInit, rawData?: any): Promise<Response>;
  public patch(accessToken: string, url: string, options: RequestInit, rawData?: any): Promise<Response>;

  public patch(arg1: string, arg2?: any | string, arg3?: RequestInit, arg4?: any): Promise<Response> {
    // Logica comune per entrambe le firme di sovraccarico
    const accessToken = arg1;
    const url = typeof arg2 === 'string' ? (arg2 as string) : arg1;
    const options = typeof arg2 === 'string' ? (arg3 as RequestInit) : arg2;
    const rawData = arg4;

    options.method = 'PATCH';
    options.body = rawData ? JSON.stringify(rawData) : options.body;

    return this.handleRequest(accessToken, url, options);
  }


  /*
    FETCH URL
  */
  public fetch(url: string, accessToken: string, options: RequestInit, method?: RequestInit['method'], body?: RequestInit['body']): Promise<Response> {
    options.method = method || options.method;
    options.body = body || options.body;
    return this.handleRequest(accessToken, url, options);
  }

  public async anonymousFetch(url: string, options: RequestInit, method?: RequestInit['method'], body?: RequestInit['body']): Promise<Response> {
    options.method = method || options.method;
    options.body = body || options.body;

    const finalURL = this.formatBaseUrl(this.baseUrl).concat(this.formatUrl(url));
    const finalOptions = {
      ...options,
      headers: {
        ...options?.headers
      }
    };

    return await fetch(finalURL, finalOptions);
  }
}
