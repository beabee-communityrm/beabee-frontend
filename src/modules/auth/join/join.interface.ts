import { ContributionPeriod } from '../../../utils/enums/contribution-period.enum';
import { Periods } from '../../contribution/contribution.interface';
import { NewsletterStaus } from './newsletter-status.enum';

export interface SignUpData {
  email: string;
  password: string;
  amount: number;
  period: ContributionPeriod;
  payFee: boolean;
  noContribution: boolean;
}

export interface MemberData {
  email: string;
  firstName: string;
  lastName: string;
  profile: {
    newsletterOptIn: boolean;
    deliveryOptIn: boolean;
  };
  addressLine1: string;
  addressLine2: string;
  cityOrTown: string;
  postCode: string;
}

export interface UpdateMemberRequest {
  email: string;
  firstname: string;
  lastname: string;
  profile?: UpdateProfile;
}

export interface UpdateProfile {
  newsletterStatus?: NewsletterStaus;
  deliveryOptIn?: boolean;
  deliveryAddress?: DeliveryAddress;
}

export interface DeliveryAddress {
  line1: string;
  line2: string;
  city: string;
  postcode: string;
}

export interface JoinContentData {
  initialAmount: number;
  initialPeriod: string;
  minMonthlyAmount: number;
  name: string;
  periods: Periods[];
  privacyLink: string;
  showAbsorbFee: boolean;
  showNoContribution: boolean;
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
  showMailOptIn: boolean;
  mailTitle: string;
  mailText: string;
  mailOptIn: string;
}
