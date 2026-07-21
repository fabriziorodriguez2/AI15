import { NextResponse } from "next/server";
import { generateStructured } from "@/lib/ai/gemini-proxy";
import { aiContextSchema } from "@/lib/ai/context-schema";
import { buildBudgetPrompt } from "@/lib/ai/prompts";
import { budgetResponseSchema } from "@/lib/ai/response-schemas";
import { aiBudgetSchema } from "@/lib/validations/ai-plan";
import { finalizeAllocation } from "@/lib/ai/finalize-allocation";
import { toISODate } from "@/lib/utils/date";

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
      { ok: false, error: "Faltan datos para calcular la distribución." },
      { status: 400 },
    );
  }
  const ctx = parsedInput.data;

  if (ctx.event.totalBudget <= 0) {
    return NextResponse.json(
      { ok: false, error: "Definí un presupuesto primero." },
      { status: 400 },
    );
  }

  const prompt = buildBudgetPrompt(ctx, toISODate(new Date()));
  const result = await generateStructured(prompt, budgetResponseSchema, {
    model: MODEL,
    temperature: 0.5,
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: 502 },
    );
  }

  const parsed = aiBudgetSchema.safeParse(result.data);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "La respuesta no tuvo el formato esperado." },
      { status: 502 },
    );
  }

  const allocation = finalizeAllocation(
    parsed.data.allocations,
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
    allocations: allocation.allocations,
    model: result.model,
    usage: result.usage ?? null,
  });
}
