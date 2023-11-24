import { ItemStatus } from '@beabee/beabee-common';
import { NoticeData } from '@type';

export interface GetNoticeData extends NoticeData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: ItemStatus;
}
