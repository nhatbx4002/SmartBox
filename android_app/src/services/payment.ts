import { api } from './api';
import {
  ApiResponse,
  CreatePaymentPayload,
  CreatePaymentResult,
  PaymentStatusResult,
} from '../types';

export const paymentService = {
  async createPayment(payload: CreatePaymentPayload) {
    return await api.post<ApiResponse<CreatePaymentResult>>('/api/payments', payload);
  },

  async getPaymentStatus(orderCode: number) {
    return await api.get<ApiResponse<PaymentStatusResult>>(
      `/api/payments/payment-status?orderCode=${orderCode}`,
    );
  },
};
