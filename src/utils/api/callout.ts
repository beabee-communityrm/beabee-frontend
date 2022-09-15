import { deserializeDate } from '.';
import axios from '../../axios';
import {
  GetBasicCalloutData,
  GetCalloutsQuery,
  Paginated,
  GetMoreCalloutData,
  Serial,
  GetCalloutResponseData,
  GetCalloutResponsesQuery,
  CreateCalloutResponseData,
  CreateCalloutData,
  UpdateCalloutData,
} from './api.interface';

function deserializeCallout<
  S extends Serial<any>,
  T extends S extends Serial<infer U>
    ? U extends GetBasicCalloutData
      ? U
      : never
    : never
>(callout: S): T {
  return {
    ...callout,
    starts: deserializeDate(callout.starts),
    expires: deserializeDate(callout.expires),
  };
}

export async function fetchCallouts(
  query?: GetCalloutsQuery
): Promise<Paginated<GetBasicCalloutData>> {
  const { data } = await axios.get<Paginated<Serial<GetBasicCalloutData>>>(
    '/callout',
    { params: query }
  );
  return {
    ...data,
    items: data.items.map(deserializeCallout),
  };
}

export async function fetchCallout(id: string): Promise<GetMoreCalloutData> {
  const { data } = await axios.get<Serial<GetMoreCalloutData>>(
    '/callout/' + id
  );
  return deserializeCallout(data);
}

export async function createCallout(
  calloutData: CreateCalloutData
): Promise<GetBasicCalloutData> {
  const { data } = await axios.post<Serial<GetBasicCalloutData>>(
    '/callout',
    // TODO: passing calloutData directly is not safe, it could contain extra properties
    calloutData
  );
  return deserializeCallout(data);
}

export async function updateCallout(
  slug: string,
  calloutData: UpdateCalloutData
): Promise<GetMoreCalloutData> {
  const { data } = await axios.patch<Serial<GetMoreCalloutData>>(
    '/callout/' + slug,
    calloutData
  );
  return deserializeCallout(data);
}

export async function deleteCallout(slug: string): Promise<void> {
  await axios.delete('/callout/' + slug);
}

export async function fetchResponses(
  id: string,
  query?: GetCalloutResponsesQuery
): Promise<Paginated<GetCalloutResponseData>> {
  const { data } = await axios.get<Paginated<Serial<GetCalloutResponseData>>>(
    `/callout/${id}/responses`,
    { params: query }
  );
  return {
    ...data,
    items: data.items.map((item) => ({
      ...item,
      createdAt: deserializeDate(item.createdAt),
      updatedAt: deserializeDate(item.updatedAt),
    })),
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
