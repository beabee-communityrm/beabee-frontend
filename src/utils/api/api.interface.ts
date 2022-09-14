import { ContributionPeriod } from '../enums/contribution-period.enum';
import { ContributionType } from '../enums/contribution-type.enum';
import { MembershipStatus } from '../enums/membership-status.enum';
import { NewsletterStatus } from '../enums/newsletter-status.enum';
import { PaymentMethod } from '../enums/payment-method.enum';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Noop {}

// Dates are serialized in API response
export type Serial<T> = {
  [P in keyof T]: T[P] extends Date
    ? string
    : T[P] extends Date | undefined
    ? string | undefined
    : T[P];
};

// Allow null in place of possibly undefined fields, useful for create/update as
// JSON serialisation removes undefined keys
export type AllowNull<T> = {
  [P in keyof T]: undefined extends T[P] ? T[P] | null : T[P];
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
  value: string | number | boolean;
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

export enum ItemStatus {
  Draft = 'draft',
  Scheduled = 'scheduled',
  Open = 'open',
  Ended = 'ended',
}

interface MemberData {
  email: string;
  firstname: string;
  lastname: string;
}

export interface PaymentFlowParams {
  clientSecret?: string;
  redirectUrl?: string;
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

export interface CardPaymentSource {
  method: PaymentMethod.StripeCard;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
}

export interface GoCardlessDirectDebitPaymentSource {
  method: PaymentMethod.GoCardlessDirectDebit;
  bankName: string;
  accountHolderName: string;
  accountNumberEnding: string;
}

export interface StripeBACSPaymentSource {
  method: PaymentMethod.StripeBACS;
  sortCode: string;
  last4: string;
}

export interface StripeSEPAPaymentSource {
  method: PaymentMethod.StripeSEPA;
  country: string;
  bankCode: string;
  branchCode: string;
  last4: string;
}

export type PaymentSource =
  | CardPaymentSource
  | GoCardlessDirectDebitPaymentSource
  | StripeBACSPaymentSource
  | StripeSEPAPaymentSource;

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

export interface SetContributionData {
  amount: number;
  payFee: boolean;
  prorate: boolean;
  period: ContributionPeriod;
}

export interface StartContributionData extends SetContributionData {
  paymentMethod: PaymentMethod;
}

export enum PaymentStatus {
  Pending = 'pending',
  Successful = 'successful',
  Failed = 'failed',
  Cancelled = 'cancelled',
}

export interface GetPaymentData {
  chargeDate: string;
  amount: number;
  status: PaymentStatus;
}

export type GetPaymentsQuery = GetPaginatedQuery<'chargeDate'>;

export interface LoginData {
  email: string;
  password: string;
}

export interface ContactsContent {
  tags: string[];
  manualPaymentSources: string[];
}

export interface GeneralContent {
  organisationName: string;
  logoUrl: string;
  siteUrl: string;
  supportEmail: string;
  privacyLink: string;
  termsLink?: string;
  impressumLink?: string;
  locale: string;
  currencyCode: string;
  hideContribution?: boolean;
  footerLinks?: { text: string; url: string }[];
  theme: {
    colors?: {
      _name?: string;
      primary?: string;
      link?: string;
      body?: string;
      success?: string;
      warning?: string;
      danger?: string;
      white?: string;
      black?: string;
    };
    fonts?: {
      body?: string;
      title?: string;
    };
  };
  backgroundUrl?: string;
}

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
  introMessage: string;
}

export interface EmailContent {
  footer: string;
  supportEmail: string;
  supportEmailName: string;
}

export interface ShareContent {
  title: string;
  description: string;
  image: string;
  twitterHandle: string;
}

interface BasicCalloutData {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  starts: Date | null;
  expires: Date | null;
  allowUpdate: boolean;
  allowMultiple: boolean;
  access: 'member' | 'guest' | 'anonymous' | 'only-anonymous';
  hidden: boolean;
}

interface MoreCalloutData extends BasicCalloutData {
  formSchema: CalloutFormSchema;
  intro: string;
  thanksText: string;
  thanksTitle: string;
  thanksRedirect?: string;
  shareTitle?: string;
  shareDescription?: string;
}

export interface CalloutFormSchema {
  components: unknown[];
}

export interface GetBasicCalloutData extends BasicCalloutData {
  status: ItemStatus;
  hasAnswered?: boolean;
}

export interface GetMoreCalloutData
  extends GetBasicCalloutData,
    MoreCalloutData {}

export type CreateCalloutData = AllowNull<MoreCalloutData>;

export type UpdateCalloutData = Omit<CreateCalloutData, 'slug'>;

export interface GetCalloutsQuery
  extends GetPaginatedQuery<'title' | 'status' | 'answeredBy' | 'hidden'> {
  hasAnswered?: string;
}

export type GetCalloutResponsesQuery = GetPaginatedQuery<'member'>;

type CalloutResponseAnswer =
  | string
  | boolean
  | number
  | null
  | undefined
  | Record<string, boolean>;
export type CalloutResponseAnswers = Record<string, CalloutResponseAnswer>;

export interface GetCalloutResponseData {
  answers: CalloutResponseAnswers;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCalloutResponseData {
  guestName?: string;
  guestEmail?: string;
  answers: CalloutResponseAnswers;
}

export type GetNoticesQuery = GetPaginatedQuery<
  'name' | 'status' | 'createdAt' | 'updatedAt'
>;

export interface GetNoticeData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: ItemStatus;
  name: string;
  starts?: Date;
  expires?: Date;
  enabled: boolean;
  text: string;
  buttonText?: string;
  url?: string;
}

export interface SignupData extends StartContributionData {
  email: string;
  password: string;
  noContribution: boolean;
}

export interface CompleteSignupData {
  paymentFlowId: string;
  firstname?: string;
  lastname?: string;
}

export interface GetSegmentData {
  id: string;
  name: string;
  ruleGroup: any;
  order: number;
  memberCount: number;
}

export interface GetStatsQuery {
  from: Date;
  to: Date;
}

export interface GetStatsData {
  newMembers: number;
  averageContribution: number | null;
  totalRevenue: number | null;
}

export interface GetEmailData {
  subject: string;
  body: string;
}

export type UpdateEmailData = GetEmailData;
