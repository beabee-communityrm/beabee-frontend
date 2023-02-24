import { Paginated, RuleGroup } from '@beabee/beabee-common';
import axios from '../../lib/axios';
import { deserializeDate } from '.';
import { deserializeContact } from './contact';
import {
  GetCalloutResponseWith,
  GetCalloutResponsesQuery,
  GetCalloutResponseDataWith,
  Serial,
  UpdateCalloutResponseData,
} from './api.interface';

// TODO: how to make this type safe?
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deserializeCalloutResponse(response: any): any {
  return {
    ...response,
    createdAt: deserializeDate(response.createdAt),
    updatedAt: deserializeDate(response.updatedAt),
    ...(response.contact && { contact: deserializeContact(response.contact) }),
  };
}

export async function fetchCalloutResponses<
  With extends GetCalloutResponseWith = void
>(
  query?: GetCalloutResponsesQuery,
  _with?: readonly With[]
): Promise<Paginated<GetCalloutResponseDataWith<With>>> {
  const { data } = await axios.get<
    Paginated<Serial<GetCalloutResponseDataWith<With>>>
  >(`/callout-responses`, { params: { with: _with, ...query } });
  return {
    ...data,
    items: data.items.map(deserializeCalloutResponse),
  };
}

export async function updateCalloutResponses(
  rules: RuleGroup,
  updates: UpdateCalloutResponseData
): Promise<{ affected: number }> {
  const { data } = await axios.patch<Serial<{ affected: number }>>(
    '/callout-responses',
    {
      rules,
      updates,
    }
  );
  return data;
}
