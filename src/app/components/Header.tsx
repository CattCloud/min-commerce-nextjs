"use client"
import { useState, useEffect } from 'react'; // Importa useEffect
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/cart/CartContext';
import CartDropdown from './CartDropdown'; 

const Header: React.FC = () => {
  const { cartCount } = useCart();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
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
        
        <Link href="/" className="text-text-light hover:text-primary-500 transition-colors">
          <h1 className="text-3xl font-extrabold tracking-wider text-primary-300">
            Min-Commerce
          </h1>
        </Link>

        <div className="relative">
          <button 
            onClick={toggleDropdown}
            className="cursor-pointer p-2 text-primary-500 hover:bg-bg-card transition-colors relative"
            aria-expanded={isDropdownOpen}
            aria-controls="cart-dropdown"
          >
            <ShoppingCart size={24} />
            
            {/* PASO 3: Solo renderiza la insignia si el componente está montado Y si hay items */}
            {hasMounted && cartCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-bg-card transform translate-x-1/2 bg-secondary-500 rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          {hasMounted && isDropdownOpen && (
            <CartDropdown onClose={closeDropdown} />
          )}
        </div>
        
      </div>
    </header>
  );
};

export default Header;