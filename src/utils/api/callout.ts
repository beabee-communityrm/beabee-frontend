import { parseISO } from 'date-fns';
import axios from '../../axios';
import { BasicCalloutData, Serial } from './api.interface';

// TODO: dedupe from member
function toDate(s: string): Date;
function toDate(s: string | undefined): Date | undefined;
function toDate(s: string | undefined): Date | undefined {
  return s ? parseISO(s) : undefined;
}

export async function fetchCallouts(): Promise<BasicCalloutData[]> {
  const { data } = await axios.get<Serial<BasicCalloutData>[]>('/callout', {
    params: { status: 'open' },
  });
  return data.map((callout) => ({
    ...callout,
    starts: toDate(callout.starts),
    expires: toDate(callout.expires),
  }));
}
