import { useState } from 'react';
import { redirect } from 'next/navigation';
import { useParams } from 'next/navigation'; // Hook de Next.js para leer parámetros
import { ShoppingCart } from 'lucide-react';
import { products } from '../data/products';
import { formatPrice } from '../utils/price';
import { useCartStore } from '../../store/useCartStore';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { quantitySchema, QuantityFormData } from '../../schemas/cart';


const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCartStore();
  const [showNotification, setShowNotification] = useState(false);

  const form = useForm<QuantityFormData>({
    resolver: zodResolver(quantitySchema),
    defaultValues: {
      quantity: 1,
    },
  });

  // Buscar el producto por ID
  const product = products.find(p => p.id === id);

  // Si el producto no se encuentra, redirigimos al inicio
  if (!product) {
    redirect('/');
  }

  // Manejador para añadir al carrito
  const handleAddToCart = (data: QuantityFormData) => {
    addToCart(product, data.quantity);
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
      
      {/* Notificacin de exito */}
      {showNotification && (
        <div className="fixed bottom-10 right-10 bg-secondary-500 text-bg-card px-6 py-3 font-bold shadow-lg transition-opacity duration-500 z-50">{product.name} ha sido añadido al carrito</div>
      )}
    </div>
  );
};

export default ProductDetailPage;