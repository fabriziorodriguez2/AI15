import type { EventProfile } from "@/types";

/** Devuelve una fecha ISO (YYYY-MM-DD) a N meses en el futuro. */
function isoMonthsFromNow(months: number): string {
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth() + months, 15);
  const year = target.getFullYear();
  const month = String(target.getMonth() + 1).padStart(2, "0");
  const day = String(target.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Evento de demostración usado por "Ver demo".
 * Se genera con una fecha futura calculada al momento de cargarlo para que
 * el cronograma y los días restantes siempre tengan sentido.
 */
export function buildDemoEvent(): EventProfile {
  const now = new Date().toISOString();
  return {
    id: "demo-event",
    honoreeName: "Sofi",
    eventDate: isoMonthsFromNow(8),
    department: "Montevideo",
    city: "Montevideo",
    guestCount: 150,
    confirmedGuestCount: 60,
    totalBudget: 350000,
    currency: "UYU",
    styles: ["elegante", "romantico"],
    themeDescription:
      "Una noche elegante con toques románticos, luces cálidas y detalles dorados.",
    favoriteColors: ["#FF6B91", "#D4AF37", "#F8E1EC"],
    createdAt: now,
    updatedAt: now,
  };
}
