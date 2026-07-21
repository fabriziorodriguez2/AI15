export type TaskStatus = "pending" | "in_progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";
export type TaskSource = "user" | "ai";

export type TaskCategory =
  | "presupuesto"
  | "salon"
  | "vestido"
  | "proveedores"
  | "decoracion"
  | "invitados"
  | "logistica"
  | "otros";

export interface PlanningTask {
  id: string;
  eventId: string;
  title: string;
  description: string;
  /** Fecha límite en formato ISO (YYYY-MM-DD). */
  dueDate: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  source: TaskSource;
  createdAt: string;
  updatedAt: string;
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  pending: "Pendiente",
  in_progress: "En progreso",
  completed: "Completada",
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
};

export const TASK_CATEGORY_LABELS: Record<TaskCategory, string> = {
  presupuesto: "Presupuesto",
  salon: "Salón",
  vestido: "Vestido",
  proveedores: "Proveedores",
  decoracion: "Decoración",
  invitados: "Invitados",
  logistica: "Logística",
  otros: "Otros",
};

export const TASK_CATEGORY_OPTIONS: TaskCategory[] = [
  "presupuesto",
  "salon",
  "vestido",
  "proveedores",
  "decoracion",
  "invitados",
  "logistica",
  "otros",
];
