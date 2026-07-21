import type { Currency } from "./event";

export type ProviderCategory =
  | "salones"
  | "fotografia"
  | "vestidos"
  | "musica"
  | "decoracion"
  | "catering";

export interface Provider {
  id: string;
  /** Los proveedores del catálogo demo tienen esta bandera en true. */
  eventId?: string;
  name: string;
  category: ProviderCategory;
  department: string;
  city: string;
  /** Precio aproximado de referencia (en la moneda indicada). */
  priceFrom: number;
  priceTo: number;
  currency: Currency;
  /** Capacidad máxima de invitados (solo para salones/catering). */
  capacity?: number;
  rating?: number;
  description: string;
  tags: string[];
  contact?: string;
  website?: string;
  instagram?: string;
  notes?: string;
  /** true = dato ficticio de demostración; false/undefined = cargado por la usuaria. */
  isMock?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type SelectedProviderStatus =
  | "considering"
  | "contacted"
  | "confirmed"
  | "discarded";

export interface SelectedProvider {
  id: string;
  eventId: string;
  providerId: string;
  category: ProviderCategory;
  status: SelectedProviderStatus;
  notes: string;
  createdAt: string;
}

export const PROVIDER_CATEGORY_LABELS: Record<ProviderCategory, string> = {
  salones: "Salones",
  fotografia: "Fotografía y video",
  vestidos: "Vestidos",
  musica: "DJs y música",
  decoracion: "Decoración",
  catering: "Catering",
};

export const PROVIDER_CATEGORY_OPTIONS: ProviderCategory[] = [
  "salones",
  "fotografia",
  "vestidos",
  "musica",
  "decoracion",
  "catering",
];

export const SELECTED_PROVIDER_STATUS_LABELS: Record<
  SelectedProviderStatus,
  string
> = {
  considering: "En consideración",
  contacted: "Contactado",
  confirmed: "Confirmado",
  discarded: "Descartado",
};
