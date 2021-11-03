export interface Notification {
  id?: number;
  title: string;
  type: NotificationType;
  text?: string;
  duration?: number;
}

export enum NotificationType {
  Error = 'danger',
  Success = 'success',
}
