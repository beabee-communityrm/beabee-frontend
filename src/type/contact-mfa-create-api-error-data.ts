import { LOGIN_CODES } from '@utils/api/api.interface';

export interface ContactMfaCreateApiErrorData {
  httpCode: number;
  message: string | LOGIN_CODES;
  name: string;
}
