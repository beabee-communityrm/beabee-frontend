import { LocationQueryValue } from 'vue-router';
import axios from '../../axios';
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
  });
};

const completeSignUp = (
  redirectFlowId: LocationQueryValue | LocationQueryValue[]
): Promise<any> => {
  return axios.post('/signup/complete', {
    redirectFlowId,
  });
};

const confirmEmail = (id: string | string[]): Promise<any> => {
  return axios.post('/signup/confirm-email', {
    restartFlowId: id,
  });
};

const fetchMember = (): Promise<any> => {
  return axios.get('/member/me');
};

const updateMember = (memberData: MemberData): Promise<any> => {
  return axios.put('/member/me', {
    email: memberData.email,
    firstname: memberData.firstName,
    lastname: memberData.lastName,
    profile: {
      newsletterStatus: memberData.profile.newsletterStatus
        ? NewsletterStaus.Subscribed
        : NewsletterStaus.Unsubscribed,
    },
  });
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
