import { api } from './api';
import {
  ApiResponse,
  User,
  Notification,
  UpdateProfilePayload,
  MarkAllReadResult,
} from '../types';

export const userService = {
  async getProfile(): Promise<ApiResponse<User>> {
    return await api.get<ApiResponse<User>>('/api/users/me');
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<ApiResponse<User>> {
    return await api.put<ApiResponse<User>>('/api/users/me', payload);
  },

  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    return await api.get<ApiResponse<Notification[]>>('/api/users/me/notifications');
  },

  async markNotificationRead(id: string): Promise<ApiResponse<Notification>> {
    return await api.put<ApiResponse<Notification>>(`/api/users/me/notifications/${id}/read`);
  },

  async markAllNotificationsRead(): Promise<ApiResponse<MarkAllReadResult>> {
    return await api.put<ApiResponse<MarkAllReadResult>>('/api/users/me/notifications/read-all');
  },
};
