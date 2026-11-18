import type { RequestStatus } from './type';
export const REQUEST_STATUS_OPTIONS = ['All','Pending Review','Approved','Rejected'] as const;
export const statusColor=(s:RequestStatus)=>s==='Approved'?'success':s==='Rejected'?'error':'warning';
export const KYC_DOCUMENT_FIELDS = ['Aadhaar Front','Aadhaar Back','Selfie with ID','Address Proof'] as const;
