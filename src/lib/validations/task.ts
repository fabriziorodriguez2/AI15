import { z } from "zod";
import { TASK_CATEGORY_OPTIONS, type TaskCategory } from "@/types";

export const taskFormSchema = z.object({
  title: z
    .string({ required_error: "Ponele un título a la tarea." })
    .trim()
    .min(1, "Ponele un título a la tarea.")
    .max(120, "El título es demasiado largo."),
  description: z
    .string()
    .trim()
    .max(400, "La descripción es demasiado larga.")
    .optional()
    .default(""),
  dueDate: z
    .string({ required_error: "Elegí una fecha." })
    .min(1, "Elegí una fecha.")
    .refine((value) => {
      const parsed = new Date(`${value}T00:00:00`);
      return !Number.isNaN(parsed.getTime());
    }, "La fecha no es válida."),
  category: z.enum(
    TASK_CATEGORY_OPTIONS as [TaskCategory, ...TaskCategory[]],
    { required_error: "Elegí una categoría." },
  ),
  priority: z.enum(["low", "medium", "high"], {
    required_error: "Elegí una prioridad.",
  }),
});

export type TaskFormInput = z.infer<typeof taskFormSchema>;
