import { defaults } from '../defaults';
import { isCancel } from '../cancel/isCancel';
import { AxiosAdapter, AxiosRequestConfig } from '../typings';
import { combineURLs } from '../helpers/combineURLs';
import { isAbsoluteURL } from '../helpers/isAbsoluteURL';
import { transformData } from '../helpers/transformData';

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
const throwIfCancellationRequested = (config: AxiosRequestConfig) => {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
};

/**
 * Dispatch a request to the server using the configured adapter.
 */
export const dispatchRequest = (config: AxiosRequestConfig) => {
  throwIfCancellationRequested(config);

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  const {
    delete: DELETE,
    get,
    head,
    post,
    patch,
    common = {},
    ...filterHeaders
  } = config.headers;
  const contentType = config.headers[config.method] || {};

  config.headers = {
    ...common,
    ...contentType,
    ...filterHeaders
  };

  let adapter: AxiosAdapter = config.adapter || defaults.adapter;

  return adapter(config).then(
    response => {
      throwIfCancellationRequested(config);
      const { data, headers } = response;
      response.data = transformData(data, headers, config.transformResponse);

      return response;
    },
    reason => {
      if (!isCancel(reason)) {
        throwIfCancellationRequested(config);
        const {
          response,
          response: { data, headers }
        } = reason;
        if (reason && response) {
          reason.response.data = transformData(
            data,
            headers,
            config.transformResponse
          );
        }
      }

      return Promise.reject(reason);
    }
  );
};
