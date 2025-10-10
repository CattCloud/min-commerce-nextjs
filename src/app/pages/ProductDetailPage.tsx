import { useState } from 'react';
import { redirect } from 'next/navigation';
import { useParams } from 'next/navigation'; // Hook de Next.js para leer parámetros
import { ShoppingCart } from 'lucide-react';
import { products } from '../data/products'; 
import { formatPrice } from '../utils/price';
import { useCart } from '../context/cart/CartContext';
import QuantitySelector from '../components/QuantitySelector'; 


const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);

  // Buscar el producto por ID
  const product = products.find(p => p.id === id);

  // Si el producto no se encuentra, redirigimos al inicio
  if (!product) {
    redirect('/');
  }

  // Manejador para añadir al carrito
  const handleAddToCart = () => {
    addToCart(product, quantity);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000); // Ocultar notificacin despus de 3s
  };

  return (
    <div className="container mx-auto px-4 pt-4">
      <div className="bg-bg-card p-8 shadow-2xl border border-border-default">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          
        
          <div className="flex justify-center items-center p-4 bg-bg-app">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full max-h-[450px] object-contain rounded-lg"
            />
          </div>

          
          <div className="flex flex-col space-y-6">
            <h1 className="text-4xl font-extrabold text-text-primary">{product.name}</h1>
            
            <p className="text-2xl font-bold text-primary-500">
              {formatPrice(product.price)}
              {product.onSale && <span className="ml-4 text-secondary-500 font-semibold"> (En Oferta)</span>}
            </p>

            <p className="text-text-secondary leading-relaxed">
              {product.description}
            </p>

            <p className="text-sm uppercase text-text-muted font-extrabold">
              Categoria: {product.category}
            </p>

            <hr className="border-border-default" />

            {/* Selector de Cantidad */}
            <div className="flex items-center space-x-4">
              <span className="text-text-primary font-semibold">Cantidad:</span>
              <QuantitySelector 
                quantity={quantity} 
                onUpdate={setQuantity}
              />
            </div>
            
            
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center w-full p-4 
                         bg-primary-500 text-bg-card font-extrabold text-lg 
                         hover:bg-primary-dark transition-colors 
                         focus:ring-4 focus:ring-primary-500 focus:ring-opacity-50 cursor-pointer"
            >
              <ShoppingCart size={24} className="mr-3" />
              Añadir al Carrito
            </button>
            
          </div>
        </div>
      </div>
      
      {/* Notificacin de exito */}
      {showNotification && (
        <div className="fixed bottom-10 right-10 bg-secondary-500 text-bg-card px-6 py-3 font-bold shadow-lg transition-opacity duration-500 z-50">{product.name} ha sido añadido al carrito</div>
      )}
    </div>
  );
};

export default ProductDetailPage;