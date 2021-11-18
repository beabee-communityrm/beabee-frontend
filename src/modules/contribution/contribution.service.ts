import axios from '../../axios';
import { ContributionPeriod } from '../../utils/enums/contribution-period.enum';
import { NewContribution, UpdateContribution } from './contribution.interface';

// TODO: currently we use this because data needed for contribution
// is included in join content -
const fetchJoinContent = (): Promise<any> => {
  return axios.get('/content/join');
};

const fetchContribution = (): Promise<any> => {
  return axios.get('/member/me/contribution');
};

const createContribution = (newContribution: NewContribution): Promise<any> => {
  return axios.post('/member/me/contribution', {
    amount: newContribution.amount,
    period: newContribution.period,
    payFee:
      newContribution.payFee &&
      newContribution.period === ContributionPeriod.Monthly,
    completeUrl:
      import.meta.env.VITE_APP_BASE_URL + '/profile/contribution/complete',
    // - TODO: always false for now
    prorate: false,
  });
};

const completeContribution = (redirectFlowId: string): Promise<any> => {
  return axios.post('/member/me/contribution/complete', {
    redirectFlowId,
  });
};
const updateContribution = (
  updateContribution: UpdateContribution
): Promise<any> => {
  return axios.patch('/member/me/contribution', {
    amount: updateContribution.amount,
    payFee: updateContribution.payFee,
    // - TODO: always false for now
    prorate: false,
  });
};

const updatePaymentSource = (): Promise<any> => {
  return axios.put('/member/me/payment-source', {
    completeUrl:
      import.meta.env.VITE_APP_BASE_URL +
      '/profile/contribution/payment-source/complete',
  });
};

const completeUpdatePaymentSource = (redirectFlowId: string): Promise<any> => {
  return axios.post('/member/me/payment-source/complete', {
    redirectFlowId,
  });
};

export {
  fetchJoinContent,
  createContribution,
  completeContribution,
  fetchContribution,
  updateContribution,
  updatePaymentSource,
  completeUpdatePaymentSource,
};
