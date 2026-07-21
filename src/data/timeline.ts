import type { TaskCategory, TaskPriority } from "@/types";

export interface TimelineTaskTemplate {
  id: string;
  title: string;
  detail: string;
  category: TaskCategory;
  priority: TaskPriority;
  /** Meses antes del evento (se ignora si `daysBefore` está presente). */
  monthsBefore?: number;
  /** Días antes del evento (para hitos cercanos a la fecha). */
  daysBefore?: number;
}

/**
 * Plantilla genérica de tareas base. Sirve para sembrar un cronograma inicial:
 * las fechas concretas se calculan a partir de la fecha ingresada por la
 * usuaria. No son datos reales hasta que ella las incorpora a su cronograma.
 */
export const TIMELINE_TASKS: TimelineTaskTemplate[] = [
  {
    id: "task-10m",
    title: "Definir presupuesto y reservar salón",
    detail: "Establecé el monto disponible y asegurá la fecha en el salón.",
    category: "salon",
    priority: "high",
    monthsBefore: 10,
  },
  {
    id: "task-8m",
    title: "Elegir vestido",
    detail: "Reservá pruebas y definí el vestido con tiempo para ajustes.",
    category: "vestido",
    priority: "high",
    monthsBefore: 8,
  },
  {
    id: "task-6m",
    title: "Contratar fotografía, video y música",
    detail: "Cerrá los proveedores clave de registro y ambiente.",
    category: "proveedores",
    priority: "medium",
    monthsBefore: 6,
  },
  {
    id: "task-4m",
    title: "Definir decoración y temática",
    detail: "Elegí paleta, estilo y elementos de ambientación.",
    category: "decoracion",
    priority: "medium",
    monthsBefore: 4,
  },
  {
    id: "task-2m",
    title: "Confirmar invitados",
    detail: "Enviá invitaciones y armá la lista definitiva.",
    category: "invitados",
    priority: "medium",
    monthsBefore: 2,
  },
  {
    id: "task-1m",
    title: "Pruebas finales y cronograma del día",
    detail: "Última prueba de vestido y armado del minuto a minuto.",
    category: "logistica",
    priority: "high",
    monthsBefore: 1,
  },
  {
    id: "task-1w",
    title: "Confirmar proveedores",
    detail: "Reconfirmá horarios y detalles con cada proveedor.",
    category: "proveedores",
    priority: "high",
    daysBefore: 7,
  },
  {
    id: "task-0",
    title: "Disfrutar la fiesta",
    detail: "Llegó el gran día. ¡A disfrutar!",
    category: "logistica",
    priority: "low",
    daysBefore: 0,
  },
];
