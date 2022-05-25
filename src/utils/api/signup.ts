import axios from '../../axios';
import { ContributionPeriod } from '../enums/contribution-period.enum';
import { PaymentFlowParams, Serial, SignupData } from './api.interface';

export const completeUrl = import.meta.env.VITE_APP_BASE_URL + '/join/complete';

export async function signUp(data: SignupData): Promise<PaymentFlowParams> {
  return (
    await axios.post<Serial<PaymentFlowParams>>('/signup', {
      email: data.email,
      password: data.password,
      loginUrl: import.meta.env.VITE_APP_BASE_URL + '/auth/login',
      setPasswordUrl: import.meta.env.VITE_APP_BASE_URL + '/auth/set-password',
      confirmUrl: import.meta.env.VITE_APP_BASE_URL + '/join/confirm-email',
      ...(!data.noContribution && {
        contribution: {
          amount: data.amount,
          period: data.period,
          payFee: data.payFee && data.period === ContributionPeriod.Monthly,
          prorate: false,
          paymentMethod: data.paymentMethod,
          completeUrl,
        },
      }),
    })
  ).data;
}

export async function completeSignUp(paymentFlowId: string): Promise<void> {
  await axios.post('/signup/complete', { paymentFlowId });
}

export async function confirmEmail(
  joinFlowId: string | string[]
): Promise<void> {
  await axios.post('/signup/confirm-email', { joinFlowId });
}
