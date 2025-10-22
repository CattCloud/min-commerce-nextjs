"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import CheckoutForm from "@/components/CheckoutForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/useCartStore"
import { formatPrice } from "@/app/utils/price"
import Link from "next/link"
import { ShoppingBag, User, Mail } from "lucide-react"
import { useEffect } from "react"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

export default function CheckoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { cartItems, loadCartFromDB } = useCartStore()
  
  // Si no hay sesión, redirigir a login
  useEffect(() => {
    if (!session) {
      router.push("/api/auth/signin?callbackUrl=/checkout")
    }
  }, [session, router])
  
  // Cargar carrito al montar
  useEffect(() => {
    if (session?.user?.id) {
      loadCartFromDB()
    }
  }, [session?.user?.id, loadCartFromDB])
  
  const total = cartItems.reduce((sum, item: CartItem) => sum + (item.price * item.quantity), 0);

  // Mostrar loading mientras no hay sesión o no hay carrito cargado
  if (!session) {
    return (
      <div className="container mx-auto px-4 pt-4">
        <div className="max-w-md mx-auto text-center">
          <Card className="bg-bg-card p-8">
            <CardHeader>
              <CardTitle className="text-xl text-text-primary">
                Cargando...
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary">
                Redirigiendo al login...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 pt-4">
        <div className="max-w-md mx-auto text-center">
          <Card className="bg-bg-card p-8">
            <CardHeader>
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-gray-400" />
              </div>
              <CardTitle className="text-xl text-text-primary">
                Carrito Vacío
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary mb-6">
                Tu carrito está vacío. Agrega algunos productos antes de continuar.
              </p>
              <Link href="/">
                <Button className="w-full">
                  Volver al Catálogo
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 pt-4">
      <h1 className="text-2xl font-bold mb-2">Pago del Producto</h1>


      <div className="grid md:grid-cols-3 gap-8">
        {/* Formulario - 2 columnas */}
        <div className="md:col-span-2">
          <Card className="bg-bg-card p-6">
            <CardHeader>
              <CardTitle className="flex items-center text-primary-500">
                <User className="w-5 h-5 mr-2"/>
                Información de Envío
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CheckoutForm
                userName={session?.user?.name || ""}
                userEmail={session?.user?.email || ""}
                userId={session?.user?.id || ""}
                cartItems={cartItems}
                total={total}
              />
            </CardContent>
          </Card>
        </div>
        
        {/* Resumen - 1 columna */}
        <div className="md:col-span-1">
          <Card className="bg-bg-card p-6 sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center text-primary-500">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Resumen del Pedido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cartItems.map((item: CartItem) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b border-border-default last:border-0">
                    <div className="flex-1">
                      <p className="font-medium text-text-primary">{item.name}</p>
                      <p className="text-sm text-text-secondary">Cantidad: {item.quantity}</p>
                    </div>
                    <span className="font-medium text-text-primary">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-border-default">
                <div className="flex justify-between items-center text-primary-500 text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}