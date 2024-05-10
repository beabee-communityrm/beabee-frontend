import type { ContentJoinData, ContentPaymentData } from '@type';

export type ContributionContent = Pick<
  ContentJoinData,
  | 'initialAmount'
  | 'initialPeriod'
  | 'minMonthlyAmount'
  | 'showAbsorbFee'
  | 'periods'
  | 'paymentMethods'
> & {
  payment: ContentPaymentData;
};
