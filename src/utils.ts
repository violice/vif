import { Options } from './types';

export const normalize = (obj: Record<string, any>) => {
  let result: Record<string, any> = {};
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] !== 'undefined') {
      result[key] = obj[key];
    }
  });
  return result;
};

export const makeHeaders = (
  instanceHeaders?: Options['headers'],
  optionsHeaders?: Options['headers'],
  optionsBody?: Options['body']
) => {
  let customHeaders: Options['headers'] = {};

  if (optionsBody && typeof optionsBody === 'object') {
    customHeaders['content-type'] = 'application/json';
  }

  return normalize({ ...instanceHeaders, ...optionsHeaders, ...customHeaders });
};

export const makeBody = (optionsBody?: Options['body']) => {
  if (!optionsBody) {
    return;
  }
  if (typeof optionsBody !== 'object') {
    return optionsBody;
  }
  return JSON.stringify(normalize(optionsBody));
};

export const makeSearchString = (
  optionsSearchParams?: Options['searchParams']
) => {
  if (!optionsSearchParams) {
    return '';
  }
  return `?${new URLSearchParams(normalize(optionsSearchParams)).toString()}`;
};

export const extractHeaders = (res: Response) => {
  return Object.fromEntries(res.headers.entries());
};

export const extractData = async (
  res: Response,
  extractedHeaders: Record<string, string>
) => {
  try {
    const data = extractedHeaders['content-type'].includes('application/json')
      ? await res.json()
      : null;
    return data;
  } catch (error) {
    console.error(error);
    return {};
  }
};
