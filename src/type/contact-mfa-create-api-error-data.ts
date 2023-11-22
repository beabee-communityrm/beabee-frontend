import { LOGIN_CODES } from '@enums/login-codes';
import { ApiError } from './api-error';

export interface ContactMfaCreateApiErrorData extends ApiError<LOGIN_CODES> {
  message: string | LOGIN_CODES;
  name: string;
}
