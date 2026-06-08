import { api } from './api';
import {
  ApiResponse,
  User,
  Notification,
  UpdateProfilePayload,
  OkResult,
  MarkAllReadResult,
} from '../types';

export const userService = {
  /**
   * Get the current user profile
   */
  async getProfile(): Promise<ApiResponse<User>> {
    return await api.get<ApiResponse<User>>('/api/users/me');
  },

  /**
   * Update the user profile (name, email, password)
   */
  async updateProfile(payload: UpdateProfilePayload): Promise<ApiResponse<User>> {
    return await api.put<ApiResponse<User>>('/api/users/me', payload);
  },

  /**
   * Get notifications for the current user
   */
  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    return await api.get<ApiResponse<Notification[]>>('/api/users/me/notifications');
  },

  /**
   * Mark a notification as read
   */
  async markNotificationRead(id: string): Promise<ApiResponse<Notification>> {
    return await api.put<ApiResponse<Notification>>(`/api/users/me/notifications/${id}/read`);
  },

  /**
   * Mark all notifications as read
   */
  async markAllNotificationsRead(): Promise<ApiResponse<MarkAllReadResult>> {
    return await api.put<ApiResponse<MarkAllReadResult>>('/api/users/me/notifications/read-all');
  },
};
