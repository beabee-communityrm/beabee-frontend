import axios from '@/axios';
import { Information, UpdateInformation } from './information.interface';

const fetchInformation = (): Promise<Information> => {
  return axios.get('/member/me');
};

const updateInformation = (
  updateInformation: UpdateInformation
): Promise<Information> => {
  return axios.put('/member/me', {
    email: updateInformation.emailAddress,
    firstname: updateInformation.firstName,
    lastname: updateInformation.lastName,
    password: updateInformation.password,
    profile: {
      deliveryAddress: {
        line1: updateInformation.addressLine1,
        line2: updateInformation.addressLine2,
        city: updateInformation.cityOrTown,
        postcode: updateInformation.postCode,
      },
    },
  });
};

export { fetchInformation, updateInformation };
