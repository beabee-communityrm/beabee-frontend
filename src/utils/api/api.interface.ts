import { ContributionPeriod } from '../enums/contribution-period.enum';
import { ContributionType } from '../enums/contribution-type.enum';
import { MembershipStatus } from '../enums/membership-status.enum';
import { NewsletterStatus } from '../enums/newsletter-status.enum';

export type Serial<T> = {
  [P in keyof T]: T[P] extends Date
    ? string
    : T[P] extends Date | undefined
    ? string | undefined
    : T[P];
};

export type ContentId = 'join' | 'join/setup' | 'profile';

export type PermissionType = 'member' | 'admin' | 'superadmin';

export interface Address {
  line1: string;
  line2?: string | undefined;
  city: string;
  postcode: string;
}

interface MemberData {
  email: string;
  firstname: string;
  lastname: string;
}

interface MemberProfileData {
  telephone: string;
  twitter: string;
  preferredContact: string;
  deliveryOptIn: boolean;
  deliveryAddress: Address | null;
  newsletterStatus: NewsletterStatus;
  newsletterGroups: string[];

  // Admin only
  tags?: string[];
  notes?: string;
  description?: string;
}

export interface GetMemberData extends MemberData {
  joined: Date;
  contributionAmount?: number;
  contributionPeriod?: ContributionPeriod;
  roles: PermissionType[];
}

export interface GetMemberDataWithProfile extends GetMemberData {
  profile: MemberProfileData;
}

export type UpdateMemberProfileData = Partial<MemberProfileData>;

export interface UpdateMemberData extends Partial<MemberData> {
  password?: string;
  profile?: UpdateMemberProfileData;
}

export interface PaymentSource {
  type: 'direct-debit';
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
  hasPendingPayment?: boolean;
  membershipStatus: MembershipStatus;
  membershipExpiryDate?: Date;
}

export interface UpdateContributionData {
  amount: number;
  payFee: boolean;
  prorate: boolean;
}

export interface SetContributionData extends UpdateContributionData {
  period: ContributionPeriod;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface JoinContent {
  name: string;
  privacyLink: string;
  showNoContribution: boolean;
  subtitle: string;
  termsLink: string;
  title: string;
  initialAmount: number;
  initialPeriod: ContributionPeriod;
  minMonthlyAmount: number;
  periods: {
    name: string;
    presetAmounts: number[];
  }[];
  showAbsorbFee: boolean;
}

export interface JoinSetupContent {
  welcome: string;
  newsletterText: string;
  newsletterOptIn: string;
  newsletterTitle: string;
  showNewsletterOptIn: boolean;
  showMailOptIn: boolean;
  mailTitle: string;
  mailText: string;
  mailOptIn: string;
}

export interface ProfileContent {
  welcomeMessage: string;
  footerMessage: string;
  introMessage: string;
}

export interface BasicCalloutData {
  slug: string;
  title: string;
  excerpt: string;
  image?: string;
  starts?: Date;
  expires?: Date;
}

export enum NoticeStatus {
  Open = 'open',
  Finished = 'finished',
}

export interface GetNoticeData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: NoticeStatus;
  name: string;
  expires?: Date;
  enabled: boolean;
  text: string;
  buttonText: string;
  url?: string;
}

export interface SignupData extends SetContributionData {
  email: string;
  password: string;
  noContribution: boolean;
}
