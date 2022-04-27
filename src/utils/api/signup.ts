import axios from '../../axios';
import { ContributionPeriod } from '../enums/contribution-period.enum';
import { SignupData } from './api.interface';

const completeUrls = {
  loginUrl: import.meta.env.VITE_APP_BASE_URL + '/auth/login',
  setPasswordUrl: import.meta.env.VITE_APP_BASE_URL + '/auth/set-password',
  confirmUrl: import.meta.env.VITE_APP_BASE_URL + '/join/confirm-email',
};

export async function signUp(
  data: SignupData
): Promise<{ redirectUrl: string }> {
  return (
    await axios.post<{ redirectUrl: string }>('/signup', {
      email: data.email,
      password: data.password,
      ...(data.noContribution
        ? { complete: completeUrls }
        : {
            contribution: {
              amount: data.amount,
              period: data.period,
              payFee: data.payFee && data.period === ContributionPeriod.Monthly,
              prorate: false,
              completeUrl: import.meta.env.VITE_APP_BASE_URL + '/join/complete',
            },
          }),
    })
  ).data;
}

export async function completeSignUp(paymentFlowId: string): Promise<void> {
  await axios.post('/signup/complete', { paymentFlowId, ...completeUrls });
}

export async function confirmEmail(
  joinFlowId: string | string[]
): Promise<void> {
  await axios.post('/signup/confirm-email', { joinFlowId });
}
