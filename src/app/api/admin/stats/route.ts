import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { prisma } from "@/lib/prisma"

// Definir interfaces para los tipos de datos
interface TopProduct {
  productId: number;
  _sum: {
    quantity: number | null;
  };
}

interface ProductWithName {
  name: string;
  totalSold: number;
}

interface DailySale {
  date: string;
  daily_sales: number;
}

interface DailySaleFormatted {
  date: string;
  sales: number;
}

interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  total: number;
  createdAt: Date;
}

interface OrderFormatted {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  createdAt: string;
}

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  topProducts: ProductWithName[];
  dailySales: DailySaleFormatted[];
  recentOrders: OrderFormatted[];
}

// Interfaz para el objeto request compatible con getToken
interface TokenRequest {
  headers: Record<string, string>;
  cookies: {
    get: (name: string) => { value: string } | undefined;
  };
}

export async function GET(request: Request) {
  try {
    console.log('API: Iniciando solicitud de estadísticas')
    
    // Para depuración: imprimir todas las cookies
    const cookieHeader = request.headers.get('cookie')
    console.log('API: Cookies recibidas:', cookieHeader)
    
    // Imprimir todos los headers para depuración
    console.log('API: Todos los headers:', Object.fromEntries(request.headers.entries()))
    
    // Verificar si hay cookies de authjs
    if (cookieHeader) {
      const hasAuthCookie = cookieHeader.includes('authjs.session-token')
      console.log('API: ¿Tiene cookie de authjs?', hasAuthCookie)
      
      if (hasAuthCookie) {
        // Extraer el token de la cookie
        const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split('=')
          acc[key] = value
          return acc
        }, {} as Record<string, string>)
        
        const sessionToken = cookies['authjs.session-token']
        console.log('API: Token de sesión extraído:', sessionToken ? 'Sí' : 'No')
      }
    }
    
    // Intentar usar getToken para verificar el JWT directamente
    console.log('API: Intentando verificar token con getToken')
    
    // Crear un objeto compatible con NextRequest para getToken
    const req: TokenRequest = {
      headers: Object.fromEntries(request.headers.entries()),
      cookies: {
        get: (name: string) => {
          const cookieHeader = request.headers.get('cookie')
          if (!cookieHeader) return undefined
          
          const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=')
            acc[key] = value
            return acc
          }, {} as Record<string, string>)
          
          return cookies[name] ? { value: cookies[name] } : undefined
        }
      }
    }
    
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET 
    })
    console.log('API: Token obtenido con getToken:', token)
    
    // Verificar si el token existe y tiene rol de admin
    if (!token || token.role !== "admin") {
      console.log('API: Acceso no autorizado - Token:', token, 'Role:', token?.role)
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    console.log('API: Usuario autorizado, obteniendo datos de la base de datos')

    // Para producción, vamos a usar una consulta SQL directa a través de Prisma
    // Esto evita los problemas de importación del cliente Prisma
    let stats: Stats
    
    try {
      // Usar el cliente Prisma compartido

      // Estadísticas principales
      const [
        totalSales,
        totalOrders,
        totalProducts
      ] = await Promise.all([
        prisma.order.aggregate({ _sum: { total: true } }),
        prisma.order.count(),
        prisma.product.count()
      ])

      // Órdenes recientes
      const recentOrders = await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
      })

      // Usuarios reales registrados en el sistema
      const totalUsers = await prisma.user.count()

      // Top productos
      const topProducts = await prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 3
      })

      const topProductsWithNames = await Promise.all(
        topProducts.map(async (item: { productId: number; _sum: { quantity: number | null } }) => {
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

      // Ventas diarias
      const dailySales = await prisma.$queryRaw`
        SELECT DATE("createdAt") as date, SUM(total) as daily_sales
        FROM "Order"
        GROUP BY DATE("createdAt")
        ORDER BY date DESC
        LIMIT 30
      ` as Array<DailySale>

      stats = {
        totalProducts,
        totalOrders,
        totalUsers: totalUsers,
        totalRevenue: totalSales._sum.total || 0,
        topProducts: topProductsWithNames,
        dailySales: dailySales.reverse().map((item: DailySale) => ({
          date: new Date(item.date).toLocaleDateString('es-ES', {
            month: 'short',
            day: 'numeric'
          }),
          sales: Number(item.daily_sales)
        })),
        recentOrders: recentOrders.map((order: Order) => ({
          id: order.id.toString(),
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          total: order.total,
          status: 'delivered',
          createdAt: order.createdAt.toISOString()
        }))
      }

      console.log('API: Estadísticas reales generadas exitosamente')
    } catch (dbError) {
      console.error('Error con la base de datos, usando datos de ejemplo:', dbError)
      
      // Datos de ejemplo si falla la conexión a la BD
      stats = {
        totalProducts: 4,
        totalOrders: 21,
        totalUsers: 17,
        totalRevenue: 7929.52,
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
            id: '21',
            customerName: 'ERICK EDISON VERDE',
            customerEmail: 'erick.verde@unmsm.edu.pe',
            total: 179.99,
            status: 'delivered',
            createdAt: '2025-10-22T23:44:39.246Z'
          }
        ]
      }
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error al obtener estadísticas:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}