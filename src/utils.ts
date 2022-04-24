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
  instanceHeaders?: Record<string, any>,
  optionsHeaders?: Record<string, any>,
  optionsBody?: Record<string, any>,
) => {
  let customHeaders: Record<string, any> = {};

  if (optionsBody && typeof 'body' === 'object') {
    customHeaders['content-type'] = 'application/json';
  }

  return normalize({ ...instanceHeaders, ...optionsHeaders, ...customHeaders });
};

export const makeBody = (optionsBody?: Record<string, any> | FormData) => {
  if (!optionsBody) {
    return;
  }
  if (typeof optionsBody !== 'object') {
    return optionsBody;
  }
  return JSON.stringify(normalize(optionsBody));
};

export const makeSearchString = (optionsSearchParams?: Record<string, any>) => {
  if (!optionsSearchParams) {
    return '';
  }
  return `?${new URLSearchParams(normalize(optionsSearchParams)).toString()}`;
};
