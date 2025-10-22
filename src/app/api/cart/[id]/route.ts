import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { PrismaClient } from '@/prisma'

const prisma = new PrismaClient()

// DELETE - Eliminar item específico del carrito
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // Eliminar el item del carrito del usuario
    const deletedItem = await prisma.cart.deleteMany({
      where: {
        userId: session.user.id,
        productId: parseInt(id)
      }
    })

    if (deletedItem.count === 0) {
      return NextResponse.json({ error: 'Item not found in cart' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Item removed from cart successfully' })
  } catch (error) {
    console.error('Error removing from cart:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// PUT - Actualizar cantidad de un item en el carrito
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { quantity } = body

    if (!id || quantity === undefined) {
      return NextResponse.json({ error: 'Product ID and quantity are required' }, { status: 400 })
    }

    if (quantity <= 0) {
      // Si la cantidad es 0 o menos, eliminar el item
      await prisma.cart.deleteMany({
        where: {
          userId: session.user.id,
          productId: parseInt(id)
        }
      })
      return NextResponse.json({ message: 'Item removed from cart' })
    }

    // Actualizar la cantidad
    const updatedItem = await prisma.cart.updateMany({
      where: {
        userId: session.user.id,
        productId: parseInt(id)
      },
      data: { quantity }
    })

    if (updatedItem.count === 0) {
      return NextResponse.json({ error: 'Item not found in cart' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Item quantity updated successfully' })
  } catch (error) {
    console.error('Error updating cart item:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}