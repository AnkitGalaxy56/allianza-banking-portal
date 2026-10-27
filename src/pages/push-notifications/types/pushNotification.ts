export type NotificationStatus = 'Sent' | 'Scheduled' | 'Draft';
export interface PushNotification {
  id: string;
  title: string;
  branch: string;
  audience: string;
  sentOn: string;
  status: NotificationStatus;
  message: string;
}
