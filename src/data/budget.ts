export interface BudgetCategory {
  key: string;
  label: string;
  /** Porcentaje del presupuesto total. La suma debe ser 100. */
  percent: number;
  color: string;
}

/**
 * Distribución inicial de demostración del presupuesto.
 * En una etapa futura, AI15 adaptará estos porcentajes según ciudad,
 * cantidad de invitados, estilo y decisiones previas.
 */
export const DEFAULT_BUDGET_DISTRIBUTION: BudgetCategory[] = [
  { key: "salon", label: "Salón", percent: 35, color: "#FF6B91" },
  { key: "catering", label: "Catering", percent: 20, color: "#D4AF37" },
  { key: "vestido", label: "Vestido", percent: 15, color: "#6B486B" },
  { key: "decoracion", label: "Decoración", percent: 10, color: "#E58AA6" },
  { key: "musica", label: "Música", percent: 8, color: "#B98BC9" },
  { key: "foto", label: "Foto y video", percent: 7, color: "#8FB3D9" },
  { key: "otros", label: "Otros", percent: 5, color: "#C7B5A0" },
];
