import axios from 'axios';
import { parseISO } from 'date-fns';

export function isRequestError(err: unknown, code: string): boolean {
  if (axios.isAxiosError(err) && err.response?.status === 400) {
    const data = err.response.data as { code: string };
    return data.code === code;
  }

  return false;
}

export function deserializeDate(s: string): Date;
export function deserializeDate(s: string | undefined): Date | undefined;
export function deserializeDate(s: string | undefined): Date | undefined {
  return s ? parseISO(s) : undefined;
}
