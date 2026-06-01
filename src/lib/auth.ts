let tokens: { access: string; refresh: string } | null = null;

let twoFAConfigured = false;
let twoFASecret = "";

export type UserRole = "admin" | "operador" | "operador_financeiro" | "suporte";

export type AuthUser = {
  name: string;
  role: UserRole;
};

let currentUser: AuthUser | null = null;

export function isAuthenticated() {
  return tokens !== null;
}

export function storeTokens(access: string, refresh: string) {
  tokens = { access, refresh };
}

export function clearTokens() {
  tokens = null;
  currentUser = null;
}

export function storeUser(user: AuthUser) {
  currentUser = user;
}

export function getUser(): AuthUser | null {
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

