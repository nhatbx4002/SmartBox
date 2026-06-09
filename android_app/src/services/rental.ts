import { api } from './api';
import {
  ApiResponse,
  PaginatedApiResponse,
  CreateRentalPayload,
  CreateRentalResult,
  RentalWithRelations,
  OkResult,
} from '../types';

export const rentalService = {
  async createRental(payload: CreateRentalPayload): Promise<ApiResponse<CreateRentalResult>> {
    return await api.post<ApiResponse<CreateRentalResult>>('/api/rentals', payload);
  },

  async getRentalByCode(code: string): Promise<ApiResponse<RentalWithRelations>> {
    return await api.get<ApiResponse<RentalWithRelations>>(`/api/rentals/${code}`);
  },

  async unlockRental(rentalId: string): Promise<ApiResponse<RentalWithRelations>> {
    return await api.post<ApiResponse<RentalWithRelations>>(`/api/users/me/rentals/${rentalId}/unlock`);
  },

  async completeRental(rentalId: string): Promise<ApiResponse<OkResult>> {
    return await api.post<ApiResponse<OkResult>>(`/api/users/me/rentals/${rentalId}/complete`);
  },

  async getUserRentals(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedApiResponse<RentalWithRelations[]>> {
    const queryParts: string[] = [];
    if (params?.page) queryParts.push(`page=${params.page}`);
    if (params?.limit) queryParts.push(`limit=${params.limit}`);
    if (params?.status) queryParts.push(`status=${params.status}`);
    const query = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
    return await api.get<PaginatedApiResponse<RentalWithRelations[]>>(`/api/users/me/rentals${query}`);
  },

  async getRentalById(rentalId: string): Promise<ApiResponse<RentalWithRelations>> {
    return await api.get<ApiResponse<RentalWithRelations>>(`/api/users/me/rentals/${rentalId}`);
  },
};
