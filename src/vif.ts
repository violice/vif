import { HttpError } from './http-error';
import { Options } from './types';
import { makeBody, makeHeaders, makeSearchString } from './utils';

export class VIF {
  private baseUrl: string;
  private headers?: Options['headers'];
  private beforeRequest?: (options: Options) => void;
  beforeError?: ({
    error,
    headers,
    data,
  }: {
    error: HttpError;
    data: any;
    headers: Options['headers'];
  }) => void;
  private afterResponse?: ({
    headers,
    data,
  }: {
    data: any;
    headers: Options['headers'];
  }) => void;

  constructor({
    baseUrl,
    headers,
    beforeRequest,
    beforeError,
    afterResponse,
  }: {
    baseUrl: string;
    headers?: Options['headers'];
    beforeRequest?: (options: Options) => void;
    afterResponse?: ({
      headers,
      data,
    }: {
      data: any;
      headers: Options['headers'];
    }) => void;
    beforeError?: ({
      error,
      headers,
      data,
    }: {
      error: HttpError;
      data: any;
      headers: Options['headers'];
    }) => void;
  }) {
    this.baseUrl = baseUrl;
    this.headers = headers;
    this.beforeRequest = beforeRequest;
    this.beforeError = beforeError;
    this.afterResponse = afterResponse;
  }

  async fetch<T = any>(
    url: string,
    options: Options = {}
  ): Promise<{ data: T; headers: Options['headers'] }> {
    if (this.beforeRequest) {
      await this.beforeRequest(options);
    }

    const res = await fetch(
      `${this.baseUrl}/${url}${makeSearchString(options.searchParams)}`,
      {
        method: options.method,
        headers: makeHeaders(this.headers, options.headers, options.body),
        body: makeBody(options.body),
        signal: options.signal,
      }
    );

    const headers = Object.fromEntries(res.headers.entries());

    const data = headers['content-type'].includes('application/json')
      ? await res.json()
      : null;

    if (!res.ok) {
      const error = new HttpError({
        status: data.status ?? res.status ?? 500,
        message: data.message ?? res.statusText ?? 'Unknown error',
        code: data.code,
      });

      if (this.beforeError) {
        await this.beforeError({ error, headers, data });
      }

      throw error;
    }

    if (this.afterResponse) {
      await this.afterResponse({ headers, data });
    }

    return { headers, data };
  }

  async get<T = any>(url: string, options?: Omit<Options, 'method' | 'body'>) {
    return this.fetch<T>(url, { ...options, method: 'GET' });
  }

  async post<T = any>(url: string, options?: Omit<Options, 'method'>) {
    return this.fetch<T>(url, { ...options, method: 'POST' });
  }

  async put<T = any>(url: string, options?: Omit<Options, 'method'>) {
    return this.fetch<T>(url, { ...options, method: 'PUT' });
  }

  async patch<T = any>(url: string, options?: Omit<Options, 'method'>) {
    return this.fetch<T>(url, { ...options, method: 'PATCH' });
  }

  async delete<T = any>(
    url: string,
    options?: Omit<Options, 'method' | 'body'>
  ) {
    return this.fetch<T>(url, { ...options, method: 'DELETE' });
  }
}
