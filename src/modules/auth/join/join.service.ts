import { LocationQueryValue } from 'vue-router';
import axios from '../../../axios';
import { ContributionPeriod } from '../../../utils/enums/contribution-period.enum';
import {
  DeliveryAddress,
  MemberData,
  MemberRequest,
  Profile,
  SignUpData,
} from './join.interface';
import { NewsletterStaus } from './newsletter-status.enum';

const fetchJoinContent = (): Promise<any> => {
  return axios.get('/content/join');
};

const fetchSetupContent = (): Promise<any> => {
  return axios.get('/content/join/setup');
};

const completeUrls = {
  loginUrl: import.meta.env.VITE_APP_BASE_URL + '/auth/login',
  setPasswordUrl: import.meta.env.VITE_APP_BASE_URL + '/auth/set-password',
  confirmUrl: import.meta.env.VITE_APP_BASE_URL + '/join/confirm-email',
};

const signUp = (signUpData: SignUpData): Promise<any> => {
  return axios.post('/signup', {
    email: signUpData.email,
    password: signUpData.password,
    ...(signUpData.noContribution
      ? { complete: completeUrls }
      : {
          contribution: {
            amount: signUpData.amount,
            period: signUpData.period,
            payFee:
              signUpData.payFee &&
              signUpData.period === ContributionPeriod.Monthly,
            completeUrl: import.meta.env.VITE_APP_BASE_URL + '/join/complete',
          },
        }),
  });
};

const completeSignUp = (
  redirectFlowId: LocationQueryValue | LocationQueryValue[]
): Promise<any> => {
  return axios.post('/signup/complete', { redirectFlowId, ...completeUrls });
};

const confirmEmail = (id: string | string[]): Promise<any> => {
  return axios.post('/signup/confirm-email', {
    joinFlowId: id,
  });
};

const fetchMember = (): Promise<any> => {
  return axios.get('/member/me?with[]=profile');
};
const updateMember = (
  memberData: MemberData,
  showNewsletterOptIn: boolean,
  showMailOptIn: boolean
): Promise<any> => {
  const params: MemberRequest = {
    email: memberData.email,
    firstname: memberData.firstName,
    lastname: memberData.lastName,
  };

  if (showNewsletterOptIn || showMailOptIn) {
    params.profile = {} as Profile;

    if (showNewsletterOptIn) {
      params.profile.newsletterStatus = memberData.profile.newsletterStatus
        ? NewsletterStaus.Subscribed
        : NewsletterStaus.Unsubscribed;
    }

    if (showMailOptIn) {
      params.profile.deliveryOptIn = memberData.profile.deliveryOptIn;
      params.profile.deliveryAddress = {} as DeliveryAddress;
      params.profile.deliveryAddress.line1 = memberData.addressLine1;
      params.profile.deliveryAddress.line2 = memberData.addressLine2;
      params.profile.deliveryAddress.city = memberData.cityOrTown;
      params.profile.deliveryAddress.postcode = memberData.postCode;
    }
  }

  return axios.patch('/member/me', params);
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
