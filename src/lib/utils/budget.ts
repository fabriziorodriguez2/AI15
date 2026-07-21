import type { Expense } from "@/types";

export interface BudgetTotals {
  /** Suma de gastos con estado "estimated". */
  estimated: number;
  /** Suma de gastos con estado "reserved". */
  reserved: number;
  /** Suma de gastos con estado "paid". */
  paid: number;
  /** Total comprometido = reservado + pagado. */
  committed: number;
  /** Suma de todos los gastos, sin importar el estado. */
  totalRegistered: number;
  /** Saldo disponible = presupuesto - comprometido. */
  available: number;
  /** Porcentaje del presupuesto comprometido (0–100+, sin recortar). */
  usedPercent: number;
  /** true si lo comprometido supera el presupuesto. */
  isOverBudget: boolean;
}

/**
 * Calcula los totales de presupuesto a partir de los gastos.
 * Cálculo 100% determinístico (no interviene la IA).
 *
 * Nota: se asume que los gastos están en la misma moneda que el evento; el
 * formulario de gastos fija la moneda del evento, así que no se mezclan.
 */
export function computeBudgetTotals(
  expenses: Expense[],
  totalBudget: number,
): BudgetTotals {
  let estimated = 0;
  let reserved = 0;
  let paid = 0;

  for (const expense of expenses) {
    if (expense.status === "estimated") estimated += expense.amount;
    else if (expense.status === "reserved") reserved += expense.amount;
    else if (expense.status === "paid") paid += expense.amount;
  }

  const committed = reserved + paid;
  const totalRegistered = estimated + reserved + paid;
  const available = totalBudget - committed;
  const usedPercent =
    totalBudget > 0 ? (committed / totalBudget) * 100 : 0;

  return {
    estimated,
    reserved,
    paid,
    committed,
    totalRegistered,
    available,
    usedPercent,
    isOverBudget: committed > totalBudget,
  };
}
