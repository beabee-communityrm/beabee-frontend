import { deserializeDate } from '.';
import axios from '../../axios';
import {
  GetCalloutsQuery,
  Paginated,
  Serial,
  GetCalloutResponseData,
  GetCalloutResponsesQuery,
  CreateCalloutResponseData,
  CreateCalloutData,
  UpdateCalloutData,
  GetCalloutWith,
  GetCalloutDataWith,
  GetCalloutData,
} from './api.interface';

// TODO: how to make this type safe?
function deserializeCallout(callout: any): any {
  return {
    ...callout,
    starts: deserializeDate(callout.starts),
    expires: deserializeDate(callout.expires),
  };
}

export async function fetchCallouts(
  query: GetCalloutsQuery
): Promise<Paginated<GetCalloutData>>;
export async function fetchCallouts<With extends GetCalloutWith>(
  query: GetCalloutsQuery,
  _with: readonly With[]
): Promise<Paginated<GetCalloutDataWith<With>>>;
export async function fetchCallouts<With extends GetCalloutWith>(
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

export async function fetchCallout(id: string): Promise<GetCalloutData>;
export async function fetchCallout<With extends GetCalloutWith>(
  id: string,
  _with: readonly With[]
): Promise<GetCalloutDataWith<With>>;
export async function fetchCallout<With extends GetCalloutWith>(
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
  calloutData: UpdateCalloutData
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
