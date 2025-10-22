"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { checkoutSchema, CheckoutFormData } from '@/schemas/cart'
import { Loader2, ShoppingBag } from 'lucide-react'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface CheckoutFormProps {
  userName: string
  userEmail: string
  userId: string
  cartItems: CartItem[]
  total: number
}

export default function CheckoutForm({ userName, userEmail, userId, cartItems, total }: CheckoutFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: userName,
      customerEmail: userEmail,
    },
  })

  const handleSubmit = async (data: CheckoutFormData) => {
    if (cartItems.length === 0) {
      alert('El carrito está vacío')
      return
    }

    setIsSubmitting(true)
    const apiUrl = '/api/orders'

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({ id: parseInt(item.id), quantity: item.quantity })),
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          userId: userId, // Enviar el ID del usuario
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al procesar la orden')
      }

      const orderData = await response.json()
      console.log('Orden creada:', orderData)

      try {
        sessionStorage.setItem('order-success', '1')
        sessionStorage.setItem('last-order-id', orderData.id.toString())
      } catch { }

      // Pequeña demora para asegurar que la base de datos complete la transacción
      setTimeout(() => {
        router.push('/orders')
      }, 300)
      return
    } catch (error) {
      console.error('Error:', error)
      alert(error instanceof Error ? error.message : 'Error desconocido')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="customerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-text-secondary'>Nombre Completo</FormLabel>
              <FormControl>
                <Input placeholder="Juan Pérez" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="customerEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-text-secondary'>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="juan@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/*
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center text-sm text-blue-700">
            <ShoppingBag className="w-4 h-4 mr-2" />
            <span>
              Esta compra será asociada a tu cuenta de Google: <strong>{userEmail}</strong>
            </span>
          </div>
        </div>
          */}


        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 text-base font-medium"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Procesando...
            </>
          ) : (
            <>
              <ShoppingBag className="h-5 w-5 mr-2" />
              Completar Compra
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}