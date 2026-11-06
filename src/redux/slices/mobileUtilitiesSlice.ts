import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getErrorMessage } from '@/services/api/apiError';
import {
  mobileUtilitiesService, type DeviceLookupInput, type DeviceLookupResult, type DeviceResetInput,
  type MobileImage, type MobileImageInput, type MobileUtilityQuery, type NotificationInput,
} from '@/services/mobile-utilities.service';
import type { PushNotification } from '@/pages/push-notifications/types/pushNotification';
import type { DeviceResetRecord } from '@/pages/device-reset/types/deviceReset';
import type { Paginated } from '@/types/common';

type LoadState = 'idle' | 'loading' | 'succeeded' | 'failed';
interface Collection<T> { items: T[]; total: number; status: LoadState; error: string | null; }
export interface MobileUtilitiesState {
  images: Collection<MobileImage>;
  notifications: Collection<PushNotification>;
  deviceResets: Collection<DeviceResetRecord>;
  deviceLookup: { result: DeviceLookupResult | null; status: LoadState; error: string | null };
}
const empty = <T,>(): Collection<T> => ({ items: [], total: 0, status: 'idle', error: null });
const initialState: MobileUtilitiesState = {
  images: empty<MobileImage>(), notifications: empty<PushNotification>(), deviceResets: empty<DeviceResetRecord>(),
  deviceLookup: { result: null, status: 'idle', error: null },
};
type Reject = { rejectValue: string };
const message = (e: unknown, fallback: string) => getErrorMessage(e, fallback);

export const fetchMobileImages = createAsyncThunk<Paginated<MobileImage>, MobileUtilityQuery | undefined, Reject>('mobileUtilities/fetchImages', async (q, api) => {
  try { return await mobileUtilitiesService.listImages(q); } catch (e) { return api.rejectWithValue(message(e, 'Unable to load images.')); }
});
export const uploadMobileImage = createAsyncThunk<MobileImage, MobileImageInput, Reject>('mobileUtilities/uploadImage', async (input, api) => {
  try { return await mobileUtilitiesService.uploadImage(input); } catch (e) { return api.rejectWithValue(message(e, 'Unable to upload image.')); }
});
export const updateMobileImage = createAsyncThunk<MobileImage, { id: string; input: Partial<MobileImageInput> }, Reject>('mobileUtilities/updateImage', async ({ id, input }, api) => {
  try { return await mobileUtilitiesService.updateImage(id, input); } catch (e) { return api.rejectWithValue(message(e, 'Unable to update image.')); }
});
export const deleteMobileImage = createAsyncThunk<string, string, Reject>('mobileUtilities/deleteImage', async (id, api) => {
  try { await mobileUtilitiesService.deleteImage(id); return id; } catch (e) { return api.rejectWithValue(message(e, 'Unable to delete image.')); }
});
export const fetchPushNotifications = createAsyncThunk<Paginated<PushNotification>, MobileUtilityQuery | undefined, Reject>('mobileUtilities/fetchNotifications', async (q, api) => {
  try { return await mobileUtilitiesService.listNotifications(q); } catch (e) { return api.rejectWithValue(message(e, 'Unable to load notifications.')); }
});
export const createPushNotification = createAsyncThunk<PushNotification, NotificationInput, Reject>('mobileUtilities/createNotification', async (input, api) => {
  try { return await mobileUtilitiesService.createNotification(input); } catch (e) { return api.rejectWithValue(message(e, 'Unable to create notification.')); }
});
export const updatePushNotification = createAsyncThunk<PushNotification, { id: string; input: Partial<NotificationInput> }, Reject>('mobileUtilities/updateNotification', async ({ id, input }, api) => {
  try { return await mobileUtilitiesService.updateNotification(id, input); } catch (e) { return api.rejectWithValue(message(e, 'Unable to update notification.')); }
});
export const sendPushNotification = createAsyncThunk<PushNotification, string, Reject>('mobileUtilities/sendNotification', async (id, api) => {
  try { return await mobileUtilitiesService.sendNotification(id); } catch (e) { return api.rejectWithValue(message(e, 'Unable to send notification.')); }
});
export const deletePushNotification = createAsyncThunk<string, string, Reject>('mobileUtilities/deleteNotification', async (id, api) => {
  try { await mobileUtilitiesService.deleteNotification(id); return id; } catch (e) { return api.rejectWithValue(message(e, 'Unable to delete notification.')); }
});
export const lookupMobileDevice = createAsyncThunk<DeviceLookupResult, DeviceLookupInput, Reject>('mobileUtilities/lookupDevice', async (input, api) => {
  try { return await mobileUtilitiesService.lookupDevice(input); } catch (e) { return api.rejectWithValue(message(e, 'Unable to find customer device.')); }
});
export const resetMobileDevice = createAsyncThunk<DeviceResetRecord, DeviceResetInput, Reject>('mobileUtilities/resetDevice', async (input, api) => {
  try { return await mobileUtilitiesService.resetDevice(input); } catch (e) { return api.rejectWithValue(message(e, 'Unable to reset device.')); }
});
export const fetchDeviceResetHistory = createAsyncThunk<Paginated<DeviceResetRecord>, MobileUtilityQuery | undefined, Reject>('mobileUtilities/fetchDeviceResetHistory', async (q, api) => {
  try { return await mobileUtilitiesService.listDeviceResets(q); } catch (e) { return api.rejectWithValue(message(e, 'Unable to load device reset history.')); }
});

