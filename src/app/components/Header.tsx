"use client"
import { useState, useEffect } from 'react'; // Importa useEffect
import Link from 'next/link';
import { ShoppingCart, Settings } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useSession } from 'next-auth/react';
import CartDropdown from './CartDropdown';
import { Button } from '../../components/ui/button';
import AuthButton from '../../components/AuthButton';

const Header: React.FC = () => {
  const { cartCount } = useCartStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: session } = useSession();
  
  // PASO 1: Crea un estado para saber si el componente ya se montó en el cliente.
  const [hasMounted, setHasMounted] = useState(false);

  // PASO 2: Usa useEffect para cambiar el estado solo después del primer renderizado en el cliente.
  useEffect(() => {
    setHasMounted(true);
  }, []); // El arreglo vacío asegura que solo se ejecute una vez.

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };
  
  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-bg-app border-b border-border-default shadow-lg">
      <div className="container mx-auto max-w-7xl px-4 py-2 flex justify-between items-center">
        
        <Link href="/" className="text-text-light hover:text-text-primary transition-colors">
          <h1 className="text-3xl font-extrabold tracking-wider text-primary-300">
            Min-Commerce
          </h1>
        </Link>

        <div className="flex items-center space-x-4">

          
          {/* AuthButton - Primero para que esté a la izquierda del carrito */}
          <AuthButton />
          
          {/* Carrito - Solo para usuarios autenticados que no sean admin */}
          {session && session.user?.role !== "admin" && (
            <div className="relative">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleDropdown}
                aria-expanded={isDropdownOpen}
                aria-controls="cart-dropdown"
                className="relative"
              >
                <ShoppingCart size={24} />

                {/* PASO 3: Solo renderiza la insignia si el componente está montado Y si hay items */}
                {hasMounted && cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-[var(--color-bg-app)] transform translate-x-1/2 bg-[var(--color-secondary-500)] rounded-full">
                    {cartCount}
                  </span>
                )}
              </Button>

              {hasMounted && isDropdownOpen && (
                <CartDropdown onClose={closeDropdown} />
              )}
            </div>
          )}
                    {/* Enlace a Panel de Admin - Solo para usuarios con rol admin */}
          {session?.user?.role === "admin" && (
            <Link
              href="/admin"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary-600 text-white hover:bg-primary-700 h-9 px-3"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Panel Admin</span>
            </Link>
          )}
        </div>
        
      </div>
    </header>
  );
};

export default Header;