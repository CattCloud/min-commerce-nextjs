"use client"

import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { ShoppingCart, LogIn } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { useRouter } from 'next/navigation'

interface BuyButtonProps {
  product: {
    id: string
    name: string
    description: string
    price: number
    imageUrl: string
    category: string
    stock: number
  }
  className?: string
}

export default function BuyButton({ product, className = "" }: BuyButtonProps) {
  const { data: session } = useSession()
  const { addToCart } = useCartStore()
  const router = useRouter()

  const handleBuyClick = async () => {
    if (!session) {
      // Redirigir a login con callback URL
      router.push('/api/auth/signin?callbackUrl=/')
      return
    }

    // Usuario autenticado - agregar al carrito
    await addToCart(product)
  }

  return (
    <Button
      onClick={handleBuyClick}
      className={`w-full ${className}`}
      size="lg"
    >
      {session ? (
        <>
          <ShoppingCart className="w-4 h-4 mr-2" />
          Agregar al Carrito
        </>
      ) : (
        <>
          <LogIn className="w-4 h-4 mr-2" />
          Inicia sesión para Comprar
        </>
      )}
    </Button>
  )
}