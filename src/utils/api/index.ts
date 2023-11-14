import axios from 'axios';
import { parseISO } from 'date-fns';

import type { ApiRequestError } from '@type/api-request-error';
import type { ApiError } from '@type/api-error';

export function isRequestError<T = unknown, D = unknown>(
  err: unknown,
  code?: string,
  status = 400
): err is ApiRequestError<T, D> {
  if (axios.isAxiosError(err) && err.response?.status === status) {
    const data = err.response.data as ApiError;
    return !code || data.code === code;
  }

  return false;
}

export function getRequestError(err: unknown): string | undefined {
  return isRequestError(err) ? err.response.data.code : undefined;
}

export function deserializeDate(s: string): Date;
export function deserializeDate<T extends null | undefined>(
  s: string | T
): Date | T;
export function deserializeDate<T extends null | undefined>(
  s: string | T
): Date | T {
  return s == null ? s : parseISO(s);
}
