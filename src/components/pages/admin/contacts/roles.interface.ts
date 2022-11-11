import { PermissionType } from '../../../../utils/api/api.interface';

export interface EditableRole {
  role: PermissionType | '';
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}
