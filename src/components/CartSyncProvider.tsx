"use client"

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useCartStore } from '@/store/useCartStore'

export default function CartSyncProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const loadCartFromDB = useCartStore(state => state.loadCartFromDB)
  const syncCartToDB = useCartStore(state => state.syncCartToDB)

  // Cargar carrito cuando el usuario se autentica
  useEffect(() => {
    console.log('CartSyncProvider: session changed', { session: session?.user?.id })
    if (session?.user?.id) {
      console.log('CartSyncProvider: loading cart from DB')
      loadCartFromDB()
    }
  }, [session?.user?.id, loadCartFromDB])

  // Sincronizar carrito cuando el usuario hace logout (pero no al recargar)
  useEffect(() => {
    console.log('CartSyncProvider: session changed', { session: session?.user?.id })
    // Solo sincronizar si el usuario estaba logueado antes y ahora no está
    // Esto previene el DELETE al recargar la página
    if (session?.user?.id === undefined && window.location.pathname !== '/') {
      console.log('CartSyncProvider: user logged out, syncing cart to DB')
      syncCartToDB()
    }
  }, [session?.user?.id, syncCartToDB])
  
  return <>{children}</>
}