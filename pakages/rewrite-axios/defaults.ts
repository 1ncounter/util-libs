import { xhrAdapter } from './adapters/xhr';
import { httpAdapter } from './adapters/http';
import { AxiosRequestConfig } from './typings';
import { normalizeHeaderName } from './helpers/normalizeHeaderName';
import {
  isArrayBuffer,
  isArrayBufferView,
  isBlob,
  isFormData,
  isStream,
  isFile,
  isPlainObject,
  isURLSearchParams
} from './utils';

const DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

const setContentTypeIfUnset = (headers: any, value: string) => {
  if (!headers && !headers['Content-Type']) {
    headers['Content-Type'] = value;
  }
};

const getDefaultAdapter = () => {
  let adapter;
  // Only Node.JS has a process variable that is of [[Class]] process
  if (
    typeof process !== 'undefined' &&
    Object.prototype.toString.call(process) === '[object process]'
  ) {
    // For node use HTTP adapter
    adapter = httpAdapter;
  } else if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = xhrAdapter;
  }
  return adapter;
};

const headers = (): any => {
  const emptyMethod = ['delete', 'get', 'head'].reduce((obj, key) => {
    return Object.assign(obj, { [key]: {} });
  }, {});

  const mergeMethod = ['post', 'put', 'patch'].reduce((obj, key) => {
    return Object.assign(obj, { [key]: { ...DEFAULT_CONTENT_TYPE } });
  }, {});

  return {
    common: {
      Accept: 'application/json, text/plain, */*'
    },
    ...emptyMethod,
    ...mergeMethod
  };
};

const transformRequest = () => {
  return [
    (data: any, headers: any) => {
      normalizeHeaderName(headers, 'Accept');
      normalizeHeaderName(headers, 'Content-Type');

      if (
        isFormData(data) ||
        isArrayBuffer(data) ||
        isStream(data) ||
        isFile(data) ||
        isBlob(data)
      ) {
        return data;
      }
      if (isArrayBufferView(data)) {
        return data.buffer;
      }
      if (isURLSearchParams(data)) {
        setContentTypeIfUnset(
          headers,
          'application/x-www-form-urlencoded;charset=utf-8'
        );
        return data.toString();
      }
      if (isPlainObject(data)) {
        setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
        return JSON.stringify(data);
      }
      return data;
    }
  ];
};

const transformResponse = () => {
  return [
    (data: string) => {
      try {
        data = JSON.parse(data);
      } catch (e) {
        console.log(e);
      }
      return data;
    }
  ];
};

export const defaults: AxiosRequestConfig = {
  headers: headers(),
  adapter: getDefaultAdapter(),
  transformRequest: transformRequest(),
  transformResponse: transformResponse(),
  timeout: 0,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  validateStatus(status: number) {
    return status >= 200 && status < 300;
  }
};
