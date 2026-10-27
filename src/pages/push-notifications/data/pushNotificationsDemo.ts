import type { PushNotification } from '../types/pushNotification';

export const pushNotificationsDemo: PushNotification[] = [
  { id: 'PN-1004', title: 'Festival offer on personal loans', branch: 'All branches', audience: 'All customers', sentOn: '12 Oct, 11:00', status: 'Sent', message: 'Explore our festival offers on personal loans.' },
  { id: 'PN-1003', title: 'Branch closed on public holiday', branch: 'Main branch', audience: 'All customers', sentOn: '09 Oct, 17:30', status: 'Sent', message: 'Our branch will be closed on the public holiday.' },
  { id: 'PN-1002', title: 'Complete your MPIN setup', branch: 'All branches', audience: 'Customers with pending MPIN', sentOn: '08 Oct, 10:15', status: 'Sent', message: 'Complete your MPIN setup to use mobile banking.' },
  { id: 'PN-1001', title: 'New branch timings', branch: 'Branch 4', audience: 'All customers', sentOn: '15 Oct, 09:00', status: 'Scheduled', message: 'Please note the updated branch timings.' },
];
