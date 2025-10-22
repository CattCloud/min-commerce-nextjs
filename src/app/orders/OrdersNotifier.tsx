"use client";

import "notyf/notyf.min.css";
import { useEffect } from "react";
import { getNotyf } from "../../lib/notyf";
import { useCartStore } from "../../store/useCartStore";

export default function OrdersNotifier() {
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    try {
      const flag = sessionStorage.getItem("order-success");
      const lastOrderId = sessionStorage.getItem("last-order-id");
      
      if (flag) {
        sessionStorage.removeItem("order-success");
        sessionStorage.removeItem("last-order-id");
        
        getNotyf().success("¡Compra realizada exitosamente!");
        
        // Si tenemos el ID de la última orden, verificamos que esté visible
        if (lastOrderId) {
          console.log('Verificando orden recién creada:', lastOrderId);
          
          // Forzar una recarga de la página para asegurar datos frescos
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }
        
        // Limpia el carrito después de navegar a /orders para evitar ver /checkout vacío
        clearCart();
      }
    } catch {
      // ignore
    }
  }, [clearCart]);

  return null;
}