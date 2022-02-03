export interface UpdateInformation {
  emailAddress: string;
  firstName: string;
  lastName: string;
  password: string;
  deliveryOptIn: boolean;
  addressLine1: string;
  addressLine2?: string;
  cityOrTown: string;
  postCode: string;
}
