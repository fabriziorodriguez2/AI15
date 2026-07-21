import { z } from "zod";
import { PROVIDER_CATEGORY_OPTIONS, type ProviderCategory } from "@/types";

const optionalTrimmed = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal("")).default("");

export const providerFormSchema = z
  .object({
    name: z
      .string({ required_error: "Ingresá el nombre." })
      .trim()
      .min(1, "Ingresá el nombre.")
      .max(120, "El nombre es demasiado largo."),
    category: z.enum(
      PROVIDER_CATEGORY_OPTIONS as [ProviderCategory, ...ProviderCategory[]],
      { required_error: "Elegí una categoría." },
    ),
    department: z
      .string({ required_error: "Indicá el departamento." })
      .trim()
      .min(1, "Indicá el departamento."),
    city: z
      .string({ required_error: "Indicá la ciudad." })
      .trim()
      .min(1, "Indicá la ciudad."),
    priceFrom: z.coerce
      .number({ invalid_type_error: "Ingresá un número." })
      .min(0, "No puede ser negativo.")
      .optional()
      .default(0),
    priceTo: z.coerce
      .number({ invalid_type_error: "Ingresá un número." })
      .min(0, "No puede ser negativo.")
      .optional()
      .default(0),
    currency: z.enum(["UYU", "USD"], { required_error: "Elegí una moneda." }),
    capacity: z.coerce
      .number({ invalid_type_error: "Ingresá un número." })
      .int()
      .min(0)
      .optional(),
    description: optionalTrimmed(400),
    contact: optionalTrimmed(120),
    website: optionalTrimmed(200),
    instagram: optionalTrimmed(120),
    notes: optionalTrimmed(400),
  })
  .refine((data) => data.priceTo === 0 || data.priceTo >= data.priceFrom, {
    message: "El precio máximo no puede ser menor que el mínimo.",
    path: ["priceTo"],
  });

export type ProviderFormInput = z.infer<typeof providerFormSchema>;
