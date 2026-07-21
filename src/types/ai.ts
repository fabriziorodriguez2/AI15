export interface BudgetAllocationItem {
  category: string;
  percentage: number;
  amount: number;
  reasoning: string;
}

export interface PlanTimelineItem {
  title: string;
  description: string;
  /** Fecha ISO (YYYY-MM-DD). */
  dueDate: string;
  category: string;
  priority: "low" | "medium" | "high";
}

export interface StyleProposal {
  name: string;
  description: string;
  palette: string[];
  decoration: string;
  cake: string;
  centerpieces: string;
  invitations: string;
  hairAndMakeup: string;
  lighting: string;
}

export interface PlanRecommendation {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  category: string;
}

export interface PlanWarning {
  title: string;
  description: string;
}

/** Contenido del plan tal como lo devuelve y valida la IA. */
export interface AIPlanContent {
  summary: string;
  budgetAllocation: Omit<BudgetAllocationItem, "amount">[];
  timeline: PlanTimelineItem[];
  styleProposal: StyleProposal;
  recommendations: PlanRecommendation[];
  warnings: PlanWarning[];
}

export interface AIPlan {
  id: string;
  eventId: string;
  content: AIPlanContent;
  /** Distribución con importes ya calculados en TypeScript. */
  budgetAllocation: BudgetAllocationItem[];
  generatedAt: string;
  model: string;
  /** Hash de las entradas relevantes; si cambia, el plan queda desactualizado. */
  inputFingerprint: string;
  isOutdated: boolean;
}

/** Distribución de presupuesto generada por IA (feature independiente). */
export interface AIBudgetDistribution {
  allocations: BudgetAllocationItem[];
  generatedAt: string;
  model: string;
  inputFingerprint: string;
  isOutdated: boolean;
}
