/**
 * Ejemplos de uso del sistema de control de acceso
 * 
 * Este archivo contiene ejemplos prácticos de cómo usar el helper hasAccess()
 * y el sistema de control de acceso centralizado implementado para el Labo29
 */

import { hasAccess, checkAccess, getAccessType, UserRole } from './access-control';

// Ejemplo 1: Uso básico en componentes
export const componentExample = `
/**
 * Ejemplo de uso en un componente de React
 */
import { hasAccess } from '@/lib/access-control';
import { useSession } from 'next-auth/react';

function AdminPanel() {
  const { data: session } = useSession();
  const userRole = session?.user?.role || '';
  
  // Verificar si el usuario puede acceder a esta sección
  if (!hasAccess('/admin', userRole)) {
    return <div>Acceso denegado</div>;
  }
  
  return (
    <div>
      <h1>Panel de Administración</h1>
      {/* Contenido del panel */}
    </div>
  );
}
`;

// Ejemplo 2: Uso en middleware (implementación actual)
export const middlewareExample = `
/**
 * Middleware con sistema centralizado de control de acceso
 */
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
`;

// Ejemplo 3: Verificación detallada
export const detailedCheckExample = `
/**
 * Ejemplo de verificación detallada con información específica
 */
import { checkAccess } from '@/lib/access-control';

function verifyUserAccess(userRole: string, path: string, isAuthenticated: boolean) {
  const result = checkAccess(path, userRole, isAuthenticated);
  
  switch (result.reason) {
    case 'public':
      console.log('✓ Ruta pública, acceso permitido');
      break;
      
    case 'authenticated':
      console.log('✓ Usuario autenticado, acceso permitido');
      break;
      
    case 'admin':
      console.log('✓ Permisos de administrador, acceso permitido');
      break;
      
    case 'dashboard':
      console.log('✓ Dashboard accesible, acceso permitido');
      break;
      
    case 'unauthorized':
      console.log('✗ Usuario no autenticado, redirigiendo a login');
      // Redirigir a: result.redirectUrl
      break;
      
    case 'insufficient_permissions':
      console.log('✗ Permisos insuficientes, redirigiendo a acceso denegado');
      // Redirigir a: result.redirectUrl
      break;
  }
  
  return result.hasAccess;
}

// Casos de uso
verifyUserAccess('admin', '/admin', true);     // true
verifyUserAccess('user', '/admin', true);      // false - insufficient_permissions
verifyUserAccess('', '/profile', false);       // false - unauthorized
verifyUserAccess('user', '/dashboard', true);  // true
verifyUserAccess('admin', '/', false);         // true - public route
`;

// Ejemplo 4: Uso en APIs
export const apiExample = `
/**
 * Ejemplo de uso en rutas de API
 */
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { hasAccess } from '@/lib/access-control';

export async function GET(request: Request) {
  const session = await auth();
  const userRole = session?.user?.role || '';
  
  // Verificar acceso antes de procesar la petición
  const path = '/api/admin/stats';
  
  if (!hasAccess(path, userRole)) {
    return NextResponse.json(
      { error: 'Acceso denegado' },
      { status: 403 }
    );
  }
  
  // Procesar la petición si tiene acceso
  const stats = await getAdminStats();
  return NextResponse.json(stats);
}
`;

// Ejemplo 5: Configuración personalizada
export const customConfigExample = `
/**
 * Ejemplo de cómo agregar nuevas rutas al sistema de control de acceso
 */

// Modificar src/lib/access-control.ts para agregar nuevas rutas:

const ROUTE_ACCESS_CONFIG = {
  // ... rutas existentes
  public: ['/', '/api/auth/signin', '/api/auth/callback'],
  api: '/api/',
  admin: '/admin',
  authenticated: ['/profile', '/checkout', '/orders', '/cart'],
  dashboard: '/dashboard',
  
  // Nuevas rutas personalizadas
  custom: ['/reports', '/analytics'],
  premium: ['/premium-content'],
};

// Agregar lógica para las nuevas rutas
export function hasAccess(path: string, role: UserRole): boolean {
  // ... lógica existente
  
  // Nuevas rutas personalizadas
  if (path.startsWith('/reports')) {
    return role === 'admin'; // Solo admin puede acceder a reports
  }
  
  if (path.startsWith('/analytics')) {
    return role === 'admin' || role === 'user'; // Admin y user pueden acceder
  }
  
  if (path.startsWith('/premium-content')) {
    return role === 'premium'; // Solo usuarios premium
  }
  
  // ... resto de la lógica
}
`;

// Casos de prueba prácticos
export const testCases = {
  // Casos que deben retornar true
  allowed: {
    'Ruta pública para cualquier usuario': () => {
      return hasAccess('/', 'user') === true;
    },
    'Admin accediendo a admin': () => {
      return hasAccess('/admin', 'admin') === true;
    },
    'Usuario accediendo a perfil': () => {
      return hasAccess('/profile', 'user') === true;
    },
    'Admin accediendo a dashboard': () => {
      return hasAccess('/dashboard', 'admin') === true;
    },
    'Usuario accediendo a dashboard': () => {
      return hasAccess('/dashboard', 'user') === true;
    },
    'Ruta de API sin restricciones': () => {
      return hasAccess('/api/products', 'user') === true;
    }
  },
  
  // Casos que deben retornar false
  denied: {
    'Usuario normal accediendo a admin': () => {
      return hasAccess('/admin', 'user') === false;
    },
    'Usuario no autenticado accediendo a perfil': () => {
      return hasAccess('/profile', '') === false;
    },
    'Usuario no autenticado accediendo a dashboard': () => {
      return hasAccess('/dashboard', '') === false;
    },
    'Usuario accediendo a admin sin autenticación': () => {
      return hasAccess('/admin', '') === false;
    }
  }
};

// Función helper para ejecutar tests
export function runAccessControlTests() {
  console.log('🧪 Ejecutando tests del sistema de control de acceso...\n');
  
  let passed = 0;
  let failed = 0;
  
  // Tests de acceso permitido
  console.log('✅ Tests de acceso permitido:');
  Object.entries(testCases.allowed).forEach(([description, testFn]) => {
    try {
      if (testFn()) {
        console.log(`  ✓ ${description}`);
        passed++;
      } else {
        console.log(`  ✗ ${description}`);
        failed++;
      }
    } catch (error) {
      console.log(`  ✗ ${description} (Error: ${error})`);
      failed++;
    }
  });
  
  console.log('\n❌ Tests de acceso denegado:');
  Object.entries(testCases.denied).forEach(([description, testFn]) => {
    try {
      if (testFn()) {
        console.log(`  ✓ ${description}`);
        passed++;
      } else {
        console.log(`  ✗ ${description}`);
        failed++;
      }
    } catch (error) {
      console.log(`  ✗ ${description} (Error: ${error})`);
      failed++;
    }
  });
  
  console.log(`\n📊 Resultados: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('🎉 Todos los tests pasaron correctamente!');
  } else {
    console.log('⚠️  Algunos tests fallaron. Revisar la implementación.');
  }
  
  return { passed, failed };
}

// Exportar función para ejecutar tests (ya exportada arriba)