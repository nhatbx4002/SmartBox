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
  /**
   * Log in user with phone and password
   */
  async login(payload: LoginPayload): Promise<AuthResult> {
    const response = await api.post<ApiResponse<AuthResult>>('/api/users/login', payload);
    const data = response.data;
    await tokenStorage.saveTokens(data.accessToken, data.refreshToken);
    return data;
  },

  /**
   * Register a new user with phone and password
   */
  async register(payload: RegisterPayload): Promise<AuthResult> {
    const response = await api.post<ApiResponse<AuthResult>>('/api/users/register', payload);
    const data = response.data;
    await tokenStorage.saveTokens(data.accessToken, data.refreshToken);
    return data;
  },

  /**
   * Request an OTP for resetting password
   */
  async sendForgotPasswordOtp(payload: ForgotPasswordPayload): Promise<ApiResponse<OkResult>> {
    return await api.post<ApiResponse<OkResult>>('/api/users/forgot-password', payload);
  },

  /**
   * Verify the OTP to get a reset token
   */
  async verifyOtp(payload: VerifyOtpPayload): Promise<ApiResponse<VerifyOtpResult>> {
    return await api.post<ApiResponse<VerifyOtpResult>>('/api/users/verify-otp', payload);
  },

  /**
   * Reset the password using the reset token
   */
  async resetPassword(payload: ResetPasswordPayload): Promise<ApiResponse<OkResult>> {
    return await api.post<ApiResponse<OkResult>>('/api/users/reset-password', payload);
  },

  /**
   * Log out the user by clearing local token storage
   */
  async logout(): Promise<void> {
    await tokenStorage.clearTokens();
  },
};
