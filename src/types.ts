export type Options = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, any>;
  body?: Record<string, any> | FormData;
  searchParams?: Record<string, any>;
  signal?: AbortSignal;
};