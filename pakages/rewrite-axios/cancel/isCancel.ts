export const isCancel = (value: any) => {
  return !!(value && value.__CANCEL__);
};
