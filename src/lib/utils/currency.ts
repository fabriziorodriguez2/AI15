import type { Currency } from "@/types";

/**
 * Formatea un importe en español de Uruguay.
 * UYU se muestra como "$U" y USD como "US$".
 */
export function formatCurrency(amount: number, currency: Currency): string {
  const formatted = new Intl.NumberFormat("es-UY", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(amount));

  const symbol = currency === "UYU" ? "$U" : "US$";
  return `${symbol} ${formatted}`;
}

/** Devuelve el importe correspondiente a un porcentaje del total. */
export function amountFromPercent(total: number, percent: number): number {
  return (total * percent) / 100;
}

/** Verifica que una lista de porcentajes sume exactamente 100. */
export function percentsSumTo100(percents: number[]): boolean {
  const total = percents.reduce((sum, value) => sum + value, 0);
  return Math.abs(total - 100) < 0.001;
}

/** Verifica con tolerancia (útil para respuestas de IA). */
export function percentsCloseTo100(
  percents: number[],
  tolerance = 1,
): boolean {
  const total = percents.reduce((sum, value) => sum + value, 0);
  return Math.abs(total - 100) <= tolerance;
}

/**
 * Reescala una lista de porcentajes para que sume exactamente 100,
 * ajustando el último elemento para absorber el redondeo.
 * Devuelve la misma lista si la suma es 0.
 */
export function normalizeTo100(percents: number[]): number[] {
  const total = percents.reduce((sum, value) => sum + value, 0);
  if (total <= 0) return percents;

  const scaled = percents.map((value) =>
    Math.round((value / total) * 100),
  );
  const scaledTotal = scaled.reduce((sum, value) => sum + value, 0);
  const diff = 100 - scaledTotal;
  if (diff !== 0 && scaled.length > 0) {
    const lastIndex = scaled.length - 1;
    scaled[lastIndex] = (scaled[lastIndex] ?? 0) + diff;
  }
  return scaled;
}
