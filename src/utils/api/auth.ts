import axios from '../../lib/axios';
import env from '../../env';
import { LoginData } from './api.interface';
import { RESET_SECURITY_FLOW_TYPE } from '@enums/reset-security-flow-type';

export async function login(data: LoginData): Promise<void> {
  await axios.post('auth/login', {
    email: data.email,
    password: data.password,
    token: data.token,
  });
}

export async function logout(): Promise<void> {
  await axios.post('auth/logout');
}

// TODO: Create ResetSecurityFlowService
export async function forgotPassword(email: string): Promise<void> {
  await axios.post('reset-password', {
    email,
    resetUrl: env.appUrl + '/auth/reset-password',
    type: RESET_SECURITY_FLOW_TYPE.PASSWORD,
  });
}

// TODO: Create ResetSecurityFlowService
export async function lostMfaDevice(email: string): Promise<void> {
  await axios.post('reset-device', {
    email,
    resetUrl: env.appUrl + '/auth/reset-device',
    type: RESET_SECURITY_FLOW_TYPE.TOTP,
  });
}

// TODO: Create ResetSecurityFlowService
export async function resetPassword(
  password: string,
  resetPasswordFlowId: string
): Promise<void> {
  await axios.put(`reset-password/${resetPasswordFlowId}`, {
    password,
  });
}

// TODO: Create ResetSecurityFlowService
export async function resetMfaDevice(
  password: string,
  resetMfaFlowId: string
): Promise<void> {
  await axios.put(`reset-device/${resetMfaFlowId}`, { password });
}
