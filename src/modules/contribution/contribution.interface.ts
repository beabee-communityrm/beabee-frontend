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

export interface PaymentSource {
  type: string;
  bankName: string;
  accountHolderName: string;
  accountNumberEnding: string;
}

export interface CurrentContribution {
  type: ContributionType;
  amount?: number;
  period?: ContributionPeriod;
  cancellationDate?: string;
  renewalDate?: string;
  paymentSource?: PaymentSource;
  payFee?: boolean;
  membershipStatus: MembershipStatus;
  membershipExpiryDate?: string;
}
