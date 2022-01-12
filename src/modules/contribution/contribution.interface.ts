import { ContributionPeriod } from '../../utils/enums/contribution-period.enum';

export interface ContributionInfo {
  joined: string;
  contributionPeriod: string;
  contributionAmount: number;
}

export enum ContributionType {
  GoCardless = 'GoCardless',
  Manual = 'Manual',
  Gift = 'Gift',
  None = 'None',
}

export enum MembershipStatus {
  Active = 'active',
  Expiring = 'expiring',
  Expired = 'expired',
  None = 'none',
}

export interface CurrentContribution {
  amount: number;
  period: ContributionPeriod;
  type: ContributionType;
  membershipExpiryDate: string | null;
  cancellationDate: string | null;
  membershipStatus: MembershipStatus;
}

export interface NewContribution {
  amount: number;
  period: string;
  payFee: boolean;

  get totalAmount(): number;
  get fee(): number;
}

export interface UpdateContribution {
  amount: number;
  payFee: boolean;
}

export interface Periods {
  name: string;
  presetAmounts: number[];
}

export interface ContributionContent {
  initialAmount: number;
  initialPeriod: string;
  minMonthlyAmount: number;
  periods: Periods[];
  showAbsorbFee: boolean;
}

export interface PaymentSource {
  type: string;
  bankName: string;
  accountHolderName: string;
  accountNumberEnding: string;
}
