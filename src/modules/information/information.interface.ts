export interface Information {
  emailAddress: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  deliveryOptIn: boolean;
  addressLine1: string;
  addressLine2?: string;
  cityOrTown: string;
  postCode: string;
  description: string;
  notes: string;
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
