import { JoinContent } from '../../utils/api/api.interface';
import { ContributionPeriod } from '../../utils/enums/contribution-period.enum';
import { PaymentMethod } from '../../utils/enums/payment-method.enum';

export type ContributionContent = Pick<
  JoinContent,
  | 'initialAmount'
  | 'initialPeriod'
  | 'minMonthlyAmount'
  | 'showAbsorbFee'
  | 'periods'
>;

export interface ContributionData {
  amount: number;
  period: ContributionPeriod;
  payFee: boolean;
  prorate: boolean;
  paymentMethod: PaymentMethod;

  get totalAmount(): number;
  get fee(): number;
}
