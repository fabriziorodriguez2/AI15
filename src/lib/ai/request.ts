import type { AIContext } from "./context-schema";
import type { AIPlanContent, BudgetAllocationItem } from "@/types";

interface PlanResponse {
  ok: true;
  content: AIPlanContent;
  budgetAllocation: BudgetAllocationItem[];
  model: string;
  usage: { chargedUsd?: number; balanceUsd?: number } | null;
}

interface BudgetResponse {
  ok: true;
  allocations: BudgetAllocationItem[];
  model: string;
  usage: { chargedUsd?: number; balanceUsd?: number } | null;
}

type ApiError = { ok: false; error: string };

async function postJson<T>(
  url: string,
  body: AIContext,
): Promise<T | ApiError> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json()) as T | ApiError;
    return data;
  } catch {
    return { ok: false, error: "No pudimos conectar con el servicio." };
  }
}

export function requestPlan(context: AIContext) {
  return postJson<PlanResponse>("/api/ai/plan", context);
}

export function requestBudget(context: AIContext) {
  return postJson<BudgetResponse>("/api/ai/budget", context);
}
