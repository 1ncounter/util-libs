import { AxiosRequestConfig } from '../typings';
import * as utils from '../utils';
import { createError } from '../core/createError';
import * as pkg from '../../../package.json';
import { buildFullPath } from '../core/buildFullPath';
import { buildURL } from '../helpers/buildURL';
import * as url from 'url';

const isHttps = /https:?/;

export const httpAdapter = (config: AxiosRequestConfig) => {
  return new Promise((resolvePromise, rejectPromise) => {
    let timer;
    const resolve = value => {
      clearTimeout(timer);
      resolvePromise(value);
    };
    const reject = value => {
      clearTimeout(timer);
      rejectPromise(value);
    };
    let { data, headers } = config;

    // Set User-Agent (required by some servers)
    // Only set header if it hasn't been set in config
    // See https://github.com/axios/axios/issues/69
    if (!headers['User-Agent'] && !headers['user-agent']) {
      headers['User-Agent'] = 'axios/' + pkg.version;
    }

    if (data && !utils.isStream(data)) {
      if (Buffer.isBuffer(data)) {
        // Nothing to do...
      } else if (utils.isArrayBuffer(data)) {
        data = Buffer.from(new Uint8Array(data));
      } else if (utils.isString(data)) {
        data = Buffer.from(data, 'utf-8');
      } else {
        return reject(
          createError(
            'Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream',
            config
          )
        );
      }

      // Add Content-Length header if data exists
      headers['Content-Length'] = data.length;
    }

    // HTTP basic authentication
    let auth;
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';

      auth = username + ':' + password;
    }

    // Parse url
    const fullPath = buildFullPath(config.baseURL, config.url);
    const parsed = url.parse(fullPath);
    const protocol = parsed.protocol || 'http:';

    if (!auth && parsed.auth) {
      var urlAuth = parsed.auth.split(':');
      var urlUsername = urlAuth[0] || '';
      var urlPassword = urlAuth[1] || '';
      auth = urlUsername + ':' + urlPassword;
    }

    if (auth) {
      delete headers.Authorization;
    }

    const isHttpsRequest = isHttps.test(protocol);
    const agent = isHttpsRequest ? config.httpsAgent : config.httpAgent;

    const options = {
      path: buildURL(
        parsed.path,
        config.params,
        config.paramsSerializer
      ).replace(/^\?/, ''),
      method: config.method.toUpperCase(),
      headers: headers,
      agent: agent,
      auth: auth,
      socketPath: undefined,
      hostname: undefined,
      port: undefined
    };

    if (config.socketPath) {
      options.socketPath = config.socketPath;
    } else {
      options.hostname = parsed.hostname;
      options.port = parsed.port;
    }

    let proxy = config.proxy;

    if (!proxy && proxy !== false) {
      var proxyEnv = protocol.slice(0, -1) + '_proxy';
      var proxyUrl =
        process.env[proxyEnv] || process.env[proxyEnv.toUpperCase()];
      if (proxyUrl) {
        var parsedProxyUrl = url.parse(proxyUrl);
        var noProxyEnv = process.env.no_proxy || process.env.NO_PROXY;
        var shouldProxy = true;

        if (noProxyEnv) {
          var noProxy = noProxyEnv.split(',').map(function trim(s) {
            return s.trim();
          });

          shouldProxy = !noProxy.some(function proxyMatch(proxyElement) {
            if (!proxyElement) {
              return false;
            }
            if (proxyElement === '*') {
              return true;
            }
            if (
              proxyElement[0] === '.' &&
              parsed.hostname.substr(
                parsed.hostname.length - proxyElement.length
              ) === proxyElement &&
              proxyElement.match(/\./g).length ===
                parsed.hostname.match(/\./g).length
            ) {
              return true;
            }

            return parsed.hostname === proxyElement;
          });
        }

        if (shouldProxy) {
          proxy = {
            host: parsedProxyUrl.hostname,
            port: parsedProxyUrl.port
          };

          if (parsedProxyUrl.auth) {
            var proxyUrlAuth = parsedProxyUrl.auth.split(':');
            proxy.auth = {
              username: proxyUrlAuth[0],
              password: proxyUrlAuth[1]
            };
          }
        }
      }
    }

    if (proxy) {
      options.hostname = proxy.host;
      options.host = proxy.host;
      options.headers.host =
        parsed.hostname + (parsed.port ? ':' + parsed.port : '');
      options.port = proxy.port;
      options.path =
        protocol +
        '//' +
        parsed.hostname +
        (parsed.port ? ':' + parsed.port : '') +
        options.path;

      // Basic proxy authorization
      if (proxy.auth) {
        let base64 = Buffer.from(
          proxy.auth.username + ':' + proxy.auth.password,
          'utf8'
        ).toString('base64');
        options.headers['Proxy-Authorization'] = 'Basic ' + base64;
      }
    }
  });
};
