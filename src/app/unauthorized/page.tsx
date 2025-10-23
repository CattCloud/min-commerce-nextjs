"use client"

import { ShieldX, ArrowLeft, Home } from "lucide-react"
import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-bg-body flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icono de acceso denegado */}
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 rounded-full p-6">
            <ShieldX className="h-16 w-16 text-red-600" />
          </div>
        </div>

        {/* Título y descripción */}
        <h1 className="text-3xl font-bold text-text-inverse mb-4">
          Acceso Denegado
        </h1>
        
        <p className="text-text-muted mb-8">
          Lo sentimos, no tienes los permisos necesarios para acceder a esta página. 
          Esta área está restringida para administradores del sistema.
        </p>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer bg-[var(--color-primary-500)] text-[var(--color-bg-app)] hover:bg-[var(--color-primary-600)] h-10 px-4 py-2 w-full sm:w-auto"
          >
            <Home className="h-4 w-4 mr-2" />
            Ir al Inicio
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer text-text-primary border-[var(--color-border-default)] bg-[var(--color-bg-app)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] h-10 px-4 py-2 w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver Atrás
          </button>
        </div>

      </div>
    </div>
  )
}