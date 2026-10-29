import { env } from '@/config/env';
import type { BranchUser, BranchUserInput, BranchUserQuery } from '@/types/branchUser';
import type { Paginated } from '@/types/common';
import { api } from './api/axiosInstance';
import { ENDPOINTS } from './api/endpoints';

export const branchUserService = {
  async list(query: BranchUserQuery): Promise<Paginated<BranchUser>> {
    if (import.meta.env.DEV && env.useMockApi) {
      const { mockListBranchUsers } = await import('./mock/mockBranchUsers');
      return mockListBranchUsers(query);
    }
    const { data } = await api.get<Paginated<BranchUser>>(ENDPOINTS.branchUsers.base, { params: query });
    return data;
  },
  async create(input: BranchUserInput): Promise<BranchUser> {
    if (import.meta.env.DEV && env.useMockApi) {
      const { mockCreateBranchUser } = await import('./mock/mockBranchUsers');
      return mockCreateBranchUser(input);
    }
    const { data } = await api.post<BranchUser>(ENDPOINTS.branchUsers.base, input);
    return data;
  },
  async update(id: string, input: BranchUserInput): Promise<BranchUser> {
    if (import.meta.env.DEV && env.useMockApi) {
      const { mockUpdateBranchUser } = await import('./mock/mockBranchUsers');
      return mockUpdateBranchUser(id, input);
    }
    const { data } = await api.put<BranchUser>(ENDPOINTS.branchUsers.byId(id), input);
    return data;
  },
  async authorize(id: string): Promise<void> {
    if (import.meta.env.DEV && env.useMockApi) {
      const { mockAuthorizeBranchUser } = await import('./mock/mockBranchUsers');
      return mockAuthorizeBranchUser(id);
    }
    await api.patch(ENDPOINTS.branchUsers.byId(id), { status: 'Operative', authorizationStatus: 'Authorized' });
  },
  async updateStatus(id: string, status: BranchUser['status']): Promise<void> {
    if (import.meta.env.DEV && env.useMockApi) {
      const { mockUpdateBranchUserStatus } = await import('./mock/mockBranchUsers');
      return mockUpdateBranchUserStatus(id, status);
    }
    await api.patch(ENDPOINTS.branchUsers.byId(id), { status });
  },
};
