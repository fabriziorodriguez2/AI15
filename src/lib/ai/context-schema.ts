import { z } from "zod";

/**
 * Esquema del contexto que el cliente envía a las rutas de IA. Acota el tamaño
 * de las colecciones para controlar costos y entradas abusivas. La ruta valida
 * este payload antes de construir el prompt.
 */
export const aiContextSchema = z.object({
  event: z.object({
    honoreeName: z.string().max(80),
    eventDate: z.string().max(20),
    department: z.string().max(80),
    city: z.string().max(80),
    guestCount: z.number().int().min(0).max(2000),
    confirmedGuestCount: z.number().int().min(0).max(2000),
    totalBudget: z.number().min(0),
    currency: z.enum(["UYU", "USD"]),
    styles: z.array(z.string().max(40)).max(10),
    themeDescription: z.string().max(500),
    favoriteColors: z.array(z.string().max(40)).max(20),
  }),
  expenses: z
    .array(
      z.object({
        category: z.string().max(40),
        description: z.string().max(160),
        amount: z.number(),
        status: z.string().max(20),
      }),
    )
    .max(100)
    .default([]),
  tasks: z
    .array(
      z.object({
        title: z.string().max(160),
        dueDate: z.string().max(20),
        status: z.string().max(20),
        priority: z.string().max(20),
      }),
    )
    .max(100)
    .default([]),
  decisions: z
    .array(
      z.object({
        category: z.string().max(40),
        title: z.string().max(160),
        value: z.string().max(200),
        confirmed: z.boolean(),
      }),
    )
    .max(100)
    .default([]),
  selectedProviders: z
    .array(
      z.object({
        name: z.string().max(120),
        category: z.string().max(40),
        city: z.string().max(80),
        status: z.string().max(20),
      }),
    )
    .max(50)
    .default([]),
  inspirations: z
    .array(z.object({ description: z.string().max(400) }))
    .max(30)
    .default([]),
});

export type AIContext = z.infer<typeof aiContextSchema>;
