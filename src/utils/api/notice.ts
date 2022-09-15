import { deserializeDate } from '.';
import axios from '../../axios';
import {
  GetNoticeData,
  GetNoticesQuery,
  Paginated,
  Serial,
} from './api.interface';

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
      createdAt: deserializeDate(notice.createdAt),
      updatedAt: deserializeDate(notice.updatedAt),
      starts: deserializeDate(notice.starts),
      expires: deserializeDate(notice.expires),
    })),
  };
}
