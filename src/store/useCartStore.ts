import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../app/models/products';
import type { CartItem } from '../app/models/cart';

interface CartStore {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CART_STORAGE_KEY = 'min-commerce.cart';

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cartItems: [],
      cartCount: 0,

      addToCart: (product: Product, quantity: number = 1) => {
        set((state) => {
          // Normalizar el id a string para evitar duplicados entre '3' y 3
          const normalizedId = `${product.id}`;
          const normalizedProduct = { ...product, id: normalizedId };

          // Asegurar que los items existentes tengan id string
          const normalizedCart = state.cartItems.map((it) => ({
            ...it,
            id: `${it.id}`,
          }));

          const existingItem = normalizedCart.find((item) => item.id === normalizedId);

          let newCartItems: CartItem[];
          if (existingItem) {
            newCartItems = normalizedCart.map((item) =>
              item.id === normalizedId ? { ...item, quantity: item.quantity + quantity } : item
            );
          } else {
            newCartItems = [...normalizedCart, { ...normalizedProduct, quantity }];
          }

          const newCartCount = newCartItems.reduce((total, item) => total + item.quantity, 0);

          return {
            cartItems: newCartItems,
            cartCount: newCartCount,
          };
        });
      },

      removeFromCart: (productId: string) => {
        set((state) => {
          const newCartItems = state.cartItems
            .map((it) => ({ ...it, id: `${it.id}` }))
            .filter((item) => item.id !== `${productId}`);

          const newCartCount = newCartItems.reduce((total, item) => total + item.quantity, 0);

          return {
            cartItems: newCartItems,
            cartCount: newCartCount,
          };
        });
      },

      updateQuantity: (productId: string, quantity: number) => {
        set((state) => {
          const normalizedId = String(productId);

          let newCartItems: CartItem[];
          // Normalizar ids a string
          const cart = state.cartItems.map((it) => ({ ...it, id: `${it.id}` }));

          if (quantity <= 0) {
            newCartItems = cart.filter((item) => item.id !== normalizedId);
          } else {
            newCartItems = cart.map((item) =>
              item.id === normalizedId ? { ...item, quantity } : item
            );
          }

          const newCartCount = newCartItems.reduce((total, item) => total + item.quantity, 0);

          return {
            cartItems: newCartItems,
            cartCount: newCartCount,
          };
        });
      },

      clearCart: () => {
        set(() => ({
          cartItems: [],
          cartCount: 0,
        }));
      },
    }),
    {
      name: CART_STORAGE_KEY,
    }
  )
);