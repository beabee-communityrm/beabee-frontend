import type { ContentJoin } from '@type';

export type ContributionContent = Pick<
  ContentJoin,
  | 'initialAmount'
  | 'initialPeriod'
  | 'minMonthlyAmount'
  | 'showAbsorbFee'
  | 'periods'
  | 'paymentMethods'
  | 'stripePublicKey'
  | 'stripeCountry'
>;
