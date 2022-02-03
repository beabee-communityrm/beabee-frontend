import { parseISO } from 'date-fns';
import axios from '../../axios';
import { GetNoticeData, Serial } from './api.interface';

// TODO: dedupe from member
function toDate(s: string): Date;
function toDate(s: string | undefined): Date | undefined;
function toDate(s: string | undefined): Date | undefined {
  return s ? parseISO(s) : undefined;
}

export async function fetchNotices(): Promise<GetNoticeData[]> {
  const { data } = await axios.get<Serial<GetNoticeData>[]>('/notice', {
    params: { status: 'open' },
  });

  return data.map((notice) => ({
    ...notice,
    createdAt: toDate(notice.createdAt),
    updatedAt: toDate(notice.updatedAt),
    expires: toDate(notice.expires),
  }));
}
