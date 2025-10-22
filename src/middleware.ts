import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './auth';

export function middleware(request: NextRequest) {
  // Permitir todas las rutas /api sin restricciones
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Permitir rutas públicas (home, login, etc.)
  const publicPaths = ['/', '/api/auth/signin', '/api/auth/callback'];
  if (publicPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // Rutas que requieren autenticación
  const protectedPaths = ['/checkout', '/orders', '/profile', '/cart'];
  const isProtectedPath = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath) {
    // Verificar si el usuario está autenticado
    const session = auth();
    
    if (!session) {
      // Redirigir a la página de login con el callback URL
      const loginUrl = new URL('/api/auth/signin', request.url);
      loginUrl.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(loginUrl);
    }
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
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};