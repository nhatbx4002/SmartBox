import { api } from './api';
import { tokenStorage } from './tokenStorage';
import {
  AuthResult,
  ApiResponse,
  LoginPayload,
  RegisterPayload,
  ForgotPasswordPayload,
  VerifyOtpPayload,
  VerifyOtpResult,
  ResetPasswordPayload,
  OkResult,
} from '../types';

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResult> {
    const response = await api.post<ApiResponse<AuthResult>>('/api/users/login', payload);
    const data = response.data;
    await tokenStorage.saveTokens(data.accessToken, data.refreshToken);
    return data;
  },

  async register(payload: RegisterPayload): Promise<AuthResult> {
    const response = await api.post<ApiResponse<AuthResult>>('/api/users/register', payload);
    const data = response.data;
    await tokenStorage.saveTokens(data.accessToken, data.refreshToken);
    return data;
  },

  async sendForgotPasswordOtp(payload: ForgotPasswordPayload): Promise<ApiResponse<OkResult>> {
    return await api.post<ApiResponse<OkResult>>('/api/users/forgot-password', payload);
  },

  async verifyOtp(payload: VerifyOtpPayload): Promise<ApiResponse<VerifyOtpResult>> {
    return await api.post<ApiResponse<VerifyOtpResult>>('/api/users/verify-otp', payload);
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<ApiResponse<OkResult>> {
    return await api.post<ApiResponse<OkResult>>('/api/users/reset-password', payload);
  },

  async logout(): Promise<void> {
    await tokenStorage.clearTokens();
  },
};
