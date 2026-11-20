import { api } from './api/axiosInstance';
import { ENDPOINTS } from './api/endpoints';

export interface HeaderNotification {
  id: string | number;
  title: string;
  message: string;
  status?: string;
  branch?: string;
  sentOn?: string;
  createdOn?: string;
}
export const headerNotificationService = {
  async list(): Promise<HeaderNotification[]> {
    const { data } = await api.get<{ items: HeaderNotification[] }>(ENDPOINTS.mobileUtilities.notifications.header);
    return data.items ?? [];
  },
};
