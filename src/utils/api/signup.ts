import axios from '../../axios';
import env from '../../env';
import { ContributionPeriod } from '../enums/contribution-period.enum';
import {
  CompleteSignupData,
  PaymentFlowParams,
  Serial,
  SignupData,
} from './api.interface';

export const completeUrl = env.baseUrl + '/join/complete';

export async function signUp(data: SignupData): Promise<PaymentFlowParams> {
  return (
    await axios.post<Serial<PaymentFlowParams>>('/signup', {
      email: data.email,
      password: data.password,
      loginUrl: env.baseUrl + '/auth/login',
      setPasswordUrl: env.baseUrl + '/auth/set-password',
      confirmUrl: env.baseUrl + '/join/confirm-email',
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

export async function completeSignUp(data: CompleteSignupData): Promise<void> {
  await axios.post('/signup/complete', {
    paymentFlowId: data.paymentFlowId,
    firstname: data.firstname,
    lastname: data.lastname,
  });
}

export async function confirmEmail(
  joinFlowId: string | string[]
): Promise<void> {
  await axios.post('/signup/confirm-email', { joinFlowId });
}
