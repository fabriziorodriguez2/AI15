import type {
  AIPlan,
  EventDecision,
  EventProfile,
  Expense,
  Inspiration,
  PlanningTask,
  SelectedProvider,
} from "@/types";
import { countCompleted } from "./tasks";

export interface ProgressInput {
  event: EventProfile | null;
  expenses: Expense[];
  tasks: PlanningTask[];
  decisions: EventDecision[];
  inspirations: Inspiration[];
  selectedProviders: SelectedProvider[];
  aiPlan: AIPlan | null;
}

export interface ProgressItem {
  key: string;
  label: string;
  done: boolean;
  /** Peso relativo dentro del total. */
  weight: number;
  /** Fracción completada (0–1); para hitos booleanos es 0 o 1. */
  ratio: number;
}

export interface ProgressResult {
  percent: number;
  items: ProgressItem[];
}

/**
 * Progreso de planificación real y determinístico.
 *
 * Fórmula: cada hito aporta `weight * ratio`. El resultado es
 * `round( sum(weight*ratio) / sum(weight) * 100 )`. Las tareas aportan de
 * forma proporcional a las completadas; el resto son hitos booleanos.
 * Documentado en docs/decision-log.md.
 */
export function calculatePlanningProgress(
  input: ProgressInput,
): ProgressResult {
  const { event, expenses, tasks, decisions, inspirations, selectedProviders, aiPlan } =
    input;

  const hasDecision = (categories: string[]) =>
    decisions.some((d) => categories.includes(d.category));

  const activeProviders = selectedProviders.filter(
    (p) => p.status !== "discarded",
  );

  const taskRatio =
    tasks.length > 0 ? countCompleted(tasks) / tasks.length : 0;

  const items: ProgressItem[] = [
    boolItem("expenses", "Gastos registrados", expenses.length > 0, 1),
    boolItem("plan", "Plan generado", !!aiPlan && !aiPlan.isOutdated, 2),
    boolItem("salon", "Salón decidido", hasDecision(["salon"]), 1),
    boolItem("vestido", "Vestido decidido", hasDecision(["vestido"]), 1),
    boolItem(
      "providers",
      "Proveedores seleccionados",
      activeProviders.length > 0,
      1,
    ),
    boolItem("inspiration", "Inspiración guardada", inspirations.length > 0, 1),
    boolItem(
      "guests",
      "Invitados confirmados",
      !!event && event.confirmedGuestCount > 0,
      1,
    ),
    boolItem("decisions", "Decisiones registradas", decisions.length > 0, 1),
    {
      key: "tasks",
      label: "Tareas completadas",
      done: tasks.length > 0 && taskRatio === 1,
      weight: 2,
      ratio: taskRatio,
    },
  ];

  const totalWeight = items.reduce((sum, i) => sum + i.weight, 0);
  const achieved = items.reduce((sum, i) => sum + i.weight * i.ratio, 0);
  const percent = totalWeight > 0 ? Math.round((achieved / totalWeight) * 100) : 0;

  return { percent, items };
}

function boolItem(
  key: string,
  label: string,
  done: boolean,
  weight: number,
): ProgressItem {
  return { key, label, done, weight, ratio: done ? 1 : 0 };
}
