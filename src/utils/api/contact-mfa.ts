/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ContributionPeriod,
  Paginated,
  PaymentMethod,
  RoleType,
} from '@beabee/beabee-common';

import axios from '../../lib/axios';
import {
  GetContactMfaData,
  CreateContactMfaData,
  UpdateContactMfaData,
  GetContactData,
  GetContactDataWith,
  GetContactsQuery,
  GetContactWith,
  GetPaymentData,
  GetPaymentsQuery,
  ContactRoleData,
  PaymentFlowParams,
  Serial,
  SetContributionData,
  StartContributionData,
  UpdateContactData,
  UpdateContactRoleData,
} from './api.interface';

import { deserializeDate } from '.';
import env from '../../env';

export function deserializeContactMfa<T>(data: T): T {
  console.debug('deserializeContactMfa', data);
  return data;
}

export async function createContactMfa(
  id: string,
  dataIn: CreateContactMfaData
): Promise<CreateContactMfaData> {
  const { data } = await axios.post<Serial<CreateContactMfaData>>(`/contact/${id}/mfa`, dataIn);
  return deserializeContactMfa(data);
}

export async function fetchContact(
  id: string,
): Promise<GetContactMfaData> {
  const { data } = await axios.get<Serial<GetContactMfaData>>(
    `/contact/${id}/mfa`,
  );
  return deserializeContactMfa(data);
}

export async function updateContactMfa(
  id: string,
  dataIn: UpdateContactMfaData
): Promise<UpdateContactMfaData> {
  const { data } = await axios.patch<Serial<UpdateContactMfaData>>(
    `/contact/${id}/mfa`,
    dataIn,
  );
  return deserializeContactMfa(data);
}

export async function deleteContactMfa(id: string, role: RoleType): Promise<void> {
  await axios.delete(`/contact/${id}/mfa`);
}
