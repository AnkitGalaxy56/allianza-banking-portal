import { api } from './api/axiosInstance';
import { ENDPOINTS } from './api/endpoints';

/** Shared request shape used by Request Handling modules. Module-specific fields stay flexible. */
export interface RequestHandlingRecord {
  id: string;
  status: string;
  submittedOn?: string;
  fields: Record<string, unknown>;
  [key: string]: unknown;
}

export interface RequestHandlingQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  [key: string]: unknown;
}

export interface RequestHandlingList<T = RequestHandlingRecord> {
  items: T[];
  total?: number;
  page?: number;
  pageSize?: number;
}

export type RequestHandlingModule =
  | 'cheque-book' | 'closing-accounts' | 'fd-opening' | 'fresh-loan-application'
  | 'lead-management' | 'loan-emi-payment' | 'locker-application' | 'opening-accounts'
  | 'payments' | 'rd-opening' | 'rtgs-neft-imps' | 'standing-instructions' | 'stop-payment'
  | 'validation/closing-accounts' | 'validation/lead-management' | 'validation/opening-accounts'
  | 'validation/payments' | 'validation/standing-instructions' | 'validation/stop-payment';

const modulePath = (module: RequestHandlingModule) => module;

export const requestHandlingService = {
  async list<T = RequestHandlingRecord>(module: RequestHandlingModule, query: RequestHandlingQuery = {}): Promise<RequestHandlingList<T> | T[]> {
    const { data } = await api.get<RequestHandlingList<T> | T[]>(ENDPOINTS.requestHandling.base(modulePath(module)), { params: query });
    return data;
  },
  async get<T = RequestHandlingRecord>(module: RequestHandlingModule, id: string): Promise<T> {
    const { data } = await api.get<T>(ENDPOINTS.requestHandling.byId(modulePath(module), id));
    return data;
  },
  async create<T = RequestHandlingRecord>(module: RequestHandlingModule, payload: Partial<T>): Promise<T> {
    const { data } = await api.post<T>(ENDPOINTS.requestHandling.base(modulePath(module)), payload);
    return data;
  },
  async update<T = RequestHandlingRecord>(module: RequestHandlingModule, id: string, payload: Partial<T>): Promise<T> {
    const { data } = await api.put<T>(ENDPOINTS.requestHandling.byId(modulePath(module), id), payload);
    return data;
  },
  async decide<T = RequestHandlingRecord>(module: RequestHandlingModule, id: string, status: string, remarks?: string): Promise<T> {
    const { data } = await api.patch<T>(ENDPOINTS.requestHandling.decision(modulePath(module), id), { status, remarks });
    return data;
  },
  async remove(module: RequestHandlingModule, id: string): Promise<void> {
    await api.delete(ENDPOINTS.requestHandling.remove(modulePath(module), id));
  },
};
