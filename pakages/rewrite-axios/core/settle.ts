import { createError } from './createError';
import { AxiosReslove, AxiosError, AxiosResponse } from '../typings';

export const settle = (
  resolve: AxiosReslove,
  reject: (reason?: AxiosError) => void,
  response: AxiosResponse
) => {
  const {
    config,
    status,
    request,
    config: { validateStatus }
  } = response;

  if (!validateStatus || validateStatus(status)) {
    resolve(response);
  } else {
    reject(
      createError(
        `Request failed with status code ${status}`,
        config,
        '',
        request,
        response
      )
    );
  }
};
