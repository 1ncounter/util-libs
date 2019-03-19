import { AxiosRequestConfig, AxiosPromise } from '../typings';
import { isFormData, isStandardBrowserEnv } from '../utils';
import { settle } from '../core/settle';
import { createError } from '../core/createError';
import { cookies } from '../helpers/cookies';
import { buildURL } from '../helpers/buildURL';
import { isURLSameOrigin } from '../helpers/isURLSameOrigin';

export const xhrAdapter = (config: AxiosRequestConfig): AxiosPromise => {
  return new Promise((resolve, reject) => {
    let {
      headers: requestHeaders,
      data: requestData,
      method = 'get',
      url = '',
      params,
      paramsSerializer,
      auth,
      timeout,
      withCredentials,
      responseType,
      onDownloadProgress,
      onUploadProgress,
      cancelToken,
      xsrfHeaderName,
      xsrfCookieName
    } = config;
    let request: XMLHttpRequest = new XMLHttpRequest();

    if (isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    // HTTP basic authentication
    if (auth) {
      let { username, password } = auth;
      requestHeaders['Authorization'] =
        'Basic ' + btoa(username + ':' + password);
    }

    request.open(
      method.toUpperCase(),
      buildURL(url, params, paramsSerializer),
      true
    );

    // Set the request timeout in MS
    request.timeout = timeout;

    // 在标准浏览器环境下 (非 web worker 或者 react-native) 则添加 xsrf 头
    if (isStandardBrowserEnv()) {
      // Add xsrf header
      let xsrfValue =
        (withCredentials || isURLSameOrigin(url)) && xsrfCookieName
          ? cookies.read(xsrfCookieName)
          : undefined;

      if (xsrfValue) {
        requestHeaders[xsrfHeaderName] = xsrfValue;
      }
    }

    // 通过 XHR 的 setRequestHeader 方法设置请求头信息
    if ('setRequestHeader' in requestHeaders) {
      for (const key in requestHeaders) {
        if (requestHeaders.hasOwnProperty(key)) {
          const val = requestHeaders[key];
          if (
            typeof requestData === 'undefined' &&
            key.toLowerCase() === 'content-type'
          ) {
            delete requestHeaders[key];
          } else {
            request.setRequestHeader(key, val);
          }
        }
      }
    }

    if (withCredentials) {
      // 不同域下的 XmlHttpRequest 响应，不论其 Access-Control-header 设置什么值，
      // 都无法为它自身站点设置 cookie 值，除非它在请求之前将 withCredentials 设为 true。
      request.withCredentials = true;
    }

    if (responseType) {
      try {
        request.responseType = responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (responseType !== 'json') {
          throw e;
        }
      }
    }

    request.onreadystatechange = function handleLoad() {
      // 0	UNSENT	代理被创建，但尚未调用 open() 方法。
      // 1	OPENED	open() 方法已经被调用。
      // 2	HEADERS_RECEIVED	send() 方法已经被调用，并且头部和状态已经可获得。
      // 3	LOADING	下载中； responseText 属性已经包含部分数据。
      // 4	DONE	下载操作已完成。
      if (!request || request.readyState !== 4) {
        return;
      }

      // 请求使用 file 协议，部分浏览器会返回 status 为 0 ( 即使请求成功 )
      if (
        request.status === 0 &&
        !(request.responseURL && request.responseURL.indexOf('file:') === 0)
      ) {
        return;
      }

      // 这边必须使用 request.getAllResponseHeaders ，否则报 Uncaught TypeError: Illegal invocation
      let responseHeaders =
        'getAllResponseHeaders' in request
          ? parseHeaders(request.getAllResponseHeaders())
          : null;

      let responseData =
        !responseType || responseType === 'text'
          ? request.responseText
          : request.response;

      let response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(
        createError(
          'timeout of ' + timeout + 'ms exceeded',
          config,
          'ECONNABORTED',
          request
        )
      );

      // Clean up request
      request = null;
    };

    // Handle progress if needed
    if (typeof onDownloadProgress === 'function') {
      request.addEventListener('progress', onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', onUploadProgress);
    }

    if (cancelToken) {
      // Handle cancellation
      cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};
