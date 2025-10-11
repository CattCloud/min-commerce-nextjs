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
      if (flag) {
        sessionStorage.removeItem("order-success");
        getNotyf().success("¡Compra realizada exitosamente!");
        // Limpia el carrito después de navegar a /orders para evitar ver /checkout vacío
        clearCart();
      }
    } catch {
      // ignore
    }
  }, [clearCart]);

  return null;
}