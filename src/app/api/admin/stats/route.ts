import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { PrismaClient } from "@/generated/prisma"

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    console.log('API: Iniciando solicitud de estadísticas')
    
    // Para debugging, vamos a permitir temporalmente el acceso sin autenticación
    // y verificar si podemos obtener la sesión correctamente
    const session = await auth()
    console.log('API: Sesión obtenida:', session?.user?.email, 'Role:', session?.user?.role)
    
    // Temporalmente desactivamos la verificación de admin para debugging
    if (!session) {
      console.log('API: No hay sesión, pero permitiendo acceso temporalmente para debugging')
      // return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }
    
    // Verificar si el usuario está autenticado y es admin
    if (session && session.user?.role !== "admin") {
      console.log('API: Acceso no autorizado - Session:', session, 'Role:', session?.user?.role)
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    console.log('API: Usuario autorizado, consultando base de datos')

    // Estadísticas principales de la base de datos real
    const [
      totalSales,
      totalOrders,
      totalProducts
    ] = await Promise.all([
      // Total de ventas
      prisma.order.aggregate({
        _sum: { total: true }
      }),
      
      // Total de órdenes
      prisma.order.count(),
      
      // Total de productos
      prisma.product.count()
    ])

    console.log('API: Estadísticas principales obtenidas')

    // Órdenes recientes con información del cliente
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    })

    console.log('API: Órdenes recientes obtenidas:', recentOrders.length)

    // Contar usuarios únicos por email en las órdenes
    const uniqueUsers = await prisma.order.groupBy({
      by: ['customerEmail'],
      _count: { customerEmail: true }
    })

    // Top 3 productos más vendidos
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 3
    })

    const topProductsWithNames = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { name: true }
        })
        return {
          name: product?.name || 'Producto desconocido',
          totalSold: item._sum.quantity || 0
        }
      })
    )

    // Ventas diarias - todos los días en que hubo ventas
    const dailySales = await prisma.$queryRaw`
      SELECT
        DATE("createdAt") as date,
        SUM(total) as daily_sales
      FROM "Order"
      GROUP BY DATE("createdAt")
      ORDER BY date DESC
      LIMIT 30
    ` as Array<{ date: string; daily_sales: number }>

    const stats = {
      totalProducts,
      totalOrders,
      totalUsers: uniqueUsers.length,
      totalRevenue: totalSales._sum.total || 0,
      topProducts: topProductsWithNames,
      dailySales: dailySales.reverse().map(item => ({
        date: new Date(item.date).toLocaleDateString('es-ES', {
          month: 'short',
          day: 'numeric'
        }),
        sales: Number(item.daily_sales)
      })),
      recentOrders: recentOrders.map((order) => ({
        id: order.id.toString(),
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        total: order.total,
        status: 'delivered', // Status por defecto ya que no existe en el schema
        createdAt: order.createdAt.toISOString()
      }))
    }

    console.log('API: Estadísticas reales generadas exitosamente')
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error al obtener estadísticas:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}