import type { RequestReportRow } from '../types/requestsReport';

export const requestReportRows: RequestReportRow[] = [
  { id: '1', requestId: 'REQ-2026-1048', requestType: 'RTGS / NEFT / IMPS', customerName: 'Amit Sharma', customerNo: 'CUST-10024', branch: 'Main branch', submittedOn: '2026-10-28', processedOn: '2026-10-28', status: 'Completed', processedBy: 'Rahul Patil' },
  { id: '2', requestId: 'REQ-2026-1047', requestType: 'FD Opening', customerName: 'Priya Deshmukh', customerNo: 'CUST-10031', branch: 'Branch 2', submittedOn: '2026-10-28', processedOn: '', status: 'Pending', processedBy: '—' },
  { id: '3', requestId: 'REQ-2026-1046', requestType: 'Stop Payment', customerName: 'Suresh Jadhav', customerNo: 'CUST-10018', branch: 'Branch 4', submittedOn: '2026-10-27', processedOn: '2026-10-27', status: 'Completed', processedBy: 'Neha Kulkarni' },
  { id: '4', requestId: 'REQ-2026-1045', requestType: 'Cheque Book', customerName: 'Meena Pawar', customerNo: 'CUST-10042', branch: 'Main branch', submittedOn: '2026-10-26', processedOn: '2026-10-27', status: 'Failed', processedBy: 'Rahul Patil' },
  { id: '5', requestId: 'REQ-2026-1044', requestType: 'Locker Application', customerName: 'Vikram More', customerNo: 'CUST-10057', branch: 'Branch 7', submittedOn: '2026-10-25', processedOn: '', status: 'Pending', processedBy: '—' },
  { id: '6', requestId: 'REQ-2026-1043', requestType: 'Standing Instructions', customerName: 'Anita Shinde', customerNo: 'CUST-10063', branch: 'Branch 2', submittedOn: '2026-10-24', processedOn: '2026-10-25', status: 'Completed', processedBy: 'Aakash Joshi' },
];
