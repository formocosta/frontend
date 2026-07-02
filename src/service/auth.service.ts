import apiClient from '../shared/utils/api.utils';
import {
  LoginRequest,
  LoginResponse,
  RegisterClienteRequest,
  RegisterPrestadorRequest,
  AuthResponse,
  VerifyOtpRequest,
  ResendOtpRequest,
  ResendEmailRequest,
  RefreshResponse,
  TwoFactorSetupResponse,
  TwoFactorVerifyRequest,
  AuthTokens
} from '../shared/types/auth.types';

export const AuthService = {
  /**
   * Register a new client
   */
  registerCliente: async (data: RegisterClienteRequest) => {
    const response = await apiClient.post<{ data: AuthResponse }>('/v1/auth/clientes/registar', data);
    return response.data;
  },

  /**
   * Register a new service provider
   */
  registerPrestador: async (data: RegisterPrestadorRequest) => {
    const response = await apiClient.post<{ data: AuthResponse }>('/v1/auth/prestadores/registar', data);
    return response.data;
  },

  /**
   * Login user
   */
  login: async (data: LoginRequest) => {
    const response = await apiClient.post<{ data: LoginResponse }>('/v1/auth/login', data);
    return response.data;
  },

  /**
   * Verify OTP code for phone number
   */
  verifyOtp: async (data: VerifyOtpRequest) => {
    const response = await apiClient.post('/v1/auth/otp/verificar', data);
    return response.data;
  },

  /**
   * Resend OTP code to phone number
   */
  resendOtp: async (data: ResendOtpRequest) => {
    const response = await apiClient.post('/v1/auth/otp/reenviar', data);
    return response.data;
  },

  /**
   * Verify email with token
   */
  verifyEmail: async (token: string) => {
    const response = await apiClient.get('/v1/auth/email/verificar', {
      params: { token },
    });
    return response.data;
  },

  /**
   * Resend verification email
   */
  resendEmail: async (data: ResendEmailRequest) => {
    const response = await apiClient.post('/v1/auth/email/reenviar', data);
    return response.data;
  },

  /**
   * Refresh access token
   */
  refresh: async () => {
    const response = await apiClient.post<{ data: RefreshResponse }>('/v1/auth/refresh');
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async () => {
    const response = await apiClient.post('/v1/auth/logout');
    return response.data;
  },

  /**
   * Get current authenticated user
   */
  getMe: async () => {
    const response = await apiClient.get<{ data: AuthResponse }>('/v1/auth/me');
    return response.data;
  },

  /**
   * Setup Two-Factor Authentication (2FA)
   */
  twoFactorSetup: async () => {
    const response = await apiClient.post<{ data: TwoFactorSetupResponse }>('/v1/auth/2fa/setup');
    return response.data;
  },

  /**
   * Verify Two-Factor Authentication code (usually during login if pending)
   */
  twoFactorVerify: async (data: TwoFactorVerifyRequest) => {
    const response = await apiClient.post<{ data: AuthTokens }>('/v1/auth/2fa/verify', data);
    return response.data;
  },

  /**
   * Validate Two-Factor Authentication code (usually to confirm setup)
   */
  twoFactorValidate: async (data: TwoFactorVerifyRequest) => {
    const response = await apiClient.post<{ data: AuthTokens }>('/v1/auth/2fa/validate', data);
    return response.data;
  },
};