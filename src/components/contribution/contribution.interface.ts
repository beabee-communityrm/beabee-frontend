import type { ContentJoinData, ContentStripeData } from '@type';

export type ContributionContent = Pick<
  ContentJoinData,
  | 'initialAmount'
  | 'initialPeriod'
  | 'minMonthlyAmount'
  | 'showAbsorbFee'
  | 'periods'
  | 'paymentMethods'
> & {
  stripe: Pick<ContentStripeData, 'publicKey' | 'country'>;
};
