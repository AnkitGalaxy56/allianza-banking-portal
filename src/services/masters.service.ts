import type { Bank, BankForm } from '@/pages/banks-management/types/bank';
import type { Branch, BranchInput, BranchQuery } from '@/types/branch';
import type { Paginated } from '@/types/common';
import { api } from './api/axiosInstance';
import { ENDPOINTS } from './api/endpoints';

export interface BankQuery { page?: number; pageSize?: number; search?: string; }
export const mastersService = {
  async listBanks(query: BankQuery = {}): Promise<Paginated<Bank>> {
    const { data } = await api.get<Paginated<Bank>>(ENDPOINTS.banks.base, { params: query });
    return data;
  },
  async getBank(id: string): Promise<Bank> {
    const { data } = await api.get<Bank>(ENDPOINTS.banks.byId(id)); return data;
  },
  async createBank(input: BankForm): Promise<Bank> {
    const { data } = await api.post<Bank>(ENDPOINTS.banks.base, input); return data;
  },
  async updateBank(id: string, input: BankForm): Promise<Bank> {
    const { data } = await api.put<Bank>(ENDPOINTS.banks.byId(id), input); return data;
  },
  async deleteBank(id: string): Promise<void> { await api.delete(ENDPOINTS.banks.byId(id)); },
  async listBranches(query: BranchQuery): Promise<Paginated<Branch>> {
    const { data } = await api.get<Paginated<Branch>>(ENDPOINTS.branches.base, { params: query }); return data;
  },
  async getBranch(id: string): Promise<Branch> {
    const { data } = await api.get<Branch>(ENDPOINTS.branches.byId(id)); return data;
  },
  async createBranch(input: BranchInput): Promise<Branch> {
    const { data } = await api.post<Branch>(ENDPOINTS.branches.base, input); return data;
  },
  async updateBranch(id: string, input: BranchInput): Promise<Branch> {
    const { data } = await api.put<Branch>(ENDPOINTS.branches.byId(id), input); return data;
  },
  async deleteBranch(id: string): Promise<void> { await api.delete(ENDPOINTS.branches.byId(id)); },
};
