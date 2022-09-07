import axios from 'axios';

export function isRequestError(err: unknown, code: string): boolean {
  if (axios.isAxiosError(err) && err.response?.status === 400) {
    const data = err.response.data as { code: string };
    return data.code === code;
  }

  return false;
}
