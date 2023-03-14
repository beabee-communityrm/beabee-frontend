import { Paginated } from '@beabee/beabee-common';
import { deserializeDate } from '.';

import axios from '../../lib/axios';
import {
  CreateNoticeData,
  GetNoticeData,
  GetNoticesQuery,
  Serial,
} from './api.interface';

function deserializeNotice(notice: Serial<GetNoticeData>): GetNoticeData {
  return {
    ...notice,
    createdAt: deserializeDate(notice.createdAt),
    updatedAt: deserializeDate(notice.updatedAt),
    starts: deserializeDate(notice.starts),
    expires: deserializeDate(notice.expires),
  };
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
      createdAt: deserializeDate(notice.createdAt),
      updatedAt: deserializeDate(notice.updatedAt),
      starts: deserializeDate(notice.starts),
      expires: deserializeDate(notice.expires),
    })),
  };
}

export async function fetchNotice(id: string): Promise<GetNoticeData> {
  const { data } = await axios.get<Serial<GetNoticeData>>('/notice/' + id);
  return deserializeNotice(data);
}

export async function createNotice(
  dataIn: CreateNoticeData
): Promise<GetNoticeData> {
  const { data } = await axios.post<Serial<GetNoticeData>>('/notice', dataIn);
  return deserializeNotice(data);
}

export async function deleteNotice(id: string): Promise<void> {
  await axios.delete('/notice/' + id);
}

export async function updateNotice(
  id: string,
  noticeData: CreateNoticeData
): Promise<GetNoticeData> {
  const { data } = await axios.patch<Serial<GetNoticeData>>(
    '/notice/' + id,
    noticeData
  );
  return deserializeNotice(data);
}