const mobileUtilitiesSlice = createSlice({
  name: 'mobileUtilities', initialState, reducers: {
    clearMobileUtilitiesErrors(state) {
      state.images.error = null; state.notifications.error = null; state.deviceResets.error = null; state.deviceLookup.error = null;
    },
    clearDeviceLookup(state) { state.deviceLookup.result = null; state.deviceLookup.error = null; state.deviceLookup.status = 'idle'; },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchMobileImages.pending, s => { s.images.status = 'loading'; s.images.error = null; })
      .addCase(fetchMobileImages.fulfilled, (s, a) => { s.images.items = a.payload.items; s.images.total = a.payload.total; s.images.status = 'succeeded'; })
      .addCase(fetchMobileImages.rejected, (s, a) => { s.images.status = 'failed'; s.images.error = a.payload ?? 'Unable to load images.'; })
      .addCase(uploadMobileImage.fulfilled, (s, a) => { s.images.items.unshift(a.payload); s.images.total += 1; })
      .addCase(updateMobileImage.fulfilled, (s, a) => { s.images.items = s.images.items.map(x => x.id === a.payload.id ? a.payload : x); })
      .addCase(deleteMobileImage.fulfilled, (s, a) => { s.images.items = s.images.items.filter(x => x.id !== a.payload); s.images.total = Math.max(0, s.images.total - 1); })
      .addCase(fetchPushNotifications.pending, s => { s.notifications.status = 'loading'; s.notifications.error = null; })
      .addCase(fetchPushNotifications.fulfilled, (s, a) => { s.notifications.items = a.payload.items; s.notifications.total = a.payload.total; s.notifications.status = 'succeeded'; })
      .addCase(fetchPushNotifications.rejected, (s, a) => { s.notifications.status = 'failed'; s.notifications.error = a.payload ?? 'Unable to load notifications.'; })
      .addCase(createPushNotification.fulfilled, (s, a) => { s.notifications.items.unshift(a.payload); s.notifications.total += 1; })
      .addCase(updatePushNotification.fulfilled, (s, a) => { s.notifications.items = s.notifications.items.map(x => x.id === a.payload.id ? a.payload : x); })
      .addCase(sendPushNotification.fulfilled, (s, a) => { s.notifications.items = s.notifications.items.map(x => x.id === a.payload.id ? a.payload : x); })
      .addCase(deletePushNotification.fulfilled, (s, a) => { s.notifications.items = s.notifications.items.filter(x => x.id !== a.payload); s.notifications.total = Math.max(0, s.notifications.total - 1); })
      .addCase(lookupMobileDevice.pending, s => { s.deviceLookup.status = 'loading'; s.deviceLookup.error = null; s.deviceLookup.result = null; })
      .addCase(lookupMobileDevice.fulfilled, (s, a) => { s.deviceLookup.status = 'succeeded'; s.deviceLookup.result = a.payload; })
      .addCase(lookupMobileDevice.rejected, (s, a) => { s.deviceLookup.status = 'failed'; s.deviceLookup.error = a.payload ?? 'Unable to find customer device.'; })
      .addCase(fetchDeviceResetHistory.pending, s => { s.deviceResets.status = 'loading'; s.deviceResets.error = null; })
      .addCase(fetchDeviceResetHistory.fulfilled, (s, a) => { s.deviceResets.items = a.payload.items; s.deviceResets.total = a.payload.total; s.deviceResets.status = 'succeeded'; })
      .addCase(fetchDeviceResetHistory.rejected, (s, a) => { s.deviceResets.status = 'failed'; s.deviceResets.error = a.payload ?? 'Unable to load device reset history.'; })
      .addCase(resetMobileDevice.fulfilled, (s, a) => { s.deviceResets.items.unshift(a.payload); s.deviceResets.total += 1; s.deviceLookup.result = null; });
  },
});
export const { clearMobileUtilitiesErrors, clearDeviceLookup } = mobileUtilitiesSlice.actions;
export default mobileUtilitiesSlice.reducer;
