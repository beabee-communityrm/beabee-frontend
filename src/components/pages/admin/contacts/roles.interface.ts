import { PermissionType } from '@beabee/beabee-common';

export interface EditableRole {
  role: PermissionType | '';
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}
