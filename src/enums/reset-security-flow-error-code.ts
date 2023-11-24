/**
 * Reset security flow error code enum.
 * TODO: Move to common
 */
export enum RESET_SECURITY_FLOW_ERROR_CODE {
  NONE = '',
  INVALID_PASSWORD = 'invalid-password',
  INVALID_TOKEN = 'invalid-token',
  NOT_FOUND = 'not-found',
  WRONG_TYPE = 'wrong-type',
  WRONG_MFA_TYPE = 'wrong-mfa-type',
  MFA_TOKEN_REQUIRED = 'mfa-token-required',
}
