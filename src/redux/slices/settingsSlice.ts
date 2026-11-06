import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { AccessRole } from '@/pages/settings/roles-access-control/types/role';
import { settingsService } from '@/services/settings.service';
import type { RootState } from '../store';

type SettingsState = {
  roles: AccessRole[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: SettingsState = { roles: [], status: 'idle', error: null };
const message = (error: unknown) => error instanceof Error ? error.message : 'Settings request failed.';

export const fetchRoles = createAsyncThunk<AccessRole[]>(
  'settings/fetchRoles',
  async (_, thunkAPI) => {
    try { return await settingsService.listRoles(); }
    catch (error) { return thunkAPI.rejectWithValue(message(error)); }
  },
);

export const createRole = createAsyncThunk<AccessRole, AccessRole>(
  'settings/createRole',
  async (role, thunkAPI) => {
    try { return await settingsService.createRole(role); }
    catch (error) { return thunkAPI.rejectWithValue(message(error)); }
  },
);

export const updateRole = createAsyncThunk<AccessRole, { id: string; role: AccessRole }>(
  'settings/updateRole',
  async ({ id, role }, thunkAPI) => {
    try { return await settingsService.updateRole(id, role); }
    catch (error) { return thunkAPI.rejectWithValue(message(error)); }
  },
);

export const deleteRole = createAsyncThunk<string, string>(
  'settings/deleteRole',
  async (id, thunkAPI) => {
    try { await settingsService.deleteRole(id); return id; }
    catch (error) { return thunkAPI.rejectWithValue(message(error)); }
  },
);

const slice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchRoles.fulfilled, (state, action) => { state.status = 'succeeded'; state.roles = action.payload; })
      .addCase(fetchRoles.rejected, (state, action) => { state.status = 'failed'; state.error = String(action.payload ?? action.error.message ?? 'Unable to load roles.'); })
      .addCase(createRole.fulfilled, (state, action) => { state.roles = [action.payload, ...state.roles]; })
      .addCase(createRole.rejected, (state, action) => { state.error = String(action.payload ?? action.error.message ?? 'Unable to create role.'); })
      .addCase(updateRole.fulfilled, (state, action) => { state.roles = state.roles.map((role) => role.id === action.payload.id ? action.payload : role); })
      .addCase(updateRole.rejected, (state, action) => { state.error = String(action.payload ?? action.error.message ?? 'Unable to update role.'); })
      .addCase(deleteRole.fulfilled, (state, action) => { state.roles = state.roles.filter((role) => role.id !== action.payload); })
      .addCase(deleteRole.rejected, (state, action) => { state.error = String(action.payload ?? action.error.message ?? 'Unable to delete role.'); });
  },
});

export const { clearError } = slice.actions;
export const selectSettings = (state: RootState) => state.settings;
export default slice.reducer;
