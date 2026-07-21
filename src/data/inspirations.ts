export interface InspirationItem {
  id: string;
  title: string;
  palette: string[];
  /** Nombre del ilustrador SVG local usado como placeholder. */
  illustration: "flores" | "salon" | "vestido" | "torta";
}

/**
 * Inspiraciones de demostración. Las imágenes se resuelven con ilustraciones
 * SVG locales del proyecto, no con URLs externas.
 */
export const MOCK_INSPIRATIONS: InspirationItem[] = [
  {
    id: "insp-01",
    title: "Jardín romántico",
    palette: ["#F8E1EC", "#FF6B91", "#D4AF37"],
    illustration: "flores",
  },
  {
    id: "insp-02",
    title: "Salón elegante",
    palette: ["#6B486B", "#D4AF37", "#FFF6F9"],
    illustration: "salon",
  },
  {
    id: "insp-03",
    title: "Vestido glam",
    palette: ["#FF6B91", "#FFFFFF", "#D4AF37"],
    illustration: "vestido",
  },
  {
    id: "insp-04",
    title: "Mesa dulce",
    palette: ["#F8E1EC", "#E58AA6", "#D4AF37"],
    illustration: "torta",
  },
];
