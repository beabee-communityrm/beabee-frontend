import { JoinContent } from '../../utils/api/api.interface';

export type ContributionContent = Pick<
  JoinContent,
  | 'initialAmount'
  | 'initialPeriod'
  | 'minMonthlyAmount'
  | 'showAbsorbFee'
  | 'periods'
  | 'paymentMethods'
>;
