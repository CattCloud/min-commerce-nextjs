import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './auth';
import { checkAccess } from './lib/access-control';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Obtener sesión del usuario
  const session = await auth();
  const userRole = session?.user?.role || '';
  const isAuthenticated = !!session;

  // Usar el sistema de control de acceso centralizado
  const accessResult = checkAccess(path, userRole, isAuthenticated);
  
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
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};