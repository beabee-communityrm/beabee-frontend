import type { AxiosError, AxiosResponse } from 'axios';
import type { ApiError } from '@type/api-error';

export type ApiRequestError<T, D> = AxiosError<T, D> & {
  response: AxiosResponse<ApiError> & {
    status: 400;
  };
};
