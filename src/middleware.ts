import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ROUTES = [
  '/dashboard',
  '/kyc',
  '/prestadores',
  '/solicitacoes',
  '/clientes',
  '/catalogo',
  '/pagamentos',
  '/repasses',
  '/utilizadores',
  '/backoffice',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('access_token')?.value;

  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Redireciona utilizador não autenticado a tentar aceder ao backoffice para o /login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redireciona utilizador já autenticado no /login para o /dashboard
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/kyc/:path*',
    '/prestadores/:path*',
    '/solicitacoes/:path*',
    '/clientes/:path*',
    '/catalogo/:path*',
    '/pagamentos/:path*',
    '/repasses/:path*',
    '/utilizadores/:path*',
    '/login',
  ],
};
