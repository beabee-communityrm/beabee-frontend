import axios from '../../lib/axios';
import {
  fetchContactMfaData,
  CreateContactMfaData,
  Serial,
} from './api.interface';

/**
 * Deserialize a contact MFA
 * @param data The data to deserialize
 * @returns The deserialized data
 */
export function deserializeContactMfa<T>(data: T): T {
  // Nothing to do for now
  return data;
}

/**
 * Create a new contact MFA
 * @param contactId The contact id
 * @param dataIn The data to create the contact MFA
 * @returns
 */
export async function createContactMfa(
  contactId: string,
  dataIn: CreateContactMfaData
): Promise<CreateContactMfaData> {
  const { data } = await axios.post<Serial<CreateContactMfaData>>(
    `/contact/${contactId}/mfa`,
    dataIn
  );
  return deserializeContactMfa(data);
}

/**
 * Fetch a contact MFA
 * @param contactId The contact id
 * @returns
 */
export async function fetchContactMfa(
  contactId: string
): Promise<fetchContactMfaData> {
  let { data } = await axios.get<fetchContactMfaData>(
    `/contact/${contactId}/mfa`
  );
  data = data || null;
  return deserializeContactMfa(data);
}

/**
 * Delete a contact MFA
 * @param id The contact id
 */
export async function deleteContactMfa(id: string): Promise<void> {
  await axios.delete(`/contact/${id}/mfa`);
}
