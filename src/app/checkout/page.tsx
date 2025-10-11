"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '../../store/useCartStore';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema, CheckoutFormData } from '../../schemas/cart';
import { formatPrice } from '../utils/price';

const CheckoutPage: React.FC = () => {
  const { cartItems } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: '',
      customerEmail: '',
    },
  });

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = async (data: CheckoutFormData) => {
    if (cartItems.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    setIsSubmitting(true);
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const apiUrl = `${BASE_URL}/api/orders`;

    if (!BASE_URL) {
      console.error("BASE_URL no está configurada, usando ruta relativa.");
    }
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
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al procesar la orden');
      }

      await response.json();
      try { sessionStorage.setItem('order-success', '1'); } catch { }
      router.push('/orders');
      return;
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 pt-4">
        <h1 className="text-2xl font-bold mb-4">Pago del pedido</h1>
        <p>Tu carrito está vacío. <Link href="/" className="text-primary-500">Volver al catálogo</Link></p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-4 ">
      <h1 className="text-2xl font-bold mb-4">Pago del pedido</h1>

      <div className="grid md:grid-cols-2 gap-8">

        {/* Formulario */}
        <div className="bg-bg-card p-6 rounded-lg border border-border-default text-text-primary">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Completo</FormLabel>
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="juan@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Procesando...' : 'Completar Compra'}
              </Button>
            </form>
          </Form>
        </div>
        {/* Resumen del Pedido */}
        <div className="bg-bg-card p-6 rounded-lg border text-white border-border-default">
          <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>
          <div className="space-y-2 text-text-secondary">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between">
                <span>{item.name} x {item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <hr className="border-border-default" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CheckoutPage;