import type { ContributionPeriod, PaymentMethod } from '@beabee/beabee-common';
import type { StripeFeeCountry } from '@type';

export interface JoinContent {
  title: string;
  subtitle: string;
  initialAmount: number;
  initialPeriod: ContributionPeriod;
  minMonthlyAmount: number;
  periods: {
    name: ContributionPeriod;
    presetAmounts: number[];
  }[];
  showAbsorbFee: boolean;
  showNoContribution: boolean;
  paymentMethods: PaymentMethod[];
  stripePublicKey: string;
  stripeCountry: StripeFeeCountry;
}
