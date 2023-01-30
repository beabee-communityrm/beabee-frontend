import { Paginated } from '@beabee/beabee-common';
import { deserializeDate } from '.';
import axios from '../../lib/axios';
import {
  GetCalloutsQuery,
  Serial,
  GetCalloutResponsesQuery,
  CreateCalloutResponseData,
  CreateCalloutData,
  GetCalloutWith,
  GetCalloutDataWith,
  GetCalloutData,
  GetCalloutResponseWith,
  GetCalloutResponseDataWith,
} from './api.interface';
import { deserializeContact } from './contact';

// TODO: how to make this type safe?
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deserializeCallout(callout: any): any {
  return {
    ...callout,
    starts: deserializeDate(callout.starts),
    expires: deserializeDate(callout.expires),
  };
}

// TODO: how to make this type safe?
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deserializeResponse(response: any): any {
  return {
    ...response,
    createdAt: deserializeDate(response.createdAt),
    updatedAt: deserializeDate(response.updatedAt),
    ...(response.contact && { contact: deserializeContact(response.contact) }),
  };
}

export async function fetchCallouts<With extends GetCalloutWith = void>(
  query?: GetCalloutsQuery,
  _with?: readonly With[]
): Promise<Paginated<GetCalloutDataWith<With>>> {
  const { data } = await axios.get<Paginated<Serial<GetCalloutDataWith<With>>>>(
    '/callout',
    { params: { with: _with, ...query } }
  );
  return {
    ...data,
    items: data.items.map(deserializeCallout),
  };
}

export async function fetchCallout<With extends GetCalloutWith = void>(
  id: string,
  _with?: readonly With[]
): Promise<GetCalloutDataWith<With>> {
  const { data } = await axios.get<Serial<GetCalloutDataWith<With>>>(
    '/callout/' + id,
    { params: { with: _with } }
  );
  return deserializeCallout(data);
}

export async function createCallout(
  calloutData: CreateCalloutData
): Promise<GetCalloutData> {
  const { data } = await axios.post<Serial<GetCalloutData>>(
    '/callout',
    // TODO: passing calloutData directly is not safe, it could contain extra properties
    calloutData
  );
  return deserializeCallout(data);
}

export async function updateCallout(
  slug: string,
  calloutData: CreateCalloutData
): Promise<GetCalloutData> {
  const { data } = await axios.patch<Serial<GetCalloutData>>(
    '/callout/' + slug,
    calloutData
  );
  return deserializeCallout(data);
}

export async function deleteCallout(slug: string): Promise<void> {
  await axios.delete('/callout/' + slug);
}

export async function fetchResponses<
  With extends GetCalloutResponseWith = void
>(
  slug: string,
  query?: GetCalloutResponsesQuery,
  _with?: readonly With[]
): Promise<Paginated<GetCalloutResponseDataWith<With>>> {
  const { data } = await axios.get<
    Paginated<Serial<GetCalloutResponseDataWith<With>>>
  >(`/callout/${slug}/responses`, { params: { with: _with, ...query } });
  return {
    ...data,
    items: data.items.map(deserializeResponse),
  };
}

export async function createResponse(
  id: string,
  data: CreateCalloutResponseData
): Promise<void> {
  await axios.post(`/callout/${id}/responses`, {
    answers: data.answers,
    guestName: data.guestName,
    guestEmail: data.guestEmail,
  });
}
