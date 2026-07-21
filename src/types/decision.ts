export type DecisionCategory =
  | "salon"
  | "vestido"
  | "paleta"
  | "estilo"
  | "musica"
  | "fotografia"
  | "torta"
  | "decoracion"
  | "invitaciones"
  | "restriccion"
  | "otros";

export interface EventDecision {
  id: string;
  eventId: string;
  category: DecisionCategory;
  title: string;
  /** Valor concreto elegido (ej: "Salón Jacarandá", "Rosa empolvado"). */
  value: string;
  notes: string;
  /** Una decisión confirmada se trata como restricción para la IA. */
  confirmed: boolean;
  createdAt: string;
  updatedAt: string;
}

export const DECISION_CATEGORY_LABELS: Record<DecisionCategory, string> = {
  salon: "Salón",
  vestido: "Vestido",
  paleta: "Paleta",
  estilo: "Estilo",
  musica: "Música / DJ",
  fotografia: "Fotografía",
  torta: "Torta",
  decoracion: "Decoración",
  invitaciones: "Invitaciones",
  restriccion: "Restricción",
  otros: "Otros",
};

export const DECISION_CATEGORY_OPTIONS: DecisionCategory[] = [
  "salon",
  "vestido",
  "paleta",
  "estilo",
  "musica",
  "fotografia",
  "torta",
  "decoracion",
  "invitaciones",
  "restriccion",
  "otros",
];
