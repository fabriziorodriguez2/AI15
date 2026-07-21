import { z } from "zod";
import { DECISION_CATEGORY_OPTIONS, type DecisionCategory } from "@/types";

export const decisionFormSchema = z.object({
  category: z.enum(
    DECISION_CATEGORY_OPTIONS as [DecisionCategory, ...DecisionCategory[]],
    { required_error: "Elegí una categoría." },
  ),
  title: z
    .string({ required_error: "Ponele un título." })
    .trim()
    .min(1, "Ponele un título.")
    .max(120, "El título es demasiado largo."),
  value: z
    .string({ required_error: "Indicá qué elegiste." })
    .trim()
    .min(1, "Indicá qué elegiste.")
    .max(200, "El valor es demasiado largo."),
  notes: z
    .string()
    .trim()
    .max(400, "Las notas son demasiado largas.")
    .optional()
    .default(""),
  confirmed: z.boolean().optional().default(false),
});

export type DecisionFormInput = z.infer<typeof decisionFormSchema>;
