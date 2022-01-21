import { Address } from '../../utils/api/api.interface';

export interface UpdateInformation {
  emailAddress: string;
  firstName: string;
  lastName: string;
  password: string;
  addressLine1: string;
  addressLine2?: string;
  cityOrTown: string;
  postCode: string;
}

export interface Profile {
  deliveryOptIn: boolean;
  deliveryAddress: Address | null;
  newsletterStatus: string;
}
