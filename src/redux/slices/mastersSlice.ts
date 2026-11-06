import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getErrorMessage } from '@/services/api/apiError';
import { mastersService, type BankQuery } from '@/services/masters.service';
import type { Bank, BankForm } from '@/pages/banks-management/types/bank';
import type { Branch, BranchInput, BranchQuery } from '@/types/branch';
import type { Paginated } from '@/types/common';

type LoadState = 'idle' | 'loading' | 'succeeded' | 'failed';
interface Collection<T> { items: T[]; total: number; status: LoadState; error: string | null; }
export interface MastersState { banks: Collection<Bank>; branches: Collection<Branch>; }
const empty = <T,>(): Collection<T> => ({ items: [], total: 0, status: 'idle', error: null });
const initialState: MastersState = { banks: empty<Bank>(), branches: empty<Branch>() };
type Reject = { rejectValue: string };
const reject = (error: unknown, fallback: string, rejectWithValue: (value: string) => unknown) =>
  rejectWithValue(getErrorMessage(error, fallback));

export const fetchBanks = createAsyncThunk<Paginated<Bank>, BankQuery | undefined, Reject>('masters/fetchBanks', async (query, api) => {
  try { return await mastersService.listBanks(query); } catch (e) { return api.rejectWithValue(getErrorMessage(e, 'Unable to load banks.')); }
});
export const createBank = createAsyncThunk<Bank, BankForm, Reject>('masters/createBank', async (input, api) => {
  try { return await mastersService.createBank(input); } catch (e) { return api.rejectWithValue(getErrorMessage(e, 'Unable to create bank.')); }
});
export const updateBank = createAsyncThunk<Bank, { id: string; input: BankForm }, Reject>('masters/updateBank', async ({ id, input }, api) => {
  try { return await mastersService.updateBank(id, input); } catch (e) { return api.rejectWithValue(getErrorMessage(e, 'Unable to update bank.')); }
});
export const deleteBank = createAsyncThunk<string, string, Reject>('masters/deleteBank', async (id, api) => {
  try { await mastersService.deleteBank(id); return id; } catch (e) { return api.rejectWithValue(getErrorMessage(e, 'Unable to delete bank.')); }
});
export const fetchBranches = createAsyncThunk<Paginated<Branch>, BranchQuery, Reject>('masters/fetchBranches', async (query, api) => {
  try { return await mastersService.listBranches(query); } catch (e) { return api.rejectWithValue(getErrorMessage(e, 'Unable to load branches.')); }
});
export const createBranch = createAsyncThunk<Branch, BranchInput, Reject>('masters/createBranch', async (input, api) => {
  try { return await mastersService.createBranch(input); } catch (e) { return api.rejectWithValue(getErrorMessage(e, 'Unable to create branch.')); }
});
export const updateBranch = createAsyncThunk<Branch, { id: string; input: BranchInput }, Reject>('masters/updateBranch', async ({ id, input }, api) => {
  try { return await mastersService.updateBranch(id, input); } catch (e) { return api.rejectWithValue(getErrorMessage(e, 'Unable to update branch.')); }
});
export const deleteBranch = createAsyncThunk<string, string, Reject>('masters/deleteBranch', async (id, api) => {
  try { await mastersService.deleteBranch(id); return id; } catch (e) { return api.rejectWithValue(getErrorMessage(e, 'Unable to delete branch.')); }
});

const mastersSlice = createSlice({
  name: 'masters', initialState, reducers: {
    clearMastersError(state) { state.banks.error = null; state.branches.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanks.pending, s => { s.banks.status = 'loading'; s.banks.error = null; })
      .addCase(fetchBanks.fulfilled, (s, a) => { s.banks.items = a.payload.items; s.banks.total = a.payload.total; s.banks.status = 'succeeded'; })
      .addCase(fetchBanks.rejected, (s, a) => { s.banks.status = 'failed'; s.banks.error = a.payload ?? 'Unable to load banks.'; })
      .addCase(createBank.fulfilled, (s, a) => { s.banks.items.unshift(a.payload); s.banks.total += 1; })
      .addCase(updateBank.fulfilled, (s, a) => { s.banks.items = s.banks.items.map(x => x.id === a.payload.id ? a.payload : x); })
      .addCase(deleteBank.fulfilled, (s, a) => { s.banks.items = s.banks.items.filter(x => x.id !== a.payload); s.banks.total = Math.max(0, s.banks.total - 1); })
      .addCase(fetchBranches.pending, s => { s.branches.status = 'loading'; s.branches.error = null; })
      .addCase(fetchBranches.fulfilled, (s, a) => { s.branches.items = a.payload.items; s.branches.total = a.payload.total; s.branches.status = 'succeeded'; })
      .addCase(fetchBranches.rejected, (s, a) => { s.branches.status = 'failed'; s.branches.error = a.payload ?? 'Unable to load branches.'; })
      .addCase(createBranch.fulfilled, (s, a) => { s.branches.items.unshift(a.payload); s.branches.total += 1; })
      .addCase(updateBranch.fulfilled, (s, a) => { s.branches.items = s.branches.items.map(x => x.id === a.payload.id ? a.payload : x); })
      .addCase(deleteBranch.fulfilled, (s, a) => { s.branches.items = s.branches.items.filter(x => x.id !== a.payload); s.branches.total = Math.max(0, s.branches.total - 1); });
  },
});
export const { clearMastersError } = mastersSlice.actions;
export default mastersSlice.reducer;
