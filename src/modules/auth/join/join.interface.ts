import { ContributionData } from '../../../components/contribution/contribution.interface';
import { SignupData as ApiSignupData } from '../../../utils/api/api.interface';

export interface SignupData extends ApiSignupData, ContributionData {}

export interface SetupMemberData {
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
