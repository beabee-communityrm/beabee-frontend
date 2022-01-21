import axios from '../../axios';
import { LoginData } from './api.interface';

export async function login(data: LoginData): Promise<void> {
  await axios.post('auth/login', {
    email: data.email,
    password: data.password,
  });
}

export async function logout(): Promise<void> {
  await axios.post('auth/logout');
}

export async function forgotPassword(email: string): Promise<void> {
  await axios.post('reset-password', {
    email,
    resetUrl: import.meta.env.VITE_APP_BASE_URL + '/auth/reset-password',
  });
}

export async function resetPassword(
  password: string,
  resetPasswordFlowId: string
): Promise<void> {
  await axios.put(`reset-password/${resetPasswordFlowId}`, { password });
}
