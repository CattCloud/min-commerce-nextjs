# Min-Commerce Next.js

Una aplicación de e-commerce moderna construida con Next.js 15, TypeScript y Prisma, implementando un sistema completo de autenticación y autorización basado en roles.

## 🚀 Características Principales

### 🛍 Autenticación y Autorización
- **Login con Google OAuth2**: Integración completa con Google para autenticación de usuarios
- **Sistema de Roles**: Implementación de roles `admin` y `user` con control de acceso granular
- **Middleware de Protección**: Sistema centralizado de protección de rutas con redirecciones inteligentes
- **Logging de Sesiones**: Registro completo de actividad de usuarios (login/logout) en base de datos

### 📦 Gestión de Productos
- **Catálogo Completo**: CRUD de productos con imágenes, categorías y gestión de stock
- **Búsqueda y Filtros**: Sistema de búsqueda avanzada con filtros por categoría
- **Detalles de Producto**: Páginas individuales con información completa y acciones de compra

### 🛒 Carrito de Compras
- **Gestión Persistente**: Carrito que persiste en base de datos con sincronización en tiempo real
- **Operaciones CRUD**: Agregar, actualizar y eliminar productos del carrito
- **Integración con Órdenes**: Flujo completo desde carrito hasta confirmación de compra

### 📊 Panel Administrativo
- **Dashboard con Estadísticas**: Métricas en tiempo real de productos, órdenes, usuarios y revenue
- **Logs de Sesión**: Visualización completa de actividad de usuarios con filtros y paginación
- **Gestión de Usuarios**: Vista general de usuarios registrados y su actividad
- **Gráficos Interactivos**: Visualizaciones de datos con Chart.js para análisis de tendencias

### 🎨 Experiencia de Usuario
- **Diseño Responsivo**: Interfaz adaptada para todos los dispositivos
- **Componentes Modernos**: UI construida con shadcn/ui y Tailwind CSS
- **Estados de Carga**: Indicadores visuales durante operaciones asíncronas
- **Notificaciones**: Sistema de notificaciones en tiempo real con Notyf

## 🏗️ Arquitectura Técnica

### 📁 Estructura del Proyecto
```
src/
├── app/                    # App Router (Next.js 13+)
│   ├── (auth)/            # Rutas de autenticación
│   ├── admin/             # Panel administrativo
│   ├── api/               # API Routes
│   │   ├── auth/          # Endpoints de autenticación
│   │   ├── admin/         # Endpoints admin
│   │   ├── cart/          # API del carrito
│   │   ├── orders/        # API de órdenes
│   │   └── products/      # API de productos
│   ├── catalog/           # Catálogo protegido
│   ├── profile/           # Perfil de usuario
│   ├── welcome/           # Página de bienvenida
│   └── unauthorized/      # Página de acceso denegado
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes base (shadcn/ui)
│   └── admin/            # Componentes administrativos
├── lib/                  # Utilidades y configuración
│   ├── prisma.ts         # Cliente Prisma (singleton)
│   ├── access-control.ts  # Sistema de control de acceso
│   └── utils.ts          # Funciones helper
├── store/                # Estado global (Zustand)
├── types/                # Definiciones TypeScript
└── schemas/              # Esquemas de validación (Zod)
```

### 🔧 Stack Tecnológico
- **Frontend**: Next.js 15, React 18, TypeScript
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de Datos**: PostgreSQL (Neon)
- **Autenticación**: NextAuth.js con Google OAuth2
- **Estilos**: Tailwind CSS, shadcn/ui
- **Estado**: Zustand
- **Validación**: Zod
- **Notificaciones**: Notyf
- **Despliegue**: Vercel (Edge Functions)

### 🔄 Flujo de Autenticación
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant NextAuth
    participant Google
    participant DB
    
    User->>Frontend: Click "Iniciar con Google"
    Frontend->>NextAuth: signIn("google")
    NextAuth->>Google: Redirect to OAuth
    Google->>NextAuth: Authorization code
    NextAuth->>Google: Exchange for tokens
    Google->>NextAuth: User profile
    NextAuth->>DB: Create/update user
    NextAuth->>Frontend: JWT token + session
    Frontend->>User: Redirect to callback URL
```

## 🚀 Getting Started

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Cuenta de Google para OAuth (para desarrollo)

### Instalación
1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/min-commerce-nextjs.git
   cd min-commerce-nextjs
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o
   yarn install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Editar `.env` con tus credenciales:
   ```env
   # Base de datos
   DATABASE_URL="postgresql://usuario:password@localhost:5432/mincommerce"
   
   # Autenticación
   NEXTAUTH_SECRET="tu-secreto-aqui"
   AUTH_GOOGLE_ID="tu-google-client-id"
   AUTH_GOOGLE_SECRET="tu-google-client-secret"
   
   # Aplicación
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   ```

4. **Configurar base de datos**
   ```bash
   # Generar cliente Prisma
   npx prisma generate
   
   # Ejecutar migraciones
   npx prisma db push
   
   # (Opcional) Poblar con datos de ejemplo
   npx prisma db seed
   ```

5. **Iniciar aplicación**
   ```bash
   npm run dev
   # o
   yarn dev
   ```

   Visitar `http://localhost:3000` en tu navegador.

## 📋 Roles y Permisos

### 🛡️ Rol de Administrador
- **Email**: `erick.verde@unmsm.edu.pe`
- **Permisos**:
  - Acceso completo al panel administrativo
  - Gestión de usuarios y logs de sesión
  - Estadísticas avanzadas del sistema
  - Acceso a todas las funcionalidades del catálogo

### 👤 Rol de Usuario
- **Email**: Cualquier otro email de Google
- **Permisos**:
  - Acceso al catálogo de productos
  - Gestión de carrito de compras
  - Creación y seguimiento de órdenes
  - Perfil personalizado

### 🌐 Rutas Protegidas

#### Rutas Públicas
- `/` - Página de bienvenida
- `/welcome` - Página de bienvenida para usuarios autenticados
- `/api/auth/signin` - Endpoint de login
- `/unauthorized` - Página de acceso denegado

#### Rutas de Usuario Autenticado
- `/catalog` - Catálogo de productos (protegido)
- `/profile` - Perfil de usuario
- `/cart` - Carrito de compras
- `/orders` - Historial de órdenes
- `/checkout` - Proceso de compra

#### Rutas Administrativas
- `/admin` - Panel principal de administración
- `/admin/logs` - Logs de sesión de usuarios
- `/api/admin/*` - Endpoints administrativos

## 🔧 Configuración Avanzada

### 🗄️ Base de Datos
El proyecto utiliza PostgreSQL con Prisma ORM. El esquema incluye:

- **Users**: Información de usuarios con roles
- **Products**: Catálogo completo con categorías y stock
- **Orders**: Sistema de órdenes con items
- **Cart**: Carrito de compras persistente
- **SessionLogs**: Registro de actividad de usuarios

### 🔄 Estrategia de Autenticación Híbrida
El sistema implementa una estrategia híbrida:

1. **JWT para Middleware**: Tokens JWT para validación rápida en Edge Functions
2. **Database para Persistencia**: Sesiones almacenadas en PostgreSQL con PrismaAdapter
3. **Callbacks para Logging**: Registro automático de actividad de usuarios

### 🛡️ Middleware de Protección
Sistema centralizado de control de acceso:

```typescript
// src/lib/access-control.ts
export function checkAccess(path: string, role: UserRole, isAuthenticated: boolean) {
  // Lógica centralizada de verificación de permisos
}
```

Características:
- Redirecciones automáticas según rol
- Protección de rutas a nivel de Edge
- Optimizado para Vercel Edge Functions

## 📊 Panel Administrativo

