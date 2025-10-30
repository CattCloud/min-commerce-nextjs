/**
 * Sistema de Control de Acceso Centralizado
 *
 * Este módulo centraliza toda la lógica de control de acceso del sistema,
 * permitiendo una gestión más mantenible y escalable de permisos y roles.
 *
 * Implementado como parte del Laboratorio 29: Protección de rutas con Middleware
 */

/**
 * Tipos de usuario en el sistema
 */
export type UserRole = 'admin' | 'user' | '';

/**
 * Configuración de acceso para cada ruta
 * Define qué roles pueden acceder a cada sección del sistema
 */
const ROUTE_ACCESS_CONFIG = {
  // Rutas públicas - accesibles sin autenticación
  public: ['/', '/api/auth/signin', '/api/auth/callback'],
  
  // Rutas de API - por defecto sin restricciones
  api: '/api/',
  
  // Rutas administrativas - solo admin
  admin: '/admin',
  
  // Rutas de usuario autenticado - cualquier usuario logueado
  authenticated: ['/profile', '/checkout', '/orders', '/cart'],
  
  // Dashboard - accesible por admin y user
  dashboard: '/dashboard',
};

/**
 * Helper function para verificar acceso a rutas basado en rol y path
 *
 * @param path - La ruta a verificar
 * @param role - El rol del usuario ('admin', 'user', o '' para no autenticado)
 * @returns boolean - true si el usuario tiene acceso, false en caso contrario
 *
 * @example
 * ```typescript
 * hasAccess('/admin', 'user') // false - usuario normal no puede acceder a admin
 * hasAccess('/profile', 'admin') // true - admin puede acceder al perfil
 * hasAccess('/dashboard', 'user') // true - usuarios pueden acceder al dashboard
 * hasAccess('/', 'user') // true - ruta pública
 * ```
 */
export function hasAccess(path: string, role: UserRole): boolean {
  // Rutas públicas - accesibles sin autenticación
  if (ROUTE_ACCESS_CONFIG.public.includes(path)) {
    return true;
  }
  
  // Rutas de API - sin restricciones por defecto
  if (path.startsWith(ROUTE_ACCESS_CONFIG.api)) {
    return true;
  }
  
  // Rutas administrativas - solo admin
  if (path.startsWith(ROUTE_ACCESS_CONFIG.admin)) {
    return role === 'admin';
  }
  
  // Dashboard - accesible por admin y user (requiere autenticación)
  if (path.startsWith(ROUTE_ACCESS_CONFIG.dashboard)) {
    return role !== ''; // Cualquier usuario autenticado
  }
  
  // Rutas de usuario autenticado - cualquier usuario logueado
  for (const authenticatedPath of ROUTE_ACCESS_CONFIG.authenticated) {
    if (path.startsWith(authenticatedPath)) {
      return role !== ''; // Cualquier usuario autenticado
    }
  }
  
  // Por defecto, permitir acceso a rutas no especificadas
  // Esto es útil para rutas que se agreguen dinámicamente
  return true;
}

/**
 * Verifica si una ruta requiere autenticación
 *
 * @param path - La ruta a verificar
 * @returns boolean - true si la ruta requiere autenticación
 */
export function requiresAuthentication(path: string): boolean {
  // Rutas públicas no requieren autenticación
  if (ROUTE_ACCESS_CONFIG.public.includes(path)) {
    return false;
  }
  
  // Rutas de API no requieren verificación de sesión (se maneja en cada endpoint)
  if (path.startsWith(ROUTE_ACCESS_CONFIG.api)) {
    return false;
  }
  
  // Todas las demás rutas protegidas requieren autenticación
  return true;
}

/**
 * Obtiene el tipo de acceso requerido para una ruta
 *
 * @param path - La ruta a verificar
 * @returns 'public' | 'authenticated' | 'admin' | 'dashboard' | 'unknown'
 */
