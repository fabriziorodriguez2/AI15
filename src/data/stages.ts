export type StageStatus = "hecho" | "en-progreso" | "pendiente";

export interface PlanningStage {
  key: string;
  label: string;
  status: StageStatus;
}

/**
 * Resumen de etapas de planificación (datos de demostración).
 * En una etapa futura, el estado se derivará de las decisiones reales
 * tomadas por la usuaria.
 */
export const PLANNING_STAGES: PlanningStage[] = [
  { key: "concepto", label: "Concepto", status: "hecho" },
  { key: "presupuesto", label: "Presupuesto", status: "hecho" },
  { key: "salon", label: "Salón", status: "en-progreso" },
  { key: "vestido", label: "Vestido", status: "pendiente" },
  { key: "decoracion", label: "Decoración", status: "pendiente" },
  { key: "detalles", label: "Detalles", status: "pendiente" },
];

export const STAGE_STATUS_LABELS: Record<StageStatus, string> = {
  hecho: "Hecho",
  "en-progreso": "En progreso",
  pendiente: "Pendiente",
};