### 📈 Estadísticas en Tiempo Real
- **Productos**: Total y categorías
- **Órdenes**: Conteo, revenue y tendencias
- **Usuarios**: Registrados y actividad reciente
- **Logs**: Actividad de sesión con filtros

### 📋 Logs de Sesión
Registro completo de actividad:
- **Login**: Timestamp, usuario, provider
- **Logout**: Timestamp y usuario
- **Filtros**: Por usuario, rango de fechas
- **Paginación**: Optimizada para grandes volúmenes

## 🧪 Testing

### 🧪 Ejecutar Tests
```bash
# Ejecutar todos los tests
npm run test

# Ejecutar con cobertura
npm run test:coverage

# Tests E2E
npm run test:e2e
```

### 📊 Flujos de Testing
1. **Flujo de Usuario Regular**:
   - Login con Google → Acceso a catálogo
   - Ver perfil personal → Gestión de cuenta
   - Intento de acceso a `/admin` → Redirección automática

2. **Flujo de Administrador**:
   - Login como admin → Acceso a panel administrativo
   - Ver usuarios registrados → Estadísticas
   - Revisar logs → Actividad de sesiones

3. **Protección de Rutas**:
   - Acceso sin login → Redirección automática
   - Usuario sin permisos → Mensaje de acceso denegado
   - Sesión válida → Acceso normal

## 🚀 Despliegue

### 🌐 Vercel (Recomendado)
```bash
# Construir para producción
npm run build

# Desplegar en Vercel
vercel --prod
```

Variables de entorno requeridas en Vercel:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`
- `NEXTAUTH_URL`

### 🐳 Docker (Alternativo)
```bash
# Construir imagen
docker build -t min-commerce .

# Ejecutar contenedor
docker run -p 3000:3000 --env-file .env min-commerce
```

## 🔍 Solución de Problemas

### 🐛 Issues Comunes

#### Problemas de Autenticación
- **Error**: "Callback URL mismatch"
- **Solución**: Verificar `NEXTAUTH_URL` en producción

#### Problemas de Base de Datos
- **Error**: "Connection refused"
- **Solución**: Verificar `DATABASE_URL` y conexión de red

#### Problemas de Build
- **Error**: "Module not found"
- **Solución**: `npm install` y limpiar caché de Node.js

### 📞 Obtener Ayuda
- **Issues**: Reportar en [GitHub Issues](https://github.com/tu-usuario/min-commerce-nextjs/issues)
- **Discusiones**: [GitHub Discussions](https://github.com/tu-usuario/min-commerce-nextjs/discussions)
- **Email**: soporte@min-commerce.com

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor:

1. **Hacer Fork** del proyecto
2. **Crear Branch** (`git checkout -b feature/nueva-funcionalidad`)
3. **Hacer Commit** (`git commit -m 'Agregar nueva funcionalidad'`)
4. **Hacer Push** (`git push origin feature/nueva-funcionalidad`)
5. **Crear Pull Request**

### 📋 Guía de Estilo
- Seguir convenciones de código existentes
- Incluir tests para nuevas funcionalidades
- Actualizar documentación relevante

## 📊 Historial de Cambios

### v2.0.0 (Actual)
- ✅ Implementación completa de flujo de usuario basado en roles
- ✅ Página de bienvenida personalizada
- ✅ Redirección inteligente post-autenticación
- ✅ Catálogo protegido para usuarios autenticados
- ✅ Sistema de control de acceso centralizado
- ✅ Botón de cerrar sesión corregido

### v1.0.0
- 🎉 Versión inicial estable
- ✅ Autenticación con Google OAuth2
- ✅ Sistema de roles (admin/user)
- ✅ Middleware de protección de rutas
- ✅ Logging de sesiones en base de datos
- ✅ Panel administrativo con estadísticas
- ✅ CRUD completo de productos
- ✅ Carrito de compras persistente
- ✅ Sistema de órdenes

---

**Desarrollado con ❤️ para la comunidad de e-commerce**
