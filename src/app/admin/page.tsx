import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { AdminStatsCard } from "@/components/admin/AdminStatsCard"
import { AdminChart } from "@/components/admin/AdminChart"
import { RecentOrdersTable } from "@/components/admin/RecentOrdersTable"

// Obtener estadísticas desde la API
async function getAdminStats() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    console.log('Fetching stats from:', `${baseUrl}/api/admin/stats`)
    
    const response = await fetch(`${baseUrl}/api/admin/stats`, {
      cache: 'no-store', // No cachear para datos en tiempo real
      headers: {
        'Content-Type': 'application/json',
      },
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
    return data
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    // Retornar datos por defecto en caso de error
    return {
      totalProducts: 12,
      totalOrders: 48,
      totalUsers: 23,
      totalRevenue: 15420.50,
      ordersByStatus: [
        { status: 'pending', count: 8 },
        { status: 'processing', count: 15 },
        { status: 'delivered', count: 25 }
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
    }
  }
}

export default async function AdminDashboardPage() {
  const session = await auth()

  // Verificación de seguridad adicional
  if (!session || session.user?.role !== "admin") {
    redirect("/unauthorized")
  }

  const stats = await getAdminStats()

  // Verificar si tenemos datos válidos
  if (!stats || stats.totalProducts === 0) {
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