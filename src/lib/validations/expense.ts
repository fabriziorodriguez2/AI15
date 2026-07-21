import { z } from "zod";
import { EXPENSE_CATEGORY_OPTIONS, type ExpenseCategory } from "@/types";

export const expenseFormSchema = z.object({
  category: z.enum(
    EXPENSE_CATEGORY_OPTIONS as [ExpenseCategory, ...ExpenseCategory[]],
    { required_error: "Elegí una categoría." },
  ),
  description: z
    .string({ required_error: "Agregá una descripción." })
    .trim()
    .min(1, "Agregá una descripción.")
    .max(120, "La descripción es demasiado larga."),
  amount: z.coerce
    .number({ invalid_type_error: "Ingresá un importe." })
    .positive("El importe debe ser mayor que cero."),
  status: z.enum(["estimated", "reserved", "paid"], {
    required_error: "Elegí un estado.",
  }),
});

export type ExpenseFormInput = z.infer<typeof expenseFormSchema>;
