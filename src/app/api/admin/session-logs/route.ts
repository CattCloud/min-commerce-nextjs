import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const logs = await prisma.sessionLog.findMany({
      include: {
        user: { select: { email: true, name: true } }
      },
      orderBy: { timestamp: 'desc' },
      take: 100
    })

    return NextResponse.json({ logs })
  } catch (error) {
    console.error('Error fetching session logs:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}