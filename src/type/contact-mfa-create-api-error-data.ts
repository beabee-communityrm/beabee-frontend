import { LOGIN_CODES } from '@enums/login-codes';

export interface ContactMfaCreateApiErrorData {
  httpCode: number;
  message: string | LOGIN_CODES;
  name: string;
}
