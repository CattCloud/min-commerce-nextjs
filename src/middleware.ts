import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './auth';

export async function middleware(request: NextRequest) {
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
    const session = await auth();
    
    if (!session) {
      // Redirigir a la página de login con el callback URL
      const loginUrl = new URL('/api/auth/signin', request.url);
      loginUrl.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Protección específica por rol para rutas de admin
    if (request.nextUrl.pathname.startsWith('/admin') && session.user?.role !== 'admin') {
      // Redirigir a página de acceso denegado
      return NextResponse.redirect(new URL('/unauthorized', request.url));
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