"use client"
import { useState } from 'react';
import Link from 'next/link';
import type { Product } from '../models/products';
import { ShoppingCart, Heart } from 'lucide-react';
import ProductTag from './ProductTag';
import { formatPrice } from '../utils/price';
import { useCartStore } from '../../store/useCartStore';
import { Card, CardContent, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {

  const [showNotification, setShowNotification] = useState(false);
  const { addToCart } = useCartStore();
  const productUrl = `/product/${product.id}`;

  const cardClasses = `
    bg-bg-main 
    border border-border-default 
    p-4 
    transition-all duration-300 
    hover:border-primary-500
    hover:shadow-neon-sm
    max-w-xs w-full
    relative 
    flex flex-col
    cursor-pointer
  `;

  const shadowClass = 'shadow-xl shadow-bg-app/50';

  // Manejador para añadir al carrito
  const handleAddToCart = () => {
    addToCart(product, 1);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000); // Ocultar notificacin despus de 3s
  };

  return (

    <Card className={`${cardClasses} ${shadowClass} relative`}>

      {product.onSale && (
        <ProductTag />
      )}

      <button className="absolute top-2 right-2 p-2 bg-bg-hover rounded-full text-text-light hover:text-primary-500 transition-colors z-10">
        <Heart size={20} fill="currentColor" />
      </button>

      <CardContent className="p-4">
        <Link href={productUrl} className="flex flex-col flex-grow min-h-0">
          <div className="flex justify-center items-center h-56 mb-4">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-contain rounded-md transform hover:scale-[1.03] transition-transform duration-500"
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/300x200/1A1A1A/757575?text=Image+Missing';
              }}
            />
          </div>

          <div className="flex flex-col flex-grow">
            <h3 className="text-text-primary text-xl font-bold mb-1 line-clamp-2">{product.name}</h3>
            <p className="text-text-muted text-sm font-semibold uppercase tracking-wider mb-3">{product.category}</p>
          </div>
        </Link>
      </CardContent>

      <CardFooter className="flex justify-between items-center pt-2">
        <p className={
          product.onSale
            ? "text-primary-500 text-3xl font-extrabold"
            : "text-text-primary text-2xl font-bold"
        }>
          {formatPrice(product.price)}
        </p>

        <Button onClick={() => handleAddToCart()} variant="default" size="default">
          <ShoppingCart size={20} className="mr-2" />
          Comprar
        </Button>
      </CardFooter>

      {/* Notificacin de exito */}
      {showNotification && (
        <div className="fixed bottom-10 right-10 bg-secondary-500 text-bg-card px-6 py-3 font-bold shadow-lg transition-opacity duration-500 z-50">
          {product.name} ha sido añadido al carrito.
        </div>
      )}
    </Card>
  );
};

export default ProductCard;