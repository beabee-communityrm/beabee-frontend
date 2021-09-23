export interface Information {
  email: string;
  firstname: string;
  lastname: string;
  profile: Profile;
}

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

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
}
