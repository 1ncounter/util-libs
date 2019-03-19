const toString = Object.prototype.toString;

export const isString = (val: any) => {
  return toString.call(val) === '[object String]';
};

export const isNumber = (val: any) => {
  return toString.call(val) === '[object Number]';
};

export const isPlainObject = (val: any) => {
  return val && toString.call(val) === '[object Object]';
};

export const isDate = (val: any) => {
  return toString.call(val) === '[object Date]';
};

export const isFile = (val: any) => {
  return toString.call(val) === '[object File]';
};

export const isBlob = (val: any) => {
  return toString.call(val) === '[object Blob]';
};

export const isFunction = (val: any) => {
  return toString.call(val) === '[object Function]';
};

export const isArrayBuffer = (val: any) => {
  return toString.call(val) === '[object ArrayBuffer]';
};

export const isFormData = (val: any) => {
  return FormData && val instanceof FormData;
};

export const isArrayBufferView = (val: any) => {
  let result: boolean;
  if (ArrayBuffer && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val && val.buffer && val.buffer instanceof ArrayBuffer;
  }
  return result;
};

export const isURLSearchParams = (val: any) => {
  return URLSearchParams && val instanceof URLSearchParams;
};

export const isStream = (val: any) => {
  return isPlainObject(val) && isFunction(val.pipe);
};

export const isStandardBrowserEnv = () => {
  if (
    navigator &&
    (navigator.product === 'ReactNative' ||
      navigator.product === 'NativeScript' ||
      navigator.product === 'NS')
  ) {
    return false;
  }

  return window && document;
};

export const forEach = (obj: any, fn: any) => {
  if (obj === null || typeof obj === 'undefined') {
    return;
  }
  if (typeof obj !== 'object') {
    obj = [obj];
  }
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
};
