import { AxiosRequestConfig, Interceptor } from '../typings';
import { dispatchRequest } from './dispatchRequest';
import { InterceptorManager } from './interceptorManager';

export class Axios {
  defaults: AxiosRequestConfig;
  interceptors: {
    request: InterceptorManager;
    response: InterceptorManager;
  };

  constructor(instanceConfig: AxiosRequestConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    };
  }

  request(config: AxiosRequestConfig = {}) {
    const { method } = config;
    const newConf = {
      ...this.defaults,
      config,
      method: method ? method.toLowerCase() : 'get'
    };

    // 拦截器原理：[请求拦截器,发送请求,响应拦截器] 顺序执行
    const chain = [dispatchRequest, undefined];

    let promise: any = Promise.resolve(newConf);

    this.interceptors.request.forEach((interceptor: Interceptor) => {
      chain.unshift(interceptor.fulfilled, interceptor.rejected);
    });
    this.interceptors.response.forEach((interceptor: Interceptor) => {
      chain.push(interceptor.fulfilled, interceptor.rejected);
    });

    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }

  head(url: string, config: AxiosRequestConfig = {}) {
    return this.request(Object.assign(config, { method: 'head', url }));
  }

  options(url: string, config: AxiosRequestConfig = {}) {
    return this.request(Object.assign(config, { method: 'options', url }));
  }

  get(url: string, config: AxiosRequestConfig = {}) {
    return this.request(Object.assign(config, { method: 'get', url }));
  }

  post(url: string, data: any, config: AxiosRequestConfig = {}) {
    return this.request(Object.assign(config, { method: 'post', url, data }));
  }

  put(url: string, data: any, config: AxiosRequestConfig = {}) {
    return this.request(Object.assign(config, { method: 'put', url, data }));
  }

  delete(url: string, config: AxiosRequestConfig = {}) {
    return this.request(Object.assign(config, { method: 'delete', url }));
  }
}
