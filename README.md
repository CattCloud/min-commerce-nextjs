# Min-Commerce Next.js

## Tecnologías Utilizadas

- **Next.js 15**: Framework de React para aplicaciones web modernas.
- **TypeScript**: Tipado estático para un desarrollo más seguro y mantenible.
- **Prisma**: ORM para interactuar con la base de datos PostgreSQL en Neon.
- **Zustand**: Gestión de estado global simple y eficiente.
- **Zod**: Validación de esquemas para formularios y datos.
- **React Hook Form**: Manejo de formularios con validación integrada.
- **shadcn/ui**: Componentes estilizados y accesibles para la interfaz de usuario.
- **Notyf**: Notificaciones elegantes y personalizables.

## Instrucciones de Instalación Local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/min-commerce-nextjs.git
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno:
   - Crea un archivo `.env` en la raíz del proyecto.
   - Agrega la variable `DATABASE_URL` con tu cadena de conexión a Neon:
     ```plaintext
     DATABASE_URL="postgresql://tu-usuario:tu-contraseña@tu-host:tu-puerto/tu-base-de-datos?sslmode=require&channel_binding=require"
     ```
   - Agrega la variable `NEXT_PUBLIC_BASE_URL` con la URL base de tu aplicación:
     ```plaintext
     NEXT_PUBLIC_BASE_URL=http://localhost:3000
     ```
4. Genera el cliente de Prisma:
   ```bash
   npx prisma generate
   ```
5. Inicia la aplicación:
   ```bash
   npm run dev
   ```
6. Abre tu navegador y ve a `http://localhost:3000`.

## Funcionalidades Extra Implementadas

- Notificaciones de éxito al agregar productos al carrito y completar una compra usando Notyf.
- Uso de `Image` de Next.js para optimizar las imágenes y mejorar el rendimiento.
- Validación de formularios con Zod y React Hook Form.
- Gestión de estado global con Zustand y persistencia en localStorage.
- Despliegue en Vercel con configuración de variables de entorno y binaryTargets para Prisma.

## Estructura del Proyecto

- `src/app`: Componentes principales de la aplicación (páginas, API routes, etc.).
- `src/components`: Componentes reutilizables de la UI.
- `src/schemas`: Esquemas de validación con Zod.
- `src/store`: Lógica de gestión de estado con Zustand.
- `prisma`: Configuración y modelo de datos de Prisma.

## Despliegue

El proyecto está desplegado en Vercel: [https://min-commerce-nextjs-cb7nzrqb8-cattclouds-projects.vercel.app/](https://min-commerce-nextjs-cb7nzrqb8-cattclouds-projects.vercel.app/).

