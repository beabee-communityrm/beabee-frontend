import { ContributionPeriod } from '../../utils/enums/contribution-period.enum';

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

export interface PaymentSource {
  type: string;
  bankName: string;
  accountHolderName: string;
  accountNumberEnding: string;
}
