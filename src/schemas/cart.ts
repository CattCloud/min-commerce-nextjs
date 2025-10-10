import { z } from "zod";

export const quantitySchema = z.object({
  quantity: z
    .number()
    .min(1, "La cantidad debe ser al menos 1")
    .max(10, "La cantidad no puede ser mayor a 10"),
});

export type QuantityFormData = z.infer<typeof quantitySchema>;