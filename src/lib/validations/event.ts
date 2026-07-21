import { z } from "zod";
import { PARTY_STYLE_OPTIONS, type PartyStyle } from "@/types";

const partyStyleEnum = z.enum(
  PARTY_STYLE_OPTIONS as [PartyStyle, ...PartyStyle[]],
);

/**
 * Devuelve la fecha de hoy a medianoche (hora local) para comparar
 * contra la fecha elegida sin que la hora actual afecte la validación.
 */
function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export const createEventSchema = z.object({
  honoreeName: z
    .string({ required_error: "Contanos el nombre o apodo de la quinceañera." })
    .trim()
    .min(1, "Contanos el nombre o apodo de la quinceañera.")
    .max(60, "El nombre es demasiado largo."),
  eventDate: z
    .string({ required_error: "Elegí la fecha de la fiesta." })
    .min(1, "Elegí la fecha de la fiesta.")
    .refine((value) => {
      const parsed = new Date(`${value}T00:00:00`);
      return !Number.isNaN(parsed.getTime());
    }, "La fecha no es válida.")
    .refine((value) => {
      const parsed = new Date(`${value}T00:00:00`);
      return parsed.getTime() > startOfToday().getTime();
    }, "La fecha de la fiesta debe ser futura."),
  city: z
    .string({ required_error: "Indicá la ciudad." })
    .trim()
    .min(1, "Indicá la ciudad."),
  department: z
    .string({ required_error: "Indicá el departamento." })
    .trim()
    .min(1, "Indicá el departamento."),
  guestCount: z.coerce
    .number({ invalid_type_error: "Ingresá una cantidad de invitados." })
    .int("Ingresá un número entero de invitados.")
    .min(20, "El mínimo es 20 invitados.")
    .max(500, "El máximo es 500 invitados."),
  confirmedGuestCount: z.coerce
    .number({ invalid_type_error: "Ingresá un número válido." })
    .int("Ingresá un número entero.")
    .min(0, "No puede ser negativo.")
    .max(500, "El máximo es 500 invitados.")
    .optional()
    .default(0),
  totalBudget: z.coerce
    .number({ invalid_type_error: "Ingresá tu presupuesto." })
    .positive("El presupuesto debe ser mayor que cero."),
  currency: z.enum(["UYU", "USD"], {
    required_error: "Elegí una moneda.",
  }),
  themeDescription: z
    .string()
    .trim()
    .max(280, "La descripción es demasiado larga.")
    .optional()
    .default(""),
  styles: z
    .array(partyStyleEnum)
    .min(1, "Elegí al menos un estilo."),
  favoriteColors: z.array(z.string().trim().min(1)).optional().default([]),
}).refine(
  (data) => (data.confirmedGuestCount ?? 0) <= data.guestCount,
  {
    message: "Los confirmados no pueden superar a los invitados estimados.",
    path: ["confirmedGuestCount"],
  },
);

export type CreateEventInput = z.infer<typeof createEventSchema>;
