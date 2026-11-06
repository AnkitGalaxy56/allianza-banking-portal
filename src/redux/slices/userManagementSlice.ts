import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { BranchUser, BranchUserInput, BranchUserQuery } from '@/types/branchUser';
import type { Paginated } from '@/types/common';
import { userManagementService } from '@/services/user-management.service';
import type { RootState } from '../store';

type UserManagementState = {
  data: Paginated<BranchUser> | null;
  selectedUser: BranchUser | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: UserManagementState = {
  data: null,
  selectedUser: null,
  status: 'idle',
  error: null,
};

const message = (error: unknown) => error instanceof Error ? error.message : 'User Management request failed.';

export const fetchUsers = createAsyncThunk<Paginated<BranchUser>, BranchUserQuery>(
  'userManagement/fetchUsers',
  async (query, thunkAPI) => {
    try { return await userManagementService.list(query); }
    catch (error) { return thunkAPI.rejectWithValue(message(error)); }
  },
);

export const createUser = createAsyncThunk<BranchUser, BranchUserInput>(
  'userManagement/createUser',
  async (input, thunkAPI) => {
    try { return await userManagementService.create(input); }
    catch (error) { return thunkAPI.rejectWithValue(message(error)); }
  },
);

export const updateUser = createAsyncThunk<BranchUser, { id: string; input: BranchUserInput }>(
  'userManagement/updateUser',
  async ({ id, input }, thunkAPI) => {
    try { return await userManagementService.update(id, input); }
    catch (error) { return thunkAPI.rejectWithValue(message(error)); }
  },
);

export const authorizeUser = createAsyncThunk<void, string>(
  'userManagement/authorizeUser',
  async (id, thunkAPI) => {
    try { await userManagementService.authorize(id); }
    catch (error) { return thunkAPI.rejectWithValue(message(error)); }
  },
);

export const assignUserPassword = createAsyncThunk<void, { id: string; password: string }>(
  'userManagement/assignUserPassword',
  async ({ id, password }, thunkAPI) => {
    try { await userManagementService.assignPassword(id, password); }
    catch (error) { return thunkAPI.rejectWithValue(message(error)); }
  },
);

const slice = createSlice({
  name: 'userManagement',
  initialState,
  reducers: {
    selectUser: (state, action: PayloadAction<BranchUser | null>) => { state.selectedUser = action.payload; },
    clearError: (state) => { state.error = null; },
    clearData: (state) => { state.data = null; state.selectedUser = null; state.status = 'idle'; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchUsers.fulfilled, (state, action) => { state.status = 'succeeded'; state.data = action.payload; })
      .addCase(fetchUsers.rejected, (state, action) => { state.status = 'failed'; state.error = String(action.payload ?? action.error.message ?? 'Unable to load users.'); })
      .addCase(createUser.rejected, (state, action) => { state.error = String(action.payload ?? action.error.message ?? 'Unable to create user.'); })
      .addCase(updateUser.rejected, (state, action) => { state.error = String(action.payload ?? action.error.message ?? 'Unable to update user.'); })
      .addCase(authorizeUser.rejected, (state, action) => { state.error = String(action.payload ?? action.error.message ?? 'Unable to authorize user.'); })
      .addCase(assignUserPassword.rejected, (state, action) => { state.error = String(action.payload ?? action.error.message ?? 'Unable to assign password.'); });
  },
});

export const { selectUser, clearError, clearData } = slice.actions;
export const selectUserManagement = (state: RootState) => state.userManagement;
export default slice.reducer;
