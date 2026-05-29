// Tokens live only in module scope — never written to localStorage or sessionStorage
let tokens: { access: string; refresh: string } | null = null;

// Mock backend: tracks whether the user has completed 2FA setup and stores the secret
let twoFAConfigured = false;
let twoFASecret = "";

export function isAuthenticated() {
  return tokens !== null;
}

export function storeTokens(access: string, refresh: string) {
  tokens = { access, refresh };
}

export function clearTokens() {
  tokens = null;
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
