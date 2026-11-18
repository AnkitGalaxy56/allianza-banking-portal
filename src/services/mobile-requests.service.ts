import { api } from './api/axiosInstance';
export type MobileModule = 'kyc'|'nomination'|'positive-pay';
const base='/mobile-requests';
export const mobileRequestsService={
 async list(module:MobileModule){const {data}=await api.get<any[]>(`${base}/${module}`);return data;},
 async detail(module:MobileModule,id:string|number){const {data}=await api.get(`${base}/${module}/${id}`);return data;},
 async verify(module:MobileModule,id:string|number){const {data}=await api.patch(`${base}/${module}/${id}/verify`,{});return data;},
 async reject(module:MobileModule,id:string|number,reason='Rejected during review'){const {data}=await api.patch(`${base}/${module}/${id}/reject`,{reason});return data;},
};
export type MobileRequestStatus = 'Pending Review' | 'Approved' | 'Rejected';
const mobileStatusMap: Record<string, MobileRequestStatus> = { PENDING: 'Pending Review', IN_PROGRESS: 'Pending Review', UPLOADED: 'Pending Review', APPROVED: 'Approved', REJECTED: 'Rejected', COMPLETED: 'Approved' };
export const mobileStatus = (s: string): MobileRequestStatus => mobileStatusMap[String(s || '').toUpperCase()] ?? 'Pending Review';
