import type { RequestStatus } from './type';
export const REQUEST_STATUS_OPTIONS = ['All','Pending Review','Approved','Rejected'] as const;
export const statusColor=(s:RequestStatus)=>s==='Approved'?'success':s==='Rejected'?'error':'warning';
export const POSITIVE_PAY_FIELDS = ['Account No.','Cheque No.','Cheque Date','Cheque Amount','Payee Name','Remarks'] as const;
export const formatINR=(n:number)=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n);
