import { LocationQueryValue } from 'vue-router';
import axios from '../../../axios';
import { ContributionPeriod } from '../../../utils/enums/contribution-period.enum';
import { MemberData, SignUpData } from './join.interface';
import { NewsletterStaus } from './newsletter-status.enum';

const fetchJoinContent = (): Promise<any> => {
  return axios.get('/content/join');
};

const fetchSetupContent = (): Promise<any> => {
  return axios.get('/content/join/setup');
};

const signUp = (signUpData: SignUpData): Promise<any> => {
  return axios.post('/signup', {
    ...signUpData,
    payFee:
      signUpData.payFee && signUpData.period === ContributionPeriod.Monthly,
  });
};

const completeSignUp = (
  redirectFlowId: LocationQueryValue | LocationQueryValue[]
): Promise<any> => {
  return axios.post('/signup/complete', {
    redirectFlowId,
    confirmUrl: import.meta.env.VITE_APP_BASE_URL + '/join/confirm-email',
  });
};

const confirmEmail = (id: string | string[]): Promise<any> => {
  return axios.post('/signup/confirm-email', {
    joinFlowId: id,
  });
};

const fetchMember = (): Promise<any> => {
  return axios.get('/member/me');
};

const updateMember = (
  memberData: MemberData,
  updateNewsletterStatus: boolean
): Promise<any> => {
  const params = {
    email: memberData.email,
    firstname: memberData.firstName,
    lastname: memberData.lastName,
  };

  if (updateNewsletterStatus) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    params.profile.newsletterStatus = memberData.profile.newsletterStatus
      ? NewsletterStaus.Subscribed
      : NewsletterStaus.Unsubscribed;
  }

  return axios.put('/member/me', params);
};

export {
  signUp,
  completeSignUp,
  confirmEmail,
  fetchMember,
  updateMember,
  fetchJoinContent,
  fetchSetupContent,
};
