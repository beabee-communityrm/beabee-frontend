import axios, { AxiosError, AxiosResponse } from 'axios';
import { parseISO } from 'date-fns';

interface ApiError {
  code: string;
}

type ApiRequestError = AxiosError & {
  response: AxiosResponse<ApiError> & {
    status: 400;
  };
};

export function isRequestError(
  err: unknown,
  code?: string
): err is ApiRequestError {
  if (axios.isAxiosError(err) && err.response?.status === 400) {
    const data = err.response.data as ApiError;
    return !code || data.code === code;
  }

  return false;
}

export function getRequestError(err: unknown): string | undefined {
  return isRequestError(err) ? err.response.data.code : undefined;
}

export function deserializeDate(s: string): Date;
export function deserializeDate<T extends null | undefined>(s: string | T): Date | T;
export function deserializeDate<T extends null | undefined>(s: string | T): Date | T {
  return s == null ? s : parseISO(s);
}