import type { Paginated } from '@/types/common';
import type { PushNotification } from '@/pages/push-notifications/types/pushNotification';
import type { DeviceResetRecord } from '@/pages/device-reset/types/deviceReset';
import { api } from './api/axiosInstance';
import { ENDPOINTS } from './api/endpoints';

export type MobileImage = {
  id: string; name: string; type: string; path: string; size: number;
  format: string; dimensions: string; altText: string; platform: string;
  status: string; updatedAt: string; previewUrl?: string;
};
export type MobileImageInput = Omit<MobileImage, 'id' | 'updatedAt'> & { file?: File | Blob };
export interface MobileUtilityQuery { page?: number; pageSize?: number; search?: string; status?: string; [key: string]: unknown; }
export interface DeviceLookupInput { customerNumber: string; mobile: string; }
export interface DeviceLookupResult { customerNumber: string; branch: string; mobile: string; device: string; registeredOn: string; }
export interface DeviceResetInput extends DeviceLookupInput { reason: string; }
export interface NotificationInput extends Omit<PushNotification, 'id' | 'sentOn' | 'status'> {
  action?: 'send' | 'draft'; schedule?: string; dateTime?: string;
}

export const mobileUtilitiesService = {
  async listImages(query: MobileUtilityQuery = {}): Promise<Paginated<MobileImage>> {
    const { data } = await api.get<Paginated<MobileImage>>(ENDPOINTS.mobileUtilities.images.base, { params: query }); return data;
  },
  async getImage(id: string): Promise<MobileImage> {
    const { data } = await api.get<MobileImage>(ENDPOINTS.mobileUtilities.images.byId(id)); return data;
  },
  async uploadImage(input: MobileImageInput): Promise<MobileImage> {
    const body = new FormData();
    Object.entries(input).forEach(([key, value]) => { if (value !== undefined && key !== 'previewUrl') body.append(key, value instanceof Blob ? value : String(value)); });
    const { data } = await api.post<MobileImage>(ENDPOINTS.mobileUtilities.images.base, body, { headers: { 'Content-Type': 'multipart/form-data' } }); return data;
  },
  async updateImage(id: string, input: Partial<MobileImageInput>): Promise<MobileImage> {
    const body = new FormData();
    Object.entries(input).forEach(([key, value]) => { if (value !== undefined && key !== 'previewUrl') body.append(key, value instanceof Blob ? value : String(value)); });
    const { data } = await api.put<MobileImage>(ENDPOINTS.mobileUtilities.images.byId(id), body, { headers: { 'Content-Type': 'multipart/form-data' } }); return data;
  },
  async deleteImage(id: string): Promise<void> { await api.delete(ENDPOINTS.mobileUtilities.images.byId(id)); },
  async listNotifications(query: MobileUtilityQuery = {}): Promise<Paginated<PushNotification>> {
    const { data } = await api.get<Paginated<PushNotification>>(ENDPOINTS.mobileUtilities.notifications.base, { params: query }); return data;
  },
  async getNotification(id: string): Promise<PushNotification> {
    const { data } = await api.get<PushNotification>(ENDPOINTS.mobileUtilities.notifications.byId(id)); return data;
  },
  async createNotification(input: NotificationInput): Promise<PushNotification> {
    const { data } = await api.post<PushNotification>(ENDPOINTS.mobileUtilities.notifications.base, input); return data;
  },
  async updateNotification(id: string, input: Partial<NotificationInput>): Promise<PushNotification> {
    const { data } = await api.put<PushNotification>(ENDPOINTS.mobileUtilities.notifications.byId(id), input); return data;
  },
  async sendNotification(id: string): Promise<PushNotification> {
    const { data } = await api.post<PushNotification>(ENDPOINTS.mobileUtilities.notifications.send(id)); return data;
  },
  async deleteNotification(id: string): Promise<void> { await api.delete(ENDPOINTS.mobileUtilities.notifications.byId(id)); },
  async lookupDevice(input: DeviceLookupInput): Promise<DeviceLookupResult> {
    const { data } = await api.post<DeviceLookupResult>(ENDPOINTS.mobileUtilities.deviceReset.lookup, input); return data;
  },
  async resetDevice(input: DeviceResetInput): Promise<DeviceResetRecord> {
    const { data } = await api.post<DeviceResetRecord>(ENDPOINTS.mobileUtilities.deviceReset.reset, input); return data;
  },
  async listDeviceResets(query: MobileUtilityQuery = {}): Promise<Paginated<DeviceResetRecord>> {
    const { data } = await api.get<Paginated<DeviceResetRecord>>(ENDPOINTS.mobileUtilities.deviceReset.base, { params: query }); return data;
  },
};
