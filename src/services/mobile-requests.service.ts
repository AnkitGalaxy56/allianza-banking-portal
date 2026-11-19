import { api } from './api/axiosInstance';

export type MobileModule = 'kyc' | 'nomination' | 'positive-pay';
const base = '/mobile-requests';

const normalizeModule = (module: MobileModule) => module.trim().replace(/^\/+|\/+$/g, '');

export const mobileRequestsService = {
  async list(module: MobileModule) {
    const normalized = normalizeModule(module);
    const { data } = await api.get<any[]>(`${base}/${normalized}`);
    return data;
  },

  async detail(module: MobileModule, id: string | number) {
    const normalized = normalizeModule(module);
    const { data } = await api.get(`${base}/${normalized}/${encodeURIComponent(String(id))}`);
    return data;
  },

  async verify(module: MobileModule, id: string | number) {
    const normalized = normalizeModule(module);
    const { data } = await api.patch(`${base}/${normalized}/${encodeURIComponent(String(id))}/verify`, {});
    return data;
  },

  async reject(module: MobileModule, id: string | number, reason = 'Rejected during review') {
    const normalized = normalizeModule(module);
    const { data } = await api.patch(`${base}/${normalized}/${encodeURIComponent(String(id))}/reject`, { reason });
    return data;
  },
};

export type MobileRequestStatus = 'Pending Review' | 'Approved' | 'Rejected';
const mobileStatusMap: Record<string, MobileRequestStatus> = {
  PENDING: 'Pending Review',
  PENDING_REVIEW: 'Pending Review',
  'PENDING REVIEW': 'Pending Review',
  IN_PROGRESS: 'Pending Review',
  SUBMITTED: 'Pending Review',
  UPLOADED: 'Pending Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  COMPLETED: 'Approved',
};

export const mobileStatus = (s: string): MobileRequestStatus =>
  mobileStatusMap[String(s || '').trim().toUpperCase()] ?? 'Pending Review';
