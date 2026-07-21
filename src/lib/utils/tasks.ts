import type { PlanningTask } from "@/types";
import { parseEventDate, startOfToday } from "./date";

/** Una tarea está vencida si su fecha ya pasó y no está completada. */
export function isTaskOverdue(task: PlanningTask): boolean {
  if (task.status === "completed") return false;
  const due = parseEventDate(task.dueDate);
  if (!due) return false;
  return due.getTime() < startOfToday().getTime();
}

/** Ordena tareas por fecha ascendente (las inválidas van al final). */
export function sortTasksByDate(tasks: PlanningTask[]): PlanningTask[] {
  return [...tasks].sort((a, b) => {
    const da = parseEventDate(a.dueDate)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    const db = parseEventDate(b.dueDate)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    return da - db;
  });
}

/**
 * Próxima tarea real: la pendiente o en progreso, no vencida, más próxima.
 * Si no hay futuras, devuelve la vencida más reciente sin completar.
 * Devuelve null si no hay tareas accionables.
 */
export function getNextTask(tasks: PlanningTask[]): PlanningTask | null {
  const open = tasks.filter((t) => t.status !== "completed");
  if (open.length === 0) return null;

  const today = startOfToday().getTime();
  const sorted = sortTasksByDate(open);

  const upcoming = sorted.find((t) => {
    const due = parseEventDate(t.dueDate)?.getTime();
    return due !== undefined && due >= today;
  });
  if (upcoming) return upcoming;

  // Todas vencidas: devolver la más próxima al presente (la última vencida).
  return sorted[sorted.length - 1] ?? null;
}

export function getOverdueTasks(tasks: PlanningTask[]): PlanningTask[] {
  return sortTasksByDate(tasks.filter(isTaskOverdue));
}

export function countCompleted(tasks: PlanningTask[]): number {
  return tasks.filter((t) => t.status === "completed").length;
}
