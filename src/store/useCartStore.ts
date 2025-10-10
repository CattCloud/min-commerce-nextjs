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
    (set, get) => ({
      cartItems: [],
      cartCount: 0,

      addToCart: (product: Product, quantity: number = 1) => {
        set((state) => {
          const existingItem = state.cartItems.find(item => item.id === product.id);
          let newCartItems: CartItem[];

          if (existingItem) {
            newCartItems = state.cartItems.map(item =>
              item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
            );
          } else {
            newCartItems = [...state.cartItems, { ...product, quantity }];
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
          const newCartItems = state.cartItems.filter(item => item.id !== productId);
          const newCartCount = newCartItems.reduce((total, item) => total + item.quantity, 0);

          return {
            cartItems: newCartItems,
            cartCount: newCartCount,
          };
        });
      },

      updateQuantity: (productId: string, quantity: number) => {
        set((state) => {
          let newCartItems: CartItem[];

          if (quantity <= 0) {
            newCartItems = state.cartItems.filter(item => item.id !== productId);
          } else {
            newCartItems = state.cartItems.map(item =>
              item.id === productId ? { ...item, quantity } : item
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