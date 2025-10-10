"use client"
import Link from 'next/link';
import { Trash2, X } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { formatPrice } from '../utils/price';

interface CartDropdownProps {
  onClose: () => void;
}


const CartDropdown: React.FC<CartDropdownProps> = ({ onClose }) => {
  const { cartItems, clearCart } = useCartStore();

  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    
    <div
      id="cart-dropdown"
      className="absolute right-0 mt-3 w-80 bg-bg-app border border-border-default shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300"
      onClick={(e) => e.stopPropagation()} // Previene que el clic cierre el dropdown
    >
      <div className="p-4 border-b border-border-default flex justify-between items-center">
        <h3 className="text-xl font-bold text-text-primary">Tu Carrito ({cartItems.length} items)</h3>
        <button onClick={onClose} className="text-text-secondary hover:text-text-light p-1 rounded-full hover:bg-bg-hover">
          <X size={20} />
        </button>
      </div>

      {cartItems.length === 0 ? (
        <div className="p-6 text-center text-text-secondary">
          Tu carrito está vacío
        </div>
      ) : (
        <>
          
          <div className="max-h-60 overflow-y-auto divide-y divide-border-default">
            {cartItems.slice(0, 3).map(item => ( // Mostrar un máximo de 3 items en el resumen
              <div key={item.id} className="p-3 flex items-center space-x-3 hover:bg-bg-hover transition-colors">
                <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-text-primary text-sm font-semibold truncate">{item.name}</p>
                  <p className="text-text-secondary text-xs">
                    {item.quantity} x {formatPrice(item.price)}
                  </p>
                </div>
              </div>
            ))}
            {cartItems.length > 3 && (
              <div className="p-3 text-center text-text-muted text-sm">
                ... y {cartItems.length - 3} productos más
              </div>
            )}
          </div>

          {/* Totales y Acciones */}
          <div className="p-4 space-y-3">
            <div className="flex justify-between text-lg font-bold text-text-primary">
              <span>Subtotal:</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            
            {/* Botones de Acción */}
            <div className="space-y-2">
              <Link href="/cart" onClick={onClose}
                    className="flex justify-center w-full p-2 bg-primary-500 cursor-pointer
                               text-bg-card font-semibold hover:bg-primary-dark transition-colors">
                Ver Carrito Completo
              </Link>
              <button 
                onClick={() => { clearCart(); onClose(); }}
                className="flex items-center justify-center w-full p-2  border  cursor-pointer
                           border-secondary-500 text-secondary-500 hover:bg-secondary-800 transition-colors text-sm"
              >
                <Trash2 size={16} className="mr-2" />
                Vaciar Carrito
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartDropdown;