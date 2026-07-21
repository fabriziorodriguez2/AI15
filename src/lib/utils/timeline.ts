import { TIMELINE_TASKS, type TimelineTaskTemplate } from "@/data/timeline";
import type { PlanningTask } from "@/types";
import {
  parseEventDate,
  startOfToday,
  subtractDays,
  subtractMonths,
  toISODate,
} from "./date";

export interface ComputedTask {
  id: string;
  title: string;
  detail: string;
  date: Date;
  /** La fecha de la tarea ya pasó. */
  isPast: boolean;
}

/** Calcula la fecha concreta de una tarea a partir de la fecha del evento. */
function computeTaskDate(
  eventDate: Date,
  task: TimelineTaskTemplate,
): Date {
  if (typeof task.daysBefore === "number") {
    return subtractDays(eventDate, task.daysBefore);
  }
  return subtractMonths(eventDate, task.monthsBefore ?? 0);
}

/**
 * Devuelve las tareas del cronograma con sus fechas calculadas y ordenadas
 * cronológicamente. Devuelve una lista vacía si la fecha no es válida.
 */
export function buildTimeline(eventDateIso: string): ComputedTask[] {
  const eventDate = parseEventDate(eventDateIso);
  if (!eventDate) return [];
  const today = startOfToday();

  return TIMELINE_TASKS.map((task) => {
    const date = computeTaskDate(eventDate, task);
    return {
      id: task.id,
      title: task.title,
      detail: task.detail,
      date,
      isPast: date.getTime() < today.getTime(),
    };
  }).sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Genera tareas base como PlanningTask reales (source "user") a partir de la
 * plantilla y la fecha del evento, para sembrar el cronograma inicial.
 */
export function buildSeedTasks(
  eventId: string,
  eventDateIso: string,
): Omit<PlanningTask, "id" | "createdAt" | "updatedAt">[] {
  const eventDate = parseEventDate(eventDateIso);
  if (!eventDate) return [];

  return TIMELINE_TASKS.map((template) => ({
    eventId,
    title: template.title,
    description: template.detail,
    dueDate: toISODate(computeTaskDate(eventDate, template)),
    category: template.category,
    priority: template.priority,
    status: "pending" as const,
    source: "user" as const,
  }));
}
