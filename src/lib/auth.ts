// Tokens live only in module scope — never written to localStorage or sessionStorage
let tokens: { access: string; refresh: string } | null = null;

// Mock users — substituir pela resposta real do backend quando disponível
export const MOCK_USERS: Record<string, { id: string; name: string; role: string }> = {
  'aliadinis@gmail.com':       { id: '1', name: 'alia', role: 'admin' },
  'operador@gmail.com':    { id: '2', name: 'emalungo', role: 'operador' },
  'financeiro@gmail.com':  { id: '3', name: 'adinis', role: 'operador_financeiro' },
  'suporte@gmail.com':     { id: '4', name: 'ansebast Suporte',  role: 'suporte' },
};

let currentUser: {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operador' | 'suporte' | string;
} | null = null;

// Mock backend: tracks whether the user has completed 2FA setup and stores the secret
let twoFAConfigured = false;
let twoFASecret = "";

export function storeTokens(
  access: string,
  refresh: string,
  user: typeof currentUser
) {
  tokens = { access, refresh };
  currentUser = user;
}

export function clearTokens() {
  tokens = null;
  currentUser = null;
}

export function getUser() {
  return currentUser;
}

export function hasTwoFA() {
  return twoFAConfigured;
}

export function activateTwoFA(secret: string) {
  twoFAConfigured = true;
  twoFASecret = secret;
}

export function getTwoFASecret() {
  return twoFASecret;
}