"use client";

import "notyf/notyf.min.css";
import { getNotyf } from "../../lib/notyf";
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { formatPrice } from '../utils/price';
import { useCartStore } from '../../store/useCartStore';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { quantitySchema, QuantityFormData } from '../../schemas/cart';

interface ProductDetailPageProps {
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    category: string;
    description: string;
    stock: number;
  };
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product }) => {
  const { addToCart } = useCartStore();

  const form = useForm<QuantityFormData>({
    resolver: zodResolver(quantitySchema),
    defaultValues: {
      quantity: 1,
    },
  });

  // Manejador para añadir al carrito
  const handleAddToCart = (data: QuantityFormData) => {
    addToCart({ ...product, id: product.id.toString() }, data.quantity);
    try {
      getNotyf().success(`${product.name} ha sido añadido al carrito`);
    } catch {}
  };

  return (
    <div className="container mx-auto px-4 pt-4">
      <div className="bg-bg-card p-8 shadow-2xl border border-border-default">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          
        
          <div className="flex justify-center items-center p-4 bg-bg-app relative h-[450px]">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-contain rounded-lg"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          
          <div className="flex flex-col space-y-6">
            <h1 className="text-4xl font-extrabold text-text-primary">{product.name}</h1>
            
            <p className="text-2xl font-bold text-primary-500">
              {formatPrice(product.price)}
            </p>

            <p className="text-text-secondary leading-relaxed">
              {product.description}
            </p>

            <p className="text-sm uppercase text-text-muted font-extrabold">
              Categoria: {product.category}
            </p>

            <hr className="border-border-default" />

            {/* Selector de Cantidad */}
            <form onSubmit={form.handleSubmit(handleAddToCart)}>
              <div className="space-y-2">
                <label htmlFor="quantity" className="text-text-primary font-semibold">Cantidad:</label>
                <Input
                  id="quantity"
                  type="number"
                  {...form.register("quantity", { valueAsNumber: true })}
                  className="w-20"
                />
                {form.formState.errors.quantity && (
                  <p className="text-sm font-medium text-destructive text-[var(--color-error)]">
                    {(() => {
                      const raw = String(form.formState.errors.quantity?.message || '');
                      const lower = raw.toLowerCase();
                      return (lower.includes('invalid input') || lower.includes('expected number') || lower.includes('nan'))
                        ? 'Ingrese un valor'
                        : raw;
                    })()}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full font-extrabold mt-4"
              >
                <ShoppingCart size={24} className="mr-3" />
                Añadir al Carrito
              </Button>
            </form>
            
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default ProductDetailPage;