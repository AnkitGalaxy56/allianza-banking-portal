import type { RequestStatus } from './type';
export const REQUEST_STATUS_OPTIONS = ['All','Pending Review','Approved','Rejected'] as const;
export const statusColor=(s:RequestStatus)=>s==='Approved'?'success':s==='Rejected'?'error':'warning';
export const NOMINATION_FIELDS = ['Nominee Name','Relationship','Date of Birth','Nominee Mobile','Nominee Email'] as const;