export function getAccessType(path: string): 'public' | 'authenticated' | 'admin' | 'dashboard' | 'unknown' {
  // Rutas públicas
  if (ROUTE_ACCESS_CONFIG.public.includes(path)) {
    return 'public';
  }
  
  // Rutas de API
  if (path.startsWith(ROUTE_ACCESS_CONFIG.api)) {
    return 'public'; // Las APIs se protegen a nivel de endpoint
  }
  
  // Rutas administrativas
  if (path.startsWith(ROUTE_ACCESS_CONFIG.admin)) {
    return 'admin';
  }
  
  // Dashboard
  if (path.startsWith(ROUTE_ACCESS_CONFIG.dashboard)) {
    return 'dashboard';
  }
  
  // Rutas autenticadas
  for (const authenticatedPath of ROUTE_ACCESS_CONFIG.authenticated) {
    if (path.startsWith(authenticatedPath)) {
      return 'authenticated';
    }
  }
  
  return 'unknown';
}

/**
 * Verifica si un usuario puede acceder a una ruta específica
 * Incluye validación más robusta de casos edge
 *
 * @param path - La ruta a verificar
 * @param role - El rol del usuario
 * @param isAuthenticated - Si el usuario está autenticado
 * @returns objeto con resultado y razón de acceso/denegación
 */
export function checkAccess(
  path: string,
  role: UserRole,
  isAuthenticated: boolean = false
): {
  hasAccess: boolean;
  reason: 'public' | 'authenticated' | 'admin' | 'dashboard' | 'unauthorized' | 'insufficient_permissions';
  redirectUrl?: string;
} {
  // Rutas públicas
  const accessType = getAccessType(path);
  
  switch (accessType) {
    case 'public':
      return {
        hasAccess: true,
        reason: 'public'
      };
      
    case 'admin':
      if (!isAuthenticated) {
        return {
          hasAccess: false,
          reason: 'unauthorized',
          redirectUrl: '/api/auth/signin'
        };
      }
      if (role !== 'admin') {
        return {
          hasAccess: false,
          reason: 'insufficient_permissions',
          redirectUrl: '/unauthorized'
        };
      }
      return {
        hasAccess: true,
        reason: 'admin'
      };
      
    case 'dashboard':
      if (!isAuthenticated) {
        return {
          hasAccess: false,
          reason: 'unauthorized',
          redirectUrl: '/api/auth/signin'
        };
      }
      return {
        hasAccess: true,
        reason: 'dashboard'
      };
      
    case 'authenticated':
      if (!isAuthenticated) {
        return {
          hasAccess: false,
          reason: 'unauthorized',
          redirectUrl: '/api/auth/signin'
        };
      }
      return {
        hasAccess: true,
        reason: 'authenticated'
      };
      
    default:
      // Para rutas no definidas, aplicar lógica genérica
      return {
        hasAccess: hasAccess(path, role),
        reason: hasAccess(path, role) ? 'public' : 'unauthorized'
      };
  }
}

/**
 * Constants exportadas para referencia externa
 */
export const PUBLIC_PATHS = ROUTE_ACCESS_CONFIG.public;
export const API_PREFIX = ROUTE_ACCESS_CONFIG.api;
export const ADMIN_PREFIX = ROUTE_ACCESS_CONFIG.admin;
export const DASHBOARD_PATH = ROUTE_ACCESS_CONFIG.dashboard;
export const AUTHENTICATED_PATHS = ROUTE_ACCESS_CONFIG.authenticated;

/**
 * Configuración completa exportada para uso en middleware y otros componentes
 */
export const ACCESS_CONTROL_CONFIG = {
  ROUTE_ACCESS_CONFIG,
  hasAccess,
  requiresAuthentication,
  getAccessType,
  checkAccess,
  PUBLIC_PATHS,
  API_PREFIX,
  ADMIN_PREFIX,
  DASHBOARD_PATH,
  AUTHENTICATED_PATHS,
} as const;