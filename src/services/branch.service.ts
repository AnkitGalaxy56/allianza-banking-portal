import { env } from '@/config/env';
import type { Branch, BranchInput, BranchQuery } from '@/types/branch';
import type { Paginated } from '@/types/common';
import { api } from './api/axiosInstance';
import { ENDPOINTS } from './api/endpoints';

export const branchService = {
  async list(query: BranchQuery): Promise<Paginated<Branch>> {
    if (env.useMockApi) {
      const { mockListBranches } = await import('./mock/mockBranches');
      return mockListBranches(query);
    }
    const { data } = await api.get<Paginated<Branch>>(ENDPOINTS.branches.base, {
      params: {
        page: query.page,
        pageSize: query.pageSize,
        search: query.search || undefined,
        status: query.status && query.status !== 'all' ? query.status : undefined,
      },
    });
    return data;
  },

  async create(input: BranchInput): Promise<Branch> {
    if (env.useMockApi) {
      const { mockCreateBranch } = await import('./mock/mockBranches');
      return mockCreateBranch(input);
    }
    const { data } = await api.post<Branch>(ENDPOINTS.branches.base, input);
    return data;
  },

  async update(id: string, input: BranchInput): Promise<Branch> {
    if (env.useMockApi) {
      const { mockUpdateBranch } = await import('./mock/mockBranches');
      return mockUpdateBranch(id, input);
    }
    const { data } = await api.put<Branch>(ENDPOINTS.branches.byId(id), input);
    return data;
  },
};
