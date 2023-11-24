import axios from '@lib/axios';
import type { LoginData } from '@type';

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
