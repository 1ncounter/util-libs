import { Axios } from './core/axios';
import { defaults } from './defaults';
import { Cancel } from './cancel/cancel';
import { isCancel } from './cancel/isCancel';
import { CancelToken } from './cancel/cancelToken';
import { forEach } from './utils';
import { AxiosRequestConfig, AxiosStatic } from './typings';

interface AxiosExport extends AxiosStatic {
  Axios: typeof Axios;
  CancelToken: typeof CancelToken;
  Cancel: typeof Cancel;
}

const extend = (a: any, b: any, thisArg?: any) => {
  forEach(b, function assignValue(val: any, key: any) {
    if (thisArg && typeof val === 'function') {
      a[key] = val.bind(thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
};

const createInstance = (defaultConfig: AxiosRequestConfig) => {
  const context = new Axios(defaultConfig);
  const instance = Axios.prototype.request.bind(context);
  extend(instance, Axios.prototype, context);
  extend(instance, context);
  return instance;
};

const axios: AxiosExport = createInstance(defaults);

axios.create = (instanceConfig: AxiosRequestConfig) => {
  return createInstance(Object.assign(axios.defaults, instanceConfig));
};
axios.Axios = Axios;
axios.CancelToken = CancelToken;
axios.isCancel = isCancel;
axios.Cancel = Cancel;

export default axios;
