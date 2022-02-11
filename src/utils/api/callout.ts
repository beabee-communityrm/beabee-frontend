import { parseISO } from 'date-fns';
import axios from '../../axios';
import {
  GetBasicCalloutData,
  GetCalloutsQuery,
  Paginated,
  Serial,
} from './api.interface';

// TODO: dedupe from member
function toDate(s: string): Date;
function toDate(s: string | undefined): Date | undefined;
function toDate(s: string | undefined): Date | undefined {
  return s ? parseISO(s) : undefined;
}

export function toCallout(
  data: Serial<GetBasicCalloutData>
): GetBasicCalloutData {
  return {
    ...data,
    starts: toDate(data.starts),
    expires: toDate(data.expires),
  };
}

export async function fetchCallouts(
  query?: GetCalloutsQuery
): Promise<Paginated<GetBasicCalloutData>> {
  const { data } = await axios.get('/callout', {
    params: query,
  });

  return {
    ...data,
    items: data.items.map(toCallout),
  };
}
