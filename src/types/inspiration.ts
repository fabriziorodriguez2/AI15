/** Resultado real y validado del análisis visual con Gemini. */
export interface InspirationAnalysis {
  styles: string[];
  colors: { name: string; hex: string }[];
  mainElements: string[];
  recommendations: string[];
  uncertaintyNotes: string;
}

export interface Inspiration {
  id: string;
  eventId: string;
  originalFilename: string;
  userDescription: string;
  /** Data URL local (opcional): solo se guarda si la usuaria lo desea. */
  localPreview?: string;
  /** null hasta que la usuaria solicite un análisis real. */
  analysis: InspirationAnalysis | null;
  createdAt: string;
}
