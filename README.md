# Min-Commerce Next.js

Una aplicación de e-commerce moderna construida con Next.js 15, TypeScript y Prisma, implementando un sistema completo de autenticación y autorización basado en roles.

##  Características Principales

###  Autenticación y Autorización
- **Login con Google OAuth2**: Integración completa con Google para autenticación de usuarios
- **Sistema de Roles**: Implementación de roles `admin` y `user` con control de acceso granular
- **Middleware de Protección**: Sistema centralizado de protección de rutas con redirecciones inteligentes
- **Logging de Sesiones**: Registro completo de actividad de usuarios (login/logout) en base de datos

###  Gestión de Productos
- **Catálogo Completo**: CRUD de productos con imágenes, categorías y gestión de stock
- **Detalles de Producto**: Páginas individuales con información completa y acciones de compra

###  Carrito de Compras
- **Gestión Persistente**: Carrito que persiste en base de datos con sincronización en tiempo real
- **Operaciones CRUD**: Agregar, actualizar y eliminar productos del carrito
- **Integración con Órdenes**: Flujo completo desde carrito hasta confirmación de compra

###  Panel Administrativo
- **Dashboard con Estadísticas**: Métricas en tiempo real de productos, órdenes, usuarios y revenue
- **Logs de Sesión**: Visualización completa de actividad de usuarios con filtros y paginación
- **Gestión de Usuarios**: Vista general de usuarios registrados y su actividad
- **Gráficos Interactivos**: Visualizaciones de datos con Chart.js para análisis de tendencias

###  Experiencia de Usuario
- **Diseño Responsivo**: Interfaz adaptada para todos los dispositivos
- **Componentes Modernos**: UI construida con shadcn/ui y Tailwind CSS
- **Estados de Carga**: Indicadores visuales durante operaciones asíncronas
- **Notificaciones**: Sistema de notificaciones en tiempo real con Notyf

##  Arquitectura Técnica

###  Estructura del Proyecto
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

###  Stack Tecnológico
- **Frontend**: Next.js 15, React 18, TypeScript
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de Datos**: PostgreSQL (Neon)
- **Autenticación**: NextAuth.js con Google OAuth2
- **Estilos**: Tailwind CSS, shadcn/ui
- **Estado**: Zustand
- **Validación**: Zod
- **Notificaciones**: Notyf
- **Despliegue**: Vercel (Edge Functions)

###  Flujo de Autenticación
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

##  Getting Started

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Cuenta de Google para OAuth (para desarrollo)

### Instalación
1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/CattCloud/min-commerce-nextjs
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

##  Roles y Permisos

###  Rol de Administrador
- **Email actual**: `erick.verde@unmsm.edu.pe`
- **Permisos**:
  - Acceso completo al panel administrativo
  - Gestión de usuarios y logs de sesión
  - Estadísticas avanzadas del sistema

###  Rol de Usuario
- **Email**: Cualquier otro email de Google
- **Permisos**:
  - Acceso al catálogo de productos
  - Gestión de carrito de compras
  - Creación y seguimiento de órdenes
  - Perfil personalizado

###  Rutas Protegidas

#### Rutas Públicas
- `/` - Página de bienvenida
- `/welcome` - Página de bienvenida al sistema
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

##  Configuración Avanzada

###  Base de Datos
El proyecto utiliza PostgreSQL con Prisma ORM. El esquema incluye:

- **Users**: Información de usuarios con roles
- **Products**: Catálogo completo con categorías y stock
- **Orders**: Sistema de órdenes con items
- **Cart**: Carrito de compras persistente
- **SessionLogs**: Registro de actividad de usuarios

###  Estrategia de Autenticación Híbrida
El sistema implementa una estrategia híbrida:

1. **JWT para Middleware**: Tokens JWT para validación rápida en Edge Functions
2. **Database para Persistencia**: Sesiones almacenadas en PostgreSQL con PrismaAdapter
3. **Callbacks para Logging**: Registro automático de actividad de usuarios

###  Middleware de Protección
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

##  Panel Administrativo

###  Estadísticas en Tiempo Real
- **Productos**: Total y categorías
- **Órdenes**: Conteo, revenue y tendencias
- **Usuarios**: Registrados y actividad reciente

###  Logs de Sesión
Registro completo de actividad:
- **Login**: Timestamp, usuario, provider
- **Logout**: Timestamp y usuario


