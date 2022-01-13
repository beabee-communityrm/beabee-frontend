import { ContributionData } from '../../components/contribution/contribution.interface';
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

export interface ContributionInfo {
  type: ContributionType;
  amount?: number;
  nextAmount?: number;
  period?: ContributionPeriod;
  cancellationDate?: Date;
  renewalDate?: Date;
  paymentSource?: PaymentSource;
  payFee?: boolean;
  membershipStatus: MembershipStatus;
  membershipExpiryDate?: Date;
}

export interface UpdateContribution extends ContributionData {
  prorate: boolean;
}
