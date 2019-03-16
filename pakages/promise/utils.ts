export const isObject = (val: any) => {
  return Object.prototype.toString.call(val) === '[object Object]';
};

export const isFunction = (val: any) => {
  return Object.prototype.toString.call(val) === '[object Function]';
};
