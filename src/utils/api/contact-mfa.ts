import axios from '../../lib/axios';
import {
  GetContactMfaData,
  CreateContactMfaData,
  UpdateContactMfaData,
  Serial,
} from './api.interface';

export function deserializeContactMfa<T>(data: T): T {
  // Nothing to do for now
  return data;
}

export async function createContactMfa(
  id: string,
  dataIn: CreateContactMfaData
): Promise<CreateContactMfaData> {
  const { data } = await axios.post<Serial<CreateContactMfaData>>(
    `/contact/${id}/mfa`,
    dataIn
  );
  return deserializeContactMfa(data);
}

export async function fetchContact(id: string): Promise<GetContactMfaData> {
  const { data } = await axios.get<Serial<GetContactMfaData>>(
    `/contact/${id}/mfa`
  );
  return deserializeContactMfa(data);
}

export async function updateContactMfa(
  id: string,
  dataIn: UpdateContactMfaData
): Promise<UpdateContactMfaData> {
  const { data } = await axios.patch<Serial<UpdateContactMfaData>>(
    `/contact/${id}/mfa`,
    dataIn
  );
  return deserializeContactMfa(data);
}

export async function deleteContactMfa(id: string): Promise<void> {
  await axios.delete(`/contact/${id}/mfa`);
}
