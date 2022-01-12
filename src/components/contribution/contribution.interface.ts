import { ContributionPeriod } from '../../utils/enums/contribution-period.enum';

export interface ContributionContent {
  initialAmount: number;
  initialPeriod: ContributionPeriod;
  minMonthlyAmount: number;
  periods: {
    name: string;
    presetAmounts: number[];
  }[];
  showAbsorbFee: boolean;
}

export interface ContributionData {
  amount: number;
  period: ContributionPeriod;
  payFee: boolean;

  get totalAmount(): number;
  get fee(): number;
}
