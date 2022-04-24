import { HttpError } from './http-error';
import { makeBody, makeHeaders, makeSearchString } from './utils';

type Options = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, any>;
  body?: Record<string, any> | FormData;
  searchParams?: Record<string, any>;
  signal?: AbortSignal;
};

export class VIF {
  private baseUrl: string;
  private headers?: Record<string, any>;
  private beforeRequest?: (options: Options) => void;

  constructor({
    baseUrl,
    headers,
    beforeRequest,
  }: {
    baseUrl: string;
    headers?: Record<string, any>;
    beforeRequest?: (options: Options) => void;
  }) {
    this.baseUrl = baseUrl;
    this.headers = headers;
    this.beforeRequest = beforeRequest;
  }

  async fetch<T = any>(
    url: string,
    options: Options = {},
  ): Promise<{ data: T; headers: Record<string, any> }> {
    if (this.beforeRequest) {
      await this.beforeRequest(options);
    }

    const res = await fetch(`${this.baseUrl}/${url}${makeSearchString(options.searchParams)}`, {
      method: options.method,
      headers: makeHeaders(this.headers, options.headers, options.body),
      body: makeBody(options.body),
      signal: options.signal,
    });

    const headers = Object.fromEntries(res.headers.entries());

    const data = headers['content-type'].includes('application/json') ? await res.json() : null;

    if (!res.ok) {
      throw new HttpError({
        status: data.status ?? res.status ?? 500,
        message: data.message ?? res.statusText ?? 'Unknown error',
        code: data.code,
      });
    }

    return { headers, data };
  }

  async get<T = any>(url: string, options: Omit<Options, 'method' | 'body'>) {
    return this.fetch<T>(url, { ...options, method: 'GET' });
  }

  async post<T = any>(url: string, options: Omit<Options, 'method'>) {
    return this.fetch<T>(url, { ...options, method: 'POST' });
  }

  async put<T = any>(url: string, options: Omit<Options, 'method'>) {
    return this.fetch<T>(url, { ...options, method: 'PUT' });
  }

  async patch<T = any>(url: string, options: Omit<Options, 'method'>) {
    return this.fetch<T>(url, { ...options, method: 'PATCH' });
  }

  async delete<T = any>(url: string, options: Omit<Options, 'method' | 'body'>) {
    return this.fetch<T>(url, { ...options, method: 'DELETE' });
  }
}
