import type { BudgetAllocationItem } from "@/types";
import {
  amountFromPercent,
  normalizeTo100,
  percentsSumTo100,
} from "@/lib/utils/currency";

interface RawAllocation {
  category: string;
  percentage: number;
  reasoning: string;
}

export type FinalizeResult =
  | { ok: true; allocations: BudgetAllocationItem[] }
  | { ok: false; error: string };

/**
 * Valida y finaliza la distribución de la IA:
 * 1. Si los porcentajes ya suman 100, se usan tal cual.
 * 2. Si están cerca (90–110), se hace UNA corrección proporcional a 100.
 * 3. Si están demasiado lejos, se devuelve error (no se inventan porcentajes).
 *
 * Los importes se calculan en TypeScript a partir de los porcentajes finales.
 */
export function finalizeAllocation(
  raw: RawAllocation[],
  totalBudget: number,
): FinalizeResult {
  if (raw.length === 0) {
    return { ok: false, error: "La IA no devolvió categorías de presupuesto." };
  }

  const percentages = raw.map((r) => r.percentage);
  const sum = percentages.reduce((acc, p) => acc + p, 0);

  let finalPercentages: number[];
  if (percentsSumTo100(percentages)) {
    finalPercentages = percentages;
  } else if (sum >= 90 && sum <= 110 && sum > 0) {
    // Corrección única, proporcional (preserva los pesos relativos del modelo).
    finalPercentages = normalizeTo100(percentages);
  } else {
    return {
      ok: false,
      error: "La distribución recibida no es válida. Probá regenerarla.",
    };
  }

  // Verificación posterior a la corrección.
  if (!percentsSumTo100(finalPercentages)) {
    return {
      ok: false,
      error: "No pudimos ajustar la distribución al 100%. Probá regenerarla.",
    };
  }

  const allocations: BudgetAllocationItem[] = raw.map((item, index) => {
    const percentage = finalPercentages[index] ?? 0;
    return {
      category: item.category,
      percentage,
      amount: amountFromPercent(totalBudget, percentage),
      reasoning: item.reasoning,
    };
  });

  return { ok: true, allocations };
}
