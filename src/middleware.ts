import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { checkAccess, requiresAuthentication } from './lib/access-control';
import type { UserRole } from './lib/access-control';

function toUserRole(value: string | undefined): UserRole {
  return value === 'admin' || value === 'user' ? (value as UserRole) : '';
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Usar getToken de NextAuth para obtener el token JWT correctamente
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === 'production'
  });
  
  const role: UserRole = toUserRole(token?.role as string);
  const isAuthenticated = !!token;

  // Redirección inteligente post-autenticación según rol
  if (isAuthenticated && (path === '/' || path === '/welcome')) {
    if (role === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    } else if (role === 'user') {
      return NextResponse.redirect(new URL('/catalog', request.url));
    }
  }

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