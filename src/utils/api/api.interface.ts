import {
  ContributionPeriod,
  ContributionType,
  ItemStatus,
  MembershipStatus,
  NewsletterStatus,
  PaginatedQuery,
  PaymentMethod,
  PaymentStatus,
  PermissionType,
} from '@beabee/beabee-common';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Noop {}

// Dates are serialized in API response
export type Serial<T> = {
  [P in keyof T]: T[P] extends Date
    ? string
    : T[P] extends Date | undefined
    ? string | undefined
    : T[P] extends Date | null
    ? string | null
    : T[P];
};

// Allow null in place of possibly undefined fields, useful for create/update as
// JSON serialisation removes undefined keys
export type AllowNull<T> = {
  [P in keyof T]: undefined extends T[P] ? T[P] | null : T[P];
};

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

export interface UpdateMemberRoleData {
  dateAdded: Date;
  dateExpires: Date | null;
}

export interface MemberRoleData extends UpdateMemberRoleData {
  role: PermissionType;
}

export interface GetMemberData extends MemberData {
  id: string;
  joined: Date;
  lastSeen?: Date;
  contributionAmount?: number;
  contributionPeriod?: ContributionPeriod;
  activeRoles: PermissionType[];
}

export type GetMemberWith = 'profile' | 'contribution' | 'roles';

export type GetMemberDataWith<With extends GetMemberWith> = GetMemberData &
  ('profile' extends With ? { profile: MemberProfileData } : Noop) &
  ('contribution' extends With ? { contribution: ContributionInfo } : Noop) &
  ('roles' extends With ? { roles: MemberRoleData[] } : Noop);

export type GetMembersQuery = PaginatedQuery; // TODO: constrain fields

export type UpdateMemberProfileData = Partial<MemberProfileData>;

export interface UpdateMemberData extends Partial<MemberData> {
  password?: string;
  profile?: UpdateMemberProfileData;
}

export interface GoCardlessDirectDebitPaymentSource {
  method: PaymentMethod.GoCardlessDirectDebit;
  bankName: string;
  accountHolderName: string;
  accountNumberEnding: string;
}

export interface StripeCardPaymentSource {
  method: PaymentMethod.StripeCard;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
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

export interface ManualPaymentSource {
  method: null;
  source?: string;
  reference?: string;
}

export type PaymentSource =
  | StripeCardPaymentSource
  | GoCardlessDirectDebitPaymentSource
  | StripeBACSPaymentSource
  | StripeSEPAPaymentSource
  | ManualPaymentSource;

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

export interface ForceUpdateContributionData {
  type: ContributionType.Manual | ContributionType.None;
  amount: number | null;
  period: ContributionPeriod | null;
  source?: string;
  reference?: string;
}

export interface StartContributionData extends SetContributionData {
  paymentMethod: PaymentMethod;
}

export interface GetPaymentData {
  chargeDate: string;
  amount: number;
  status: PaymentStatus;
}

export type GetPaymentsQuery = PaginatedQuery; // TODO: constrain fields

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
  currencySymbol: string;
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

export type StripeFeeCountry = 'eu' | 'gb' | 'ca';

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

interface CalloutData {
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

interface CalloutFormData {
  formSchema: CalloutFormSchema;
  intro: string;
  thanksText: string;
  thanksTitle: string;
  thanksRedirect?: string;
  shareTitle?: string;
  shareDescription?: string;
}

export interface GetCalloutData extends CalloutData {
  status: ItemStatus;
}

export interface CalloutFormSchema {
  components: unknown[];
}

export type GetCalloutWith = 'form' | 'responseCount' | 'hasAnswered';

export type GetCalloutDataWith<With extends GetCalloutWith> = GetCalloutData &
  ('responseCount' extends With ? { responseCount: number } : Noop) &
  ('hasAnswered' extends With ? { hasAnswered: boolean } : Noop) &
  ('form' extends With ? CalloutFormData : Noop);

export type CreateCalloutData = AllowNull<CalloutData & CalloutFormData>;

export type UpdateCalloutData = Omit<CreateCalloutData, 'slug'>;

export type GetCalloutsQuery = PaginatedQuery; // TODO: constrain fields

export type GetCalloutResponsesQuery = PaginatedQuery; // TODO: constrain fields

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

export type GetNoticesQuery = PaginatedQuery; // TODO: constrain fields

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ruleGroup: any; // TODO: add types
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
