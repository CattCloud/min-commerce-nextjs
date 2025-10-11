import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { formatPrice } from '../utils/price';
import { Calendar, User, Mail } from 'lucide-react';
import OrdersNotifier from './OrdersNotifier';

interface OrderItem {
  id: number;
  quantity: number;
  product: {
    name: string;
    price: number;
  };
}

interface Order {
  id: number;
  total: number;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  orderItems: OrderItem[];
}

export default async function OrdersPage() {
  const res = await fetch('/api/orders', {
    cache: 'no-store',
  });

  if (!res.ok) {
    return (
      <div className="container mx-auto px-4 pt-4">
        <h1 className="text-2xl font-bold mb-4">Historial de Órdenes</h1>
        <p>Error al cargar las órdenes.</p>
      </div>
    );
  }

  const orders = await res.json();

  return (
    <div className="container mx-auto px-4 pt-4">
      <OrdersNotifier />
      <h1 className="text-2xl font-bold mb-4">Historial de Órdenes</h1>

      {orders.length === 0 ? (
        <p>No tienes órdenes aún.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order: Order) => (
            <Card key={order.id} className="bg-bg-card p-4">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span className='text-text-primary'>Orden #{order.id}</span>
                  <span className="text-lg font-bold text-primary-500">{formatPrice(order.total)}</span>
                </CardTitle>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-text-secondary">
                    <Calendar size={16} />
                    <span>Fecha: {new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-text-secondary">
                    <User size={16} />
                    <span>Cliente: {order.customerName}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-text-secondary">
                    <Mail size={16} />
                    <span>Correo: {order.customerEmail}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="text-lg font-semibold mb-2 text-text-primary">Productos:</h3>
                <div className="space-y-1">
                  {order.orderItems.map((item: OrderItem) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className='text-text-secondary'>{item.product.name} x {item.quantity}</span>
                      <span className='text-primary-300'>{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}