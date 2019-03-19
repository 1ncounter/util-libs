import { isDate, isPlainObject, isFunction, isURLSearchParams } from '../utils';

const encode = (val: any) => {
  return encodeURIComponent(val)
    .replace(/%40/gi, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']');
};

export const buildURL = (
  url: string,
  params?: any,
  paramsSerializer?: (params: any) => any
) => {
  if (!params) return url;

  let serializedParams: string;

  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    let parts: string[] = [];

    for (let key in params) {
      let val = params[key];

      if (!val) return;

      if (Array.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      val.forEach(v => {
        if (isDate(v)) {
          v = v.toISOString();
        } else if (isPlainObject(v)) {
          v = JSON.stringify(v);
        }

        parts.push(encode(key) + '=' + encode(v));
      });
    }

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    let hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};
