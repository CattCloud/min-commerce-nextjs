"use client";
import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../../store/useCartStore';
import { formatPrice } from '../utils/price';
import CartItemActions from '../components/CartItemActions';
import { ShoppingCart } from 'lucide-react';
import { Button } from '../../components/ui/button';

/**
 * Componente de la página del carrito de compras (/cart).
 * Muestra la lista de productos agregados y el resumen de la compra.
 */
const CartPage: React.FC = () => {
  const { cartItems, loadCartFromDB } = useCartStore();
  const router = useRouter();

  // Forzar carga del carrito al montar la página
  React.useEffect(() => {
    console.log('CartPage: mounted, loading cart from DB')
    loadCartFromDB()
  }, [loadCartFromDB])

  console.log('CartPage: render with cartItems', { count: cartItems.length, items: cartItems })

  // Calcular el total de la compra (incluyendo un impuesto simulado)
  const totals = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxRate = 0.15; // 15% de impuesto simulado
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    
    return { subtotal, tax, total };
  }, [cartItems]);

  return (
    <div className="container mx-auto max-w-7xl px-4 pt-4 min-h-screen">
      <h2 className="text-2xl font-extrabold text-text-inverse mb-8 border-b border-border-default pb-3">
        Tu Carrito de Compras
      </h2>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 flex flex-col items-center">
          <ShoppingCart size={30} className="mb-4 text-center text-text-muted" />
          <p className="text-xl text-text-inverse font-semibold">Tu carrito está vacío.</p>
          <p className="text-md text-text-inverse mt-2">¡Explora nuestro catálogo y añade algo increíble!</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          
          
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <CartItemActions key={item.id} item={item} />
            ))}
          </div>
          
         
          <div className="lg:col-span-1 sticky top-24 h-fit">
            <div className="bg-bg-card p-6  shadow-2xl border border-border-default space-y-4">
              <h3 className="text-2xl font-bold text-text-primary mb-4">Resumen del Pedido</h3>
              
              <div className="space-y-2 text-text-secondary">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatPrice(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Impuestos (15%):</span>
                  <span>{formatPrice(totals.tax)}</span>
                </div>
              </div>

              <div className="border-t border-border-default pt-4 flex justify-between text-xl font-extrabold text-primary-500">
                <span>Total Estimado:</span>
                <span>{formatPrice(totals.total)}</span>
              </div>
              
              
              <Button
                variant="secondary"
                size="lg"
                className="w-full mt-6 font-bold"
                onClick={() => router.push('/checkout')}
              >
                Proceder al Pago
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;