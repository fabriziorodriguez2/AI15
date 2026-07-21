import type { Currency } from "./event";

export type ExpenseStatus = "estimated" | "reserved" | "paid";

/** Categorías de gasto (alineadas con la distribución de presupuesto). */
export type ExpenseCategory =
  | "salon"
  | "catering"
  | "vestido"
  | "decoracion"
  | "musica"
  | "foto"
  | "otros";

export interface Expense {
  id: string;
  eventId: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  currency: Currency;
  status: ExpenseStatus;
  createdAt: string;
  updatedAt: string;
}

export const EXPENSE_STATUS_LABELS: Record<ExpenseStatus, string> = {
  estimated: "Estimado",
  reserved: "Reservado",
  paid: "Pagado",
};

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  salon: "Salón",
  catering: "Catering",
  vestido: "Vestido",
  decoracion: "Decoración",
  musica: "Música",
  foto: "Foto y video",
  otros: "Otros",
};

export const EXPENSE_CATEGORY_OPTIONS: ExpenseCategory[] = [
  "salon",
  "catering",
  "vestido",
  "decoracion",
  "musica",
  "foto",
  "otros",
];
