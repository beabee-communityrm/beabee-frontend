import { parseISO } from 'date-fns';
import axios from '../../axios';
import {
  GetNoticeData,
  GetNoticesQuery,
  Paginated,
  Serial,
} from './api.interface';

// TODO: dedupe from member
function toDate(s: string): Date;
function toDate(s: string | undefined): Date | undefined;
function toDate(s: string | undefined): Date | undefined {
  return s ? parseISO(s) : undefined;
}

export async function fetchNotices(
  query?: GetNoticesQuery
): Promise<Paginated<GetNoticeData>> {
  const { data } = await axios.get<Paginated<Serial<GetNoticeData>>>(
    '/notice',
    {
      params: query,
    }
  );

  return {
    ...data,
    items: data.items.map((notice) => ({
      ...notice,
      createdAt: toDate(notice.createdAt),
      updatedAt: toDate(notice.updatedAt),
      starts: toDate(notice.starts),
      expires: toDate(notice.expires),
    })),
  };
}
