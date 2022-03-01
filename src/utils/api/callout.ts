import { parseISO } from 'date-fns';
import axios from '../../axios';
import {
  GetBasicCalloutData,
  GetCalloutsQuery,
  Paginated,
  GetMoreCalloutData,
  Serial,
} from './api.interface';

// TODO: dedupe from member
function toDate(s: string): Date;
function toDate(s: string | undefined): Date | undefined;
function toDate(s: string | undefined): Date | undefined {
  return s ? parseISO(s) : undefined;
}

function toCallout<
  S extends Serial<any>,
  T extends S extends Serial<infer U>
    ? U extends GetBasicCalloutData
      ? U
      : never
    : never
>(callout: S): T {
  return {
    ...callout,
    starts: toDate(callout.starts),
    expires: toDate(callout.expires),
  };
}

export async function fetchCallouts(
  query?: GetCalloutsQuery
): Promise<Paginated<GetBasicCalloutData>> {
  const { data } = await axios.get<Paginated<Serial<GetBasicCalloutData>>>(
    '/callout',
    {
      params: query,
    }
  );
  return {
    ...data,
    items: data.items.map(toCallout),
  };
}

export async function fetchCallout(id: string): Promise<GetMoreCalloutData> {
  const { data } = await axios.get<Serial<GetMoreCalloutData>>(
    '/callout/' + id
  );
  return toCallout(data);
}
