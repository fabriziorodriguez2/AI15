import { NextResponse } from "next/server";
import { generateStructured } from "@/lib/ai/gemini-proxy";
import { aiContextSchema } from "@/lib/ai/context-schema";
import { buildPlanPrompt } from "@/lib/ai/prompts";
import { planResponseSchema } from "@/lib/ai/response-schemas";
import { aiPlanContentSchema } from "@/lib/validations/ai-plan";
import { finalizeAllocation } from "@/lib/ai/finalize-allocation";
import { toISODate } from "@/lib/utils/date";

// La generación ocurre solo en tiempo de ejecución, nunca durante el build.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = "gemini-2.5-flash";

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

  const parsedInput = aiContextSchema.safeParse(body);
  if (!parsedInput.success) {
    return NextResponse.json(
      { ok: false, error: "Faltan datos para personalizar el plan." },
      { status: 400 },
    );
  }
  const ctx = parsedInput.data;

  if (ctx.event.totalBudget <= 0) {
    return NextResponse.json(
      { ok: false, error: "Definí un presupuesto para generar el plan." },
      { status: 400 },
    );
  }

  const prompt = buildPlanPrompt(ctx, toISODate(new Date()));
  const result = await generateStructured(prompt, planResponseSchema, {
    model: MODEL,
    temperature: 0.6,
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: 502 },
    );
  }

  const parsedContent = aiPlanContentSchema.safeParse(result.data);
  if (!parsedContent.success) {
    return NextResponse.json(
      { ok: false, error: "La respuesta no tuvo el formato esperado." },
      { status: 502 },
    );
  }

  const allocation = finalizeAllocation(
    parsedContent.data.budgetAllocation,
    ctx.event.totalBudget,
  );
  if (!allocation.ok) {
    return NextResponse.json(
      { ok: false, error: allocation.error },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    content: parsedContent.data,
    budgetAllocation: allocation.allocations,
    model: result.model,
    usage: result.usage ?? null,
  });
}
