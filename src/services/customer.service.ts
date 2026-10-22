import { env } from '@/config/env';
import type { Customer, CustomerQuery, CustomerStatus } from '@/types/customer';
import type { Paginated } from '@/types/common';
import { api } from './api/axiosInstance';
import { ENDPOINTS } from './api/endpoints';

export const customerService = {
  async list(query: CustomerQuery): Promise<Paginated<Customer>> {
    if (import.meta.env.DEV && env.useMockApi) {
      const { mockListCustomers } = await import('./mock/mockCustomers');
      return mockListCustomers(query);
    }
    const { data } = await api.get<Paginated<Customer>>(ENDPOINTS.customers.base, { params: query });
    return data;
  },
  async updateStatus(id: string, status: CustomerStatus): Promise<void> {
    if (import.meta.env.DEV && env.useMockApi) {
      const { mockUpdateCustomerStatus } = await import('./mock/mockCustomers');
      return mockUpdateCustomerStatus(id, status);
    }
    await api.patch(ENDPOINTS.customers.byId(id), { status });
  },
  async resetDevice(id: string): Promise<void> {
    if (import.meta.env.DEV && env.useMockApi) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      return;
    }
    await api.post(ENDPOINTS.customers.resetDevice(id));
  },
};
