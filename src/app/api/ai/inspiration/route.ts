import { NextResponse } from "next/server";
import { z } from "zod";
import { generateStructured } from "@/lib/ai/gemini-proxy";
import { inspirationAnalysisResponseSchema } from "@/lib/ai/response-schemas";
import { inspirationAnalysisSchema } from "@/lib/validations/inspiration-analysis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = "gemini-2.5-flash";

const requestSchema = z.object({
  // El proxy estudiantil expone entrada visual para Gemini 2.5 Flash mediante
  // su alias multimodal "video". El navegador convierte la imagen en un clip
  // estático y pequeño; no se usa un segundo modelo ni se genera una imagen.
  inputVideo: z
    .string()
    .startsWith("data:video/", "El archivo visual no es válido.")
    .max(6_000_000, "La imagen procesada es demasiado grande."),
  note: z.string().trim().max(400).default(""),
  eventStyle: z
    .object({
      styles: z.array(z.string().max(40)).max(10).default([]),
      favoriteColors: z.array(z.string().max(40)).max(20).default([]),
      themeDescription: z.string().max(280).default(""),
    })
    .default({ styles: [], favoriteColors: [], themeDescription: "" }),
});

function buildPrompt(input: z.infer<typeof requestSchema>): string {
  const context = [
    input.note ? `Qué le gusta a la usuaria: ${input.note}` : "",
    input.eventStyle.styles.length
      ? `Estilos ya elegidos: ${input.eventStyle.styles.join(", ")}`
      : "",
    input.eventStyle.favoriteColors.length
      ? `Colores ya elegidos: ${input.eventStyle.favoriteColors.join(", ")}`
      : "",
    input.eventStyle.themeDescription
      ? `Temática: ${input.eventStyle.themeDescription}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  return `Sos la asesora visual de AI15. Analizá el único fotograma del clip adjunto como una imagen de inspiración para una fiesta de 15.

Devolvé exclusivamente JSON válido según el esquema. Escribí en español rioplatense y de forma breve.

Tareas:
- Detectá entre 1 y 4 estilos visuales.
- Extraé entre 3 y 5 colores dominantes con nombre y HEX #RRGGBB.
- Enumerá entre 2 y 5 elementos visuales principales.
- Proponé entre 3 y 5 recomendaciones concretas para adaptar la referencia a decoración, iluminación, torta, centros de mesa o invitaciones.
- Si algo no puede determinarse con seguridad, explicalo en uncertaintyNotes; si la imagen es clara, usá una frase breve.
- No identifiques personas ni infieras edad, origen, salud u otros atributos sensibles.
- No inventes proveedores, precios ni disponibilidad.

Contexto opcional del evento:
${context || "Sin preferencias adicionales."}`;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Solicitud inválida." },
      { status: 400 },
    );
  }

  const parsedInput = requestSchema.safeParse(body);
  if (!parsedInput.success) {
    return NextResponse.json(
      { ok: false, error: parsedInput.error.issues[0]?.message ?? "Imagen inválida." },
      { status: 400 },
    );
  }

  const result = await generateStructured(
    buildPrompt(parsedInput.data),
    inspirationAnalysisResponseSchema,
    {
      model: MODEL,
      modelKey: "video",
      inputVideo: parsedInput.data.inputVideo,
      temperature: 0.35,
      timeoutMs: 60_000,
    },
  );

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: 502 },
    );
  }

  const analysis = inspirationAnalysisSchema.safeParse(result.data);
  if (!analysis.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "La respuesta visual no tuvo el formato esperado.",
        ...(process.env.NODE_ENV === "development"
          ? {
              debug: analysis.error.issues.map((issue) => ({
                path: issue.path.join("."),
                message: issue.message,
              })),
              received: result.data,
            }
          : {}),
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    analysis: analysis.data,
    model: MODEL,
    usage: result.usage ?? null,
  });
}
