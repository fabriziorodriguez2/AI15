/**
 * Resultado de análisis visual. En esta etapa el proxy NO documenta entrada
 * de imágenes, así que `analysis` permanece null (no se simula ningún
 * resultado). El tipo queda definido para cuando exista un payload real.
 */
export interface InspirationAnalysis {
  styles: string[];
  colors: { name: string; hex: string }[];
  textures: string[];
  materials: string[];
  mainElements: string[];
  decorationTips: string[];
  cakeTips: string[];
  centerpieceTips: string[];
  invitationTips: string[];
  hairMakeupTips: string[];
  lightingTips: string[];
  uncertaintyNotes: string;
}

export interface Inspiration {
  id: string;
  eventId: string;
  originalFilename: string;
  userDescription: string;
  /** Data URL local (opcional): solo se guarda si la usuaria lo desea. */
  localPreview?: string;
  /** null hasta que exista un análisis real validado. */
  analysis: InspirationAnalysis | null;
  createdAt: string;
}
