import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '../app/models/products'
import type { CartItem } from '../app/models/cart'

interface CartStore {
  cartItems: CartItem[]
  cartCount: number
  isLoading: boolean
  
  // Acciones de DB
  loadCartFromDB: () => Promise<void>
  syncCartToDB: () => Promise<void>
  
  // Acciones híbridas
  addToCart: (product: Product, quantity?: number) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  getTotalPrice: () => number
}

const CART_STORAGE_KEY = 'min-commerce.cart'

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartItems: [],
      cartCount: 0,
      isLoading: false,

      // Cargar carrito desde la base de datos
      loadCartFromDB: async () => {
        console.log('Store: loadCartFromDB called')
        set({ isLoading: true })
        try {
          const response = await fetch('/api/cart')
          console.log('Store: API response status', response.status)
          if (response.ok) {
            const cartItems = await response.json()
            console.log('Store: received cart items', { count: cartItems.length, items: cartItems })
            set({
              cartItems,
              cartCount: cartItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)
            })
            console.log('Store: cart updated', { cartCount: cartItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0) })
          } else {
            console.log('Store: API response not ok', response.status)
          }
        } catch (error) {
          console.error('Error loading cart from DB:', error)
        } finally {
          set({ isLoading: false })
        }
      },

      // Sincronizar carrito local con la base de datos
      syncCartToDB: async () => {
        const { cartItems } = get()
        try {
          // Limpiar carrito en DB
          await fetch('/api/cart', { method: 'DELETE' })
          
          // Agregar todos los items a DB
          for (const item of cartItems) {
            await fetch('/api/cart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                productId: item.id,
                quantity: item.quantity
              })
            })
          }
        } catch (error) {
          console.error('Error syncing cart to DB:', error)
        }
      },

      // Agregar al carrito (híbrido)
      addToCart: async (product: Product, quantity: number = 1) => {
        const { cartItems } = get()
        
        // Normalizar el id a string para evitar duplicados entre '3' y 3
        const normalizedId = `${product.id}`
        const normalizedProduct = { ...product, id: normalizedId }

        // Asegurar que los items existentes tengan id string
        const normalizedCart = cartItems.map((it) => ({
          ...it,
          id: `${it.id}`,
        }))

        const existingItem = normalizedCart.find((item) => item.id === normalizedId)

        let newCartItems: CartItem[]
        if (existingItem) {
          newCartItems = normalizedCart.map((item) =>
            item.id === normalizedId ? { ...item, quantity: item.quantity + quantity } : item
          )
        } else {
          newCartItems = [...normalizedCart, { ...normalizedProduct, quantity }]
        }

        const newCartCount = newCartItems.reduce((total, item) => total + item.quantity, 0)

        // Actualizar estado local inmediatamente
        set({
          cartItems: newCartItems,
          cartCount: newCartCount
        })

        // Sincronizar con DB
        try {
          await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productId: product.id,
              quantity
            })
          })
        } catch (error) {
          console.error('Error adding to cart DB:', error)
          // Revertir estado local si falla
          set({
            cartItems,
            cartCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
          })
        }
      },

      // Eliminar del carrito (híbrido)
      removeFromCart: async (productId: string) => {
        const { cartItems } = get()
        const newCartItems = cartItems
          .map((it) => ({ ...it, id: `${it.id}` }))
          .filter((item) => item.id !== `${productId}`)

        const newCartCount = newCartItems.reduce((total, item) => total + item.quantity, 0)

        // Actualizar estado local inmediatamente
        set({
          cartItems: newCartItems,
          cartCount: newCartCount
        })

        // Sincronizar con DB
        try {
          await fetch(`/api/cart/${productId}`, { method: 'DELETE' })
        } catch (error) {
          console.error('Error removing from cart DB:', error)
          // Revertir estado local si falla
          set({
            cartItems,
            cartCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
          })
        }
      },

      // Actualizar cantidad (híbrido)
      updateQuantity: async (productId: string, quantity: number) => {
        const { cartItems } = get()
        const normalizedId = String(productId)

        let newCartItems: CartItem[]
        // Normalizar ids a string
        const cart = cartItems.map((it) => ({ ...it, id: `${it.id}` }))

        if (quantity <= 0) {
          newCartItems = cart.filter((item) => item.id !== normalizedId)
        } else {
          newCartItems = cart.map((item) =>
            item.id === normalizedId ? { ...item, quantity } : item
          )
        }

        const newCartCount = newCartItems.reduce((total, item) => total + item.quantity, 0)

        // Actualizar estado local inmediatamente
        set({
          cartItems: newCartItems,
          cartCount: newCartCount
        })

        // Sincronizar con DB
        try {
          await fetch(`/api/cart/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity })
          })
        } catch (error) {
          console.error('Error updating cart DB:', error)
          // Revertir estado local si falla
          set({
            cartItems,
            cartCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
          })
        }
      },

      // Limpiar carrito (híbrido)
      clearCart: async () => {
        // Actualizar estado local inmediatamente
        set({ cartItems: [], cartCount: 0 })

        // Sincronizar con DB
        try {
          await fetch('/api/cart', { method: 'DELETE' })
        } catch (error) {
          console.error('Error clearing cart DB:', error)
        }
      },

      getTotalPrice: () => {
        const { cartItems } = get()
        return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      }
    }),
    {
      name: CART_STORAGE_KEY,
    }
  )
)

// NOTA: El hook de sincronización se movió a CartSyncProvider.tsx
// Este archivo no debe importar hooks de React directamente