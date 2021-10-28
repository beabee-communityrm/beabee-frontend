import axios from '../../axios';
import { ForgotPasswordData, LoginData } from './auth.interface';

const login = (loginData: LoginData): Promise<any> => {
  return axios.post('auth/login', {
    email: loginData.email,
    password: loginData.password,
  });
};

const logout = (): Promise<any> => {
  return axios.post('auth/logout');
};

const forgotPassword = (
  forgotPasswordData: ForgotPasswordData
): Promise<any> => {
  return axios.post('reset-password', forgotPasswordData);
};

const resetPassword = (
  password: string,
  resetPasswordFlowId: string
): Promise<any> => {
  return axios.put(`reset-password/${resetPasswordFlowId}`, { password });
};

export { login, logout, forgotPassword, resetPassword };
