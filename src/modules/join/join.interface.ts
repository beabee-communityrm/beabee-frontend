import { ContributionPeriod } from './contribution-period.enum';

export interface SignUpData {
  email: string;
  password: string;
  amount: number;
  period: ContributionPeriod;
  payFee: boolean;
  completeUrl: string;
}

export interface MemberData {
  email: string;
  firstName: string;
  lastName: string;
  profile: {
    newsletterStatus: boolean;
  };
}

export interface JoinContentData {
  currencySymbol: string;
  initialAmount: number;
  initialPeriod: string;
  minMonthlyAmount: number;
  name: string;
  periods: Periods[];
  privacyLink: string;
  showAbsorbFee: boolean;
  subtitle: string;
  termsLink: string;
  title: string;
}

export interface SetupContentData {
  welcome: string;
  newsletterText: string;
  newsletterOptIn: string;
  newsletterTitle: string;
  showNewsletterOptIn: boolean;
}

export interface Periods {
  name: string;
  presetAmounts: number[];
}
