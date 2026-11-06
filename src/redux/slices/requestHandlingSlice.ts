import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getErrorMessage } from '@/services/api/apiError';
import { requestHandlingService, type RequestHandlingList, type RequestHandlingModule, type RequestHandlingQuery, type RequestHandlingRecord } from '@/services/request-handling.service';

interface ModuleState {
  records: RequestHandlingRecord[];
  total: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
export interface RequestHandlingState { modules: Partial<Record<RequestHandlingModule, ModuleState>> }
const emptyModule = (): ModuleState => ({ records: [], total: 0, status: 'idle', error: null });
const initialState: RequestHandlingState = { modules: {} };
const ensureModule = (state: RequestHandlingState, module: RequestHandlingModule) => (state.modules[module] ??= emptyModule());
type Reject = { rejectValue: string };

export const fetchRequests = createAsyncThunk<{ module: RequestHandlingModule; result: RequestHandlingList | RequestHandlingRecord[] }, { module: RequestHandlingModule; query?: RequestHandlingQuery }, Reject>(
  'requestHandling/fetch', async ({ module, query }, { rejectWithValue }) => {
    try { return { module, result: await requestHandlingService.list(module, query) }; }
    catch (error) { return rejectWithValue(getErrorMessage(error, 'Unable to load requests.')); }
  },
);
export const createRequest = createAsyncThunk<{ module: RequestHandlingModule; record: RequestHandlingRecord }, { module: RequestHandlingModule; payload: Partial<RequestHandlingRecord> }, Reject>(
  'requestHandling/create', async ({ module, payload }, { rejectWithValue }) => {
    try { return { module, record: await requestHandlingService.create(module, payload) }; }
    catch (error) { return rejectWithValue(getErrorMessage(error, 'Unable to create request.')); }
  },
);
export const updateRequest = createAsyncThunk<{ module: RequestHandlingModule; record: RequestHandlingRecord }, { module: RequestHandlingModule; id: string; payload: Partial<RequestHandlingRecord> }, Reject>(
  'requestHandling/update', async ({ module, id, payload }, { rejectWithValue }) => {
    try { return { module, record: await requestHandlingService.update(module, id, payload) }; }
    catch (error) { return rejectWithValue(getErrorMessage(error, 'Unable to update request.')); }
  },
);
export const decideRequest = createAsyncThunk<{ module: RequestHandlingModule; record: RequestHandlingRecord }, { module: RequestHandlingModule; id: string; status: string; remarks?: string }, Reject>(
  'requestHandling/decide', async ({ module, id, status, remarks }, { rejectWithValue }) => {
    try { return { module, record: await requestHandlingService.decide(module, id, status, remarks) }; }
    catch (error) { return rejectWithValue(getErrorMessage(error, 'Unable to update request status.')); }
  },
);
export const deleteRequest = createAsyncThunk<{ module: RequestHandlingModule; id: string }, { module: RequestHandlingModule; id: string }, Reject>(
  'requestHandling/delete', async ({ module, id }, { rejectWithValue }) => {
    try { await requestHandlingService.remove(module, id); return { module, id }; }
    catch (error) { return rejectWithValue(getErrorMessage(error, 'Unable to delete request.')); }
  },
);

const requestHandlingSlice = createSlice({
  name: 'requestHandling', initialState, reducers: { clearRequestHandlingError(state, action: { payload: RequestHandlingModule }) { ensureModule(state, action.payload).error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequests.pending, (state, action) => { const m = ensureModule(state, action.meta.arg.module); m.status = 'loading'; m.error = null; })
      .addCase(fetchRequests.fulfilled, (state, action) => { const m = ensureModule(state, action.payload.module); const result = action.payload.result; m.records = Array.isArray(result) ? result as RequestHandlingRecord[] : result.items as RequestHandlingRecord[]; m.total = Array.isArray(result) ? result.length : result.total ?? result.items.length; m.status = 'succeeded'; })
      .addCase(fetchRequests.rejected, (state, action) => { const m = ensureModule(state, action.meta.arg.module); m.status = 'failed'; m.error = action.payload ?? 'Unable to load requests.'; })
      .addCase(createRequest.fulfilled, (state, action) => { const m = ensureModule(state, action.payload.module); m.records = [action.payload.record, ...m.records]; m.total += 1; })
      .addCase(updateRequest.fulfilled, (state, action) => { const m = ensureModule(state, action.payload.module); m.records = m.records.map((r) => r.id === action.payload.record.id ? action.payload.record : r); })
      .addCase(decideRequest.fulfilled, (state, action) => { const m = ensureModule(state, action.payload.module); m.records = m.records.map((r) => r.id === action.payload.record.id ? action.payload.record : r); })
      .addCase(deleteRequest.fulfilled, (state, action) => { const m = ensureModule(state, action.payload.module); m.records = m.records.filter((r) => r.id !== action.payload.id); m.total = Math.max(0, m.total - 1); });
  },
});
export const { clearRequestHandlingError } = requestHandlingSlice.actions;
export const selectRequestHandlingModule = (state: { requestHandling: RequestHandlingState }, module: RequestHandlingModule) => state.requestHandling.modules[module] ?? emptyModule();
export default requestHandlingSlice.reducer;
