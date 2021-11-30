import axios from '../../axios';
import { ContributionPeriod } from '../../utils/enums/contribution-period.enum';
import { NewContribution, UpdateContribution } from './contribution.interface';

// TODO: currently we use this because data needed for contribution
// is included in join content -
const fetchJoinContent = (): Promise<any> => {
  return axios.get('/content/join');
};

const fetchContribution = (id?: string): Promise<any> => {
  return axios.get(`/member/${id || 'me'}/contribution`);
};

const createContribution = (
  newContribution: NewContribution,
  id?: string
): Promise<any> => {
  return axios.post(`/member/${id || 'me'}/contribution`, {
    amount: newContribution.amount,
    period: newContribution.period,
    payFee:
      newContribution.payFee &&
      newContribution.period === ContributionPeriod.Monthly,
    completeUrl:
      import.meta.env.VITE_APP_BASE_URL + '/contribution/complete/' + id,
  });
};

const completeContribution = (
  redirectFlowId: string,
  id?: string
): Promise<any> => {
  return axios.post(`/member/${id || 'me'}/contribution/complete`, {
    redirectFlowId,
  });
};
const updateContribution = (
  updateContribution: UpdateContribution,
  id?: string
): Promise<any> => {
  return axios.patch(`/member/${id || 'me'}/contribution`, {
    amount: updateContribution.amount,
    payFee: updateContribution.payFee,
    // - TODO: always false for now
    prorate: false,
  });
};

const updatePaymentSource = (id?: string): Promise<any> => {
  return axios.put(`/member/${id || 'me'}/payment-source`, {
    completeUrl:
      import.meta.env.VITE_APP_BASE_URL +
      '/contribution/payment-source/complete/' +
      id,
  });
};

const completeUpdatePaymentSource = (
  redirectFlowId: string,
  id?: string
): Promise<any> => {
  return axios.post(`/member/${id || 'me'}/payment-source/complete`, {
    redirectFlowId,
  });
};

const cancelContribution = (id?: string): Promise<any> => {
  return axios.post(`/member/${id || 'me'}/contribution/cancel`);
};

export {
  fetchJoinContent,
  createContribution,
  completeContribution,
  fetchContribution,
  updateContribution,
  updatePaymentSource,
  completeUpdatePaymentSource,
  cancelContribution,
};
