import { z } from "zod";

export const quantitySchema = z.object({
  quantity: z
    .number()
    .min(1, "La cantidad debe ser al menos 1")
    .max(10, "La cantidad no puede ser mayor a 10"),
});

export const checkoutSchema = z.object({
  customerName: z.string().min(1, "El nombre es requerido"),
  customerEmail: z.string().email("Email inválido"),
});

export type QuantityFormData = z.infer<typeof quantitySchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;