import { AxiosTransformer } from '../typings';
import { forEach } from '../utils';

export const transformData = (
  data: any,
  headers: any,
  fns: AxiosTransformer | AxiosTransformer[]
) => {
  forEach(fns, (fn: AxiosTransformer) => {
    data = fn(data, headers);
  });
  return data;
};
