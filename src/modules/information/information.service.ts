import axios from '../../axios';
import { Information } from './information.interface';

const fetchInformation = (id?: string): Promise<any> => {
  return id ? axios.get(`/member/${id}`) : axios.get('/member/me');
};

const updateInformation = (updateInformation: Information): Promise<any> => {
  return axios.put('/member/me', {
    email: updateInformation.emailAddress,
    firstname: updateInformation.firstName,
    lastname: updateInformation.lastName,
    phone: updateInformation.phone,
    password: updateInformation.password,
    description: updateInformation.description,
    notes: updateInformation.notes,
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
