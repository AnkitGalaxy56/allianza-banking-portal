export interface NotificationReportRow {
  id: string;
  notificationId: string;
  title: string;
  audience: string;
  channel: 'Push' | 'SMS' | 'Email';
  sentOn: string;
  recipients: number;
  delivered: number;
  status: 'Delivered' | 'Partially Delivered' | 'Failed';
}

export interface NotificationReportFilterState {
  search: string;
  branch: string;
  status: string;
  fromDate: string;
  toDate: string;
}
