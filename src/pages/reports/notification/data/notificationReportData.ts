import type { NotificationReportRow } from '../types/notificationReport';

export const notificationReportRows: NotificationReportRow[] = [
  { id: '1', notificationId: 'NTF-2026-0312', title: 'Scheduled maintenance notice', audience: 'All Mobile Users', channel: 'Push', sentOn: '2026-10-30', recipients: 1250, delivered: 1238, status: 'Delivered' },
  { id: '2', notificationId: 'NTF-2026-0311', title: 'FD maturity reminder', audience: 'FD Customers', channel: 'SMS', sentOn: '2026-10-29', recipients: 184, delivered: 176, status: 'Partially Delivered' },
  { id: '3', notificationId: 'NTF-2026-0310', title: 'New mobile banking features', audience: 'All Mobile Users', channel: 'Push', sentOn: '2026-10-28', recipients: 1250, delivered: 1250, status: 'Delivered' },
  { id: '4', notificationId: 'NTF-2026-0309', title: 'KYC update reminder', audience: 'KYC Due Customers', channel: 'SMS', sentOn: '2026-10-27', recipients: 96, delivered: 0, status: 'Failed' },
  { id: '5', notificationId: 'NTF-2026-0308', title: 'Monthly account statement', audience: 'Eligible Account Holders', channel: 'Email', sentOn: '2026-10-25', recipients: 720, delivered: 714, status: 'Partially Delivered' },
];
