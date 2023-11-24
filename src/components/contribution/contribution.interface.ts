import type { JoinContent } from '@type';

export type ContributionContent = Pick<
  JoinContent,
  | 'initialAmount'
  | 'initialPeriod'
  | 'minMonthlyAmount'
  | 'showAbsorbFee'
  | 'periods'
  | 'paymentMethods'
  | 'stripePublicKey'
  | 'stripeCountry'
>;
