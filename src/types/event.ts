export type Currency = "UYU" | "USD";

export type PartyStyle =
  | "romantico"
  | "elegante"
  | "moderno"
  | "glam"
  | "boho"
  | "clasico"
  | "tematico";

export interface EventProfile {
  id: string;
  honoreeName: string;
  /** Fecha del evento en formato ISO (YYYY-MM-DD). */
  eventDate: string;
  department: string;
  city: string;
  guestCount: number;
  /** Invitados que ya confirmaron asistencia (ingresado por la usuaria). */
  confirmedGuestCount: number;
  totalBudget: number;
  currency: Currency;
  styles: PartyStyle[];
  themeDescription: string;
  favoriteColors: string[];
  /** Foto opcional guardada localmente para personalizar el inicio. */
  profilePhoto?: string;
  createdAt: string;
  updatedAt: string;
}

export const PARTY_STYLE_LABELS: Record<PartyStyle, string> = {
  romantico: "Romántico",
  elegante: "Elegante",
  moderno: "Moderno",
  glam: "Glam",
  boho: "Boho",
  clasico: "Clásico",
  tematico: "Temático",
};

export const PARTY_STYLE_OPTIONS: PartyStyle[] = [
  "romantico",
  "elegante",
  "moderno",
  "glam",
  "boho",
  "clasico",
  "tematico",
];
