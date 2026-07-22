import { NextResponse } from "next/server";
import {
  generateStructured,
  type StructuredResult,
} from "@/lib/ai/gemini-proxy";
import { aiContextSchema } from "@/lib/ai/context-schema";
import {
  buildPlanCreativePrompt,
  buildPlanLogisticsPrompt,
} from "@/lib/ai/prompts";
import {
  planCreativeResponseSchema,
  planLogisticsResponseSchema,
} from "@/lib/ai/response-schemas";
import { aiPlanContentSchema } from "@/lib/validations/ai-plan";
import { finalizeAllocation } from "@/lib/ai/finalize-allocation";
import { toISODate } from "@/lib/utils/date";

// La generación ocurre solo en tiempo de ejecución, nunca durante el build.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = "gemini-2.5-flash";

function generationFailure(
  result: Extract<StructuredResult<unknown>, { ok: false }>,
  part: "logistics" | "creative",
) {
  return NextResponse.json(
    {
      ok: false,
      error: result.error,
      ...(process.env.NODE_ENV === "development"
        ? { debug: { stage: "generation", part, code: result.code } }
        : {}),
    },
    { status: 502 },
  );
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

  const today = toISODate(new Date());
  const [logisticsResult, creativeResult] = await Promise.all([
    generateStructured(
      buildPlanLogisticsPrompt(ctx, today),
      planLogisticsResponseSchema,
      { model: MODEL, temperature: 0.4 },
    ),
    generateStructured(
      buildPlanCreativePrompt(ctx, today),
      planCreativeResponseSchema,
      { model: MODEL, temperature: 0.6 },
    ),
  ]);

  if (!logisticsResult.ok)
    return generationFailure(logisticsResult, "logistics");
  if (!creativeResult.ok)
    return generationFailure(creativeResult, "creative");

  const parsedContent = aiPlanContentSchema.safeParse({
    ...(creativeResult.data as object),
    ...(logisticsResult.data as object),
  });
  if (!parsedContent.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "La respuesta no tuvo el formato esperado.",
        ...(process.env.NODE_ENV === "development"
          ? {
              debug: {
                stage: "validation",
                issues: parsedContent.error.issues.map((issue) => ({
                  path: issue.path.join("."),
                  message: issue.message,
                })),
              },
            }
          : {}),
      },
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
    model: creativeResult.model,
    usage: {
      chargedUsd:
        (creativeResult.usage?.chargedUsd ?? 0) +
        (logisticsResult.usage?.chargedUsd ?? 0),
      balanceUsd:
        creativeResult.usage?.balanceUsd ??
        logisticsResult.usage?.balanceUsd,
    },
  });
}
