import { api } from '@/services/api/axiosInstance';
import { ENDPOINTS } from '@/services/api/endpoints';
import type { BranchUser, BranchUserInput, BranchUserQuery } from '@/types/branchUser';
import type { Paginated } from '@/types/common';

/**
 * Real API layer for User Management.
 *
 * This service is intentionally separate from the existing branch-user.service.ts
 * so the current UI/demo behaviour is not changed before the real backend is available.
 * When the backend is ready, pages/redux thunks can use this service directly.
 */
export const userManagementService = {
  async list(query: BranchUserQuery): Promise<Paginated<BranchUser>> {
    const { data } = await api.get<Paginated<BranchUser>>(ENDPOINTS.userManagement.users, {
      params: query,
    });
    return data;
  },

  async getById(id: string): Promise<BranchUser> {
    const { data } = await api.get<BranchUser>(ENDPOINTS.userManagement.userById(id));
    return data;
  },

  async create(input: BranchUserInput): Promise<BranchUser> {
    const { data } = await api.post<BranchUser>(ENDPOINTS.userManagement.users, input);
    return data;
  },

  async update(id: string, input: BranchUserInput): Promise<BranchUser> {
    const { data } = await api.put<BranchUser>(ENDPOINTS.userManagement.userById(id), input);
    return data;
  },

  async authorize(id: string): Promise<void> {
    await api.patch(ENDPOINTS.userManagement.authorizeUser(id), {
      status: 'Operative',
      authorizationStatus: 'Authorized',
    });
  },

  async updateStatus(id: string, status: BranchUser['status']): Promise<void> {
    await api.patch(ENDPOINTS.userManagement.status(id), { status });
  },

  async assignPassword(id: string, password: string): Promise<void> {
    await api.post(ENDPOINTS.userManagement.assignPassword(id), { password });
  },
};
