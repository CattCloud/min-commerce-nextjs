"use client"
import { Trash2 } from 'lucide-react';
import { useCart } from '../context/cart/CartContext';
import type { CartItem } from '../models/cart';
import QuantitySelector from './QuantitySelector';
import { formatPrice } from '../utils/price';


interface CartItemActionsProps {
  item: CartItem;
}

/**
 * Muestra el producto, el selector de cantidad y el botón de eliminar,
 * usando el Contexto del Carrito para las acciones.
 */
const CartItemActions: React.FC<CartItemActionsProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleUpdateQuantity = (newQuantity: number) => {
    // Si la nueva cantidad es 0, la lógica de updateQuantity en el context
    // lo eliminará automáticamente.
    updateQuantity(item.id, newQuantity);
  };

  const handleRemove = () => {
    // Elimina el item por completo
    removeFromCart(item.id);
  };

  return (
    <div className="flex items-center space-x-6 p-4 border border-border-default  bg-bg-card transition-shadow hover:shadow-lg">
      
      {/* 1. Imagen y Nombre del Producto */}
      <div className="flex items-center flex-grow space-x-4 min-w-0">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-16 h-16 object-cover  flex-shrink-0"
        />
        <div className="min-w-0">
          <p className="text-lg font-bold text-text-primary truncate">{item.name}</p>
          <p className="text-md text-text-secondary font-semibold">Total: {formatPrice(item.quantity*item.price)}</p>
        </div>
      </div>

      {/* Selector de Cantidad */}
      <div className="flex-shrink-0">
        <QuantitySelector 
          quantity={item.quantity} 
          onUpdate={handleUpdateQuantity}
          minQuantity={0} // Permitimos llegar a 0 para que se active la eliminación automática
        />
      </div>

      {/* Botón Eliminar (Eliminación forzada) */}
      <button 
        onClick={handleRemove}
        className="cursor-pointer p-3  text-secondary-500 bg-secondary-900/50 hover:bg-secondary-900 transition-colors flex-shrink-0"
        aria-label="Eliminar producto del carrito"
      >
        <Trash2 size={20} />
      </button>
      
    </div>
  );
};

export default CartItemActions;
