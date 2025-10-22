import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { PrismaClient } from '@/prisma'

const prisma = new PrismaClient()


// GET - Obtener carrito del usuario autenticado
export async function GET() {
  try {
    const session = await auth()
    
    console.log('API Cart GET: session', { session: session?.user?.id })
    
    if (!session?.user?.id) {
      console.log('API Cart GET: unauthorized')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cartItems = await prisma.cart.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true,
            category: true,
            stock: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log('API Cart GET: found cart items', { count: cartItems.length, items: cartItems })

    // Transformar al formato que espera el frontend
    const formattedCartItems = cartItems.map((item) => ({
      id: item.productId.toString(),
      name: item.product.name,
      price: item.product.price,
      imageUrl: item.product.imageUrl,
      category: item.product.category,
      stock: item.product.stock,
      quantity: item.quantity
    }))

    console.log('API Cart GET: returning formatted items', { count: formattedCartItems.length })

    return NextResponse.json(formattedCartItems)
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// POST - Agregar/actualizar item en el carrito
export async function POST(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { productId, quantity = 1 } = body

    if (!productId || quantity <= 0) {
      return NextResponse.json({ error: 'Invalid product ID or quantity' }, { status: 400 })
    }

    // Verificar que el producto exista y tenga stock
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    if (product.stock < quantity) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 })
    }

    // Asegurar que el usuario exista en la base de datos
    // Primero buscar por email, luego por id
    let user = await prisma.user.findUnique({
      where: { email: session.user.email || '' }
    })
    
    if (!user) {
      // Si no existe por email, crearlo
      user = await prisma.user.create({
        data: {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.name || '',
          image: session.user.image || ''
        }
      })
    } else if (user.id !== session.user.id) {
      // Si existe pero con id diferente, actualizar el id
      user = await prisma.user.update({
        where: { id: user.id },
        data: { id: session.user.id }
      })
    }
    
    console.log('API Cart POST: user processed', { userId: user.id, email: user.email })

    // Upsert: crear o actualizar el item del carrito
    const cartItem = await prisma.cart.upsert({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: parseInt(productId)
        }
      },
      update: {
        quantity: { increment: quantity }
      },
      create: {
        userId: session.user.id,
        productId: parseInt(productId),
        quantity
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true,
            category: true,
            stock: true
          }
        }
      }
    })

    // Formatear respuesta
    const formattedCartItem = {
      id: cartItem.productId.toString(),
      name: cartItem.product.name,
      price: cartItem.product.price,
      imageUrl: cartItem.product.imageUrl,
      category: cartItem.product.category,
      stock: cartItem.product.stock,
      quantity: cartItem.quantity
    }

    return NextResponse.json(formattedCartItem)
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// DELETE - Limpiar carrito del usuario
export async function DELETE() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.cart.deleteMany({
      where: { userId: session.user.id }
    })

    return NextResponse.json({ message: 'Cart cleared successfully' })
  } catch (error) {
    console.error('Error clearing cart:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}