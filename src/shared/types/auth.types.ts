export interface User {
  id: number | string;
  nome_completo: string;
  email: string;
  telefone: string;
  role?: string;
  status?: string;
  email_verified_at?: string | null;
  telefone_verificado_at?: string | null;
  created_at?: string;
  prestador?: unknown; // Replace with Prestador type if available
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface LoginResponseSuccess {
  user: User;
  access_token: string;
  refresh_token: string;
}

export interface LoginResponseTwoFactor {
  two_factor_pending: boolean;
  two_factor_setup_required: boolean;
  temp_token: string;
}

export type LoginResponse = LoginResponseSuccess | LoginResponseTwoFactor;

export interface RegisterClienteRequest {
  name: string;
  email: string;
  telefone: string;
  password?: string;
  password_confirmation?: string;
  tipo_cliente?: string;
}

export interface RegisterPrestadorRequest {
  name: string;
  email: string;
  telefone: string;
  password?: string;
  password_confirmation?: string;
  tipo_prestador?: string;
}

export interface AuthResponse {
  user: User;
}

export interface VerifyOtpRequest {
  telefone: string;
  codigo: string;
}

export interface ResendOtpRequest {
  telefone: string;
}

export interface ResendEmailRequest {
  email: string;
}

export interface RefreshResponse {
  access_token: string;
  refresh_token: string;
}

export interface TwoFactorSetupResponse {
  secret: string;
  qr_code: string;
  qr_url: string;
}

export interface TwoFactorVerifyRequest {
  totp_code: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}
