"use client"
import { createContext, useContext} from 'react';
import type { CartContextType } from '../../models/cart';

// Crear el Contexto con un valor inicial que cumpla con CartContextType
export const CartContext = createContext<CartContextType | undefined>(undefined);

// Usamos Custom Hook para facilitar el consumo del contexto 
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('Error: useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};



