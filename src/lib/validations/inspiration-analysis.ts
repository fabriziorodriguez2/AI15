import { z } from "zod";

const compactString = (max: number) =>
  z
    .string()
    .trim()
    .min(1)
    .transform((value) => value.slice(0, max));

const hexColor = z
  .string()
  .regex(/^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Color hexadecimal inválido.")
  .transform((value) => {
    const upper = value.toUpperCase();
    return upper.length === 4
      ? `#${upper[1]}${upper[1]}${upper[2]}${upper[2]}${upper[3]}${upper[3]}`
      : upper;
  });

export const inspirationAnalysisSchema = z.object({
  styles: z
    .array(compactString(30))
    .min(1)
    .transform((items) => items.slice(0, 4)),
  colors: z
    .array(
      z.object({
        name: compactString(25),
        hex: hexColor,
      }),
    )
    .min(1)
    .transform((items) => items.slice(0, 5)),
  mainElements: z
    .array(compactString(45))
    .min(1)
    .transform((items) => items.slice(0, 5)),
  recommendations: z
    .array(compactString(90))
    .min(1)
    .transform((items) => items.slice(0, 5)),
  uncertaintyNotes: z
    .string()
    .trim()
    .default("")
    .transform((value) => value.slice(0, 160)),
});

export type InspirationAnalysisInput = z.infer<
  typeof inspirationAnalysisSchema
>;
