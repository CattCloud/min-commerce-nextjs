import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkAccess } from './lib/access-control';
import type { UserRole } from './lib/access-control';

function getSessionToken(req: NextRequest): string {
  return (
    req.cookies.get('__Secure-authjs.session-token')?.value ??
    req.cookies.get('authjs.session-token')?.value ??
    req.cookies.get('next-auth.session-token')?.value ??
    ''
  );
}

function base64UrlToString(b64url: string): string {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  const pad = '='.repeat((4 - (b64.length % 4)) % 4);
  return globalThis.atob(b64 + pad);
}

interface JwtPayload {
  role?: string;
}

function extractRoleFromJwt(token: string): string {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return '';
    const json = base64UrlToString(parts[1]);
    const payload = JSON.parse(json) as unknown;
    if (payload && typeof payload === 'object' && 'role' in payload) {
      const value = (payload as Record<string, unknown>).role;
      return typeof value === 'string' ? value : '';
    }
    return '';
  } catch {
    return '';
  }
}

function toUserRole(value: string): UserRole {
  return value === 'admin' || value === 'user' ? (value as UserRole) : '';
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Obtener token y rol desde cookie (sin importar next-auth en middleware)
  const token = getSessionToken(request);
  const rawRole = extractRoleFromJwt(token);
  const role: UserRole = toUserRole(rawRole);
  const isAuthenticated = token.length > 0;

  // Usar el sistema de control de acceso centralizado
  const accessResult = checkAccess(path, role, isAuthenticated);
  
  if (!accessResult.hasAccess) {
    // Manejar redirecciones basadas en la razón de acceso denegado
    if (accessResult.reason === 'unauthorized' && accessResult.redirectUrl) {
      // Usuario no autenticado - redirigir a login con callback URL
      const loginUrl = new URL(accessResult.redirectUrl, request.url);
      loginUrl.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(loginUrl);
    }
    
    if (accessResult.reason === 'insufficient_permissions' && accessResult.redirectUrl) {
      // Usuario autenticado pero sin permisos - redirigir a página de acceso denegado
      return NextResponse.redirect(new URL(accessResult.redirectUrl, request.url));
    }
    
    // Fallback por si acaso
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (exclude all API routes to keep middleware bundle minimal)
     */
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};