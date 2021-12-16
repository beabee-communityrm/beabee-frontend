import axios from '../../axios';
import { Information } from './information.interface';

const fetchInformation = (id?: string): Promise<Information> => {
  return axios
    .get(`/member/${id || 'me'}?with[]=profile`)
    .then(({ data }) => {
      return data;
    })
    .catch((err) => err);
};

const updateInformation = (
  updateInformation: Information
): Promise<Information> => {
  return axios.patch('/member/me', {
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
