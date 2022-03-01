import { ContributionPeriod } from '../enums/contribution-period.enum';
import { ContributionType } from '../enums/contribution-type.enum';
import { MembershipStatus } from '../enums/membership-status.enum';
import { NewsletterStatus } from '../enums/newsletter-status.enum';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Noop {}

export type Serial<T> = {
  [P in keyof T]: T[P] extends Date
    ? string
    : T[P] extends Date | undefined
    ? string | undefined
    : T[P];
};

export type PermissionType = 'member' | 'admin' | 'superadmin';

type GetPaginatedQueryRuleOperator = 'equal' | 'contains';

interface GetPaginatedQueryRuleGroup<T> {
  condition: 'AND' | 'OR';
  rules: (GetPaginatedQueryRuleGroup<T> | GetPaginatedQueryRule<T>)[];
}

interface GetPaginatedQueryRule<T> {
  field: T;
  operator: GetPaginatedQueryRuleOperator;
  value: string;
}

export interface GetPaginatedQuery<T> {
  limit?: number;
  offset?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
  rules?: GetPaginatedQueryRuleGroup<T>;
}

export interface Paginated<T> {
  items: T[];
  offset: number;
  count: number;
  total: number;
}

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

export interface MemberRoleData {
  role: PermissionType;
  dateAdded: Date;
  dateExpires: Date | null;
}

export type GetMemberWith = 'profile' | 'contribution' | 'roles';

export interface GetMemberData extends MemberData {
  id: string;
  joined: Date;
  lastSeen?: Date;
  contributionAmount?: number;
  contributionPeriod?: ContributionPeriod;
  activeRoles: PermissionType[];
}

export type GetMemberDataWith<With extends GetMemberWith> = GetMemberData &
  ('profile' extends With ? { profile: MemberProfileData } : Noop) &
  ('contribution' extends With ? { contribution: ContributionInfo } : Noop) &
  ('roles' extends With ? { roles: MemberRoleData[] } : Noop);

export type GetMembersQuery = GetPaginatedQuery<
  'firstname' | 'lastname' | 'email'
>;

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

export interface GetPaymentData {
  chargeDate: string;
  amount: number;
  status: string;
}

export type GetPaymentsQuery = GetPaginatedQuery<'chargeDate'>;

export interface LoginData {
  email: string;
  password: string;
}

export interface GeneralContent {
  organisationName: string;
  siteUrl: string;
  supportEmail: string;
  privacyLink: string;
  termsLink: string;
  currencyCode: string;
  footerLinks: { text: string; url: string }[];
}

export interface JoinContent {
  title: string;
  subtitle: string;
  initialAmount: number;
  initialPeriod: ContributionPeriod;
  minMonthlyAmount: number;
  periods: {
    name: string;
    presetAmounts: number[];
  }[];
  showAbsorbFee: boolean;
  showNoContribution: boolean;
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

export interface GetBasicCalloutData {
  slug: string;
  title: string;
  excerpt: string;
  image?: string;
  starts?: Date;
  expires?: Date;
  hasAnswered?: boolean;
}

export enum CalloutStatus {
  Open = 'open',
  Finished = 'finished',
}

export interface GetCalloutsQuery
  extends GetPaginatedQuery<'title' | 'status' | 'answeredBy'> {
  hasAnswered?: string;
}

export interface GetMoreCalloutData extends GetBasicCalloutData {
  templateSchema: {
    formSchema: any;
    intro: string;
    thanksText: string;
    thanksTitle: string;
  };
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

export interface GetSegmentData {
  id: string;
  name: string;
  ruleGroup: any;
  order: number;
  memberCount: number;
}
