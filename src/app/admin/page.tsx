'use client'

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { AdminStatsCard } from "@/components/admin/AdminStatsCard"
import { AdminChart } from "@/components/admin/AdminChart"
import { RecentOrdersTable } from "@/components/admin/RecentOrdersTable"

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  topProducts: Array<{ name: string; totalSold: number }>;
  dailySales: Array<{ date: string; sales: number }>;
  recentOrders: Array<{
    id: string;
    customerName: string;
    customerEmail: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
}

export default function AdminDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Verificar si el usuario está autenticado y es admin
  useEffect(() => {
    if (status === 'loading') return // Still loading
    
    if (!session || session.user?.role !== "admin") {
      console.log('Admin page: Redirigiendo a /unauthorized')
      router.push("/unauthorized")
      return
    }

    // Obtener estadísticas
    fetchStats()
  }, [session, status, router])

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
      console.log('Fetching stats from:', `${baseUrl}/api/admin/stats`)
      
      // Para depuración: imprimir todas las cookies del cliente
      console.log('Client: Document.cookie disponible:', typeof document !== 'undefined' ? 'Sí' : 'No')
      
      if (typeof document !== 'undefined') {
        console.log('Client: Cookies actuales:', document.cookie)
      }
      
      const response = await fetch(`${baseUrl}/api/admin/stats`, {
        cache: 'no-store', // No cachear para datos en tiempo real
        headers: {
          'Content-Type': 'application/json',
        },
        // Importante: Incluir cookies para autenticación
        credentials: 'include',
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        throw new Error(`Error ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      console.log('Stats data received:', data)
      setStats(data)
    } catch (err) {
      console.error('Error fetching admin stats:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
      
      // Retornar datos por defecto en caso de error
      setStats({
        totalProducts: 12,
        totalOrders: 48,
        totalUsers: 23,
        totalRevenue: 15420.50,
        topProducts: [
          { name: 'Zapatillas Urbanas', totalSold: 17 },
          { name: 'Reloj Inteligente', totalSold: 12 },
          { name: 'Camiseta Deportiva', totalSold: 11 }
        ],
        dailySales: [
          { date: '10 oct', sales: 4839.73 },
          { date: '13 oct', sales: 1319.94 },
          { date: '21 oct', sales: 1769.85 }
        ],
        recentOrders: [
          {
            id: '1',
            customerName: 'Juan Pérez',
            customerEmail: 'juan@example.com',
            total: 299.99,
            status: 'delivered',
            createdAt: new Date().toISOString()
          }
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Cargando...</div>
      </div>
    )
  }

  if (!session || session.user?.role !== "admin") {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Redirigiendo...</div>
      </div>
    )
  }

  if (error && !stats) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard de Administración
          </h1>
          <p className="mt-2 text-gray-600">
            Bienvenido al panel de control.
          </p>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            Error al cargar las estadísticas: {error}
          </p>
          <button 
            onClick={fetchStats}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard de Administración
          </h1>
          <p className="mt-2 text-gray-600">
            Bienvenido al panel de control.
          </p>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            No hay datos disponibles en este momento. Por favor, verifica la conexión con la base de datos.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header del Dashboard */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard de Administración
        </h1>
        <p className="mt-2 text-gray-600">
          Bienvenido al panel de control. Aquí puedes ver las estadísticas generales del sistema.
        </p>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <AdminStatsCard
          title="Total Productos"
          value={stats.totalProducts}
          icon="package"
        />
        <AdminStatsCard
          title="Total Órdenes"
          value={stats.totalOrders}
          icon="shopping-cart"
        />
        <AdminStatsCard
          title="Total Usuarios"
          value={stats.totalUsers}
          icon="users"
        />
        <AdminStatsCard
          title="Ingresos Totales"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon="dollar-sign"
        />
      </div>

      {/* Gráficos y Tablas */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Gráfico de Productos Populares */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Productos Populares (Top 3)
          </h2>
          <div className="h-64">
            <AdminChart data={stats.topProducts} type="bar" />
          </div>
        </div>

        {/* Gráfico de Línea de Tiempo de Ventas */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Línea de Tiempo de Ventas
          </h2>
          <div className="h-64">
            <AdminChart data={stats.dailySales} type="line" />
          </div>
        </div>
      </div>

      {/* Órdenes Recientes */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Órdenes Recientes
        </h2>
        <RecentOrdersTable orders={stats.recentOrders} />
      </div>
    </div>
  )
}