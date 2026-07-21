/**
 * Parsea una fecha ISO (YYYY-MM-DD) a un Date local a medianoche.
 * Devuelve null si la fecha no es válida.
 */
export function parseEventDate(iso: string): Date | null {
  const parsed = new Date(`${iso}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/** Fecha de hoy a medianoche (hora local). */
export function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/**
 * Días restantes entre hoy y la fecha del evento.
 * Puede ser negativo si la fecha ya pasó.
 */
export function daysUntil(iso: string): number | null {
  const target = parseEventDate(iso);
  if (!target) return null;
  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = target.getTime() - startOfToday().getTime();
  return Math.round(diff / msPerDay);
}

/**
 * Resta meses a una fecha de manera segura, evitando desbordes de día
 * (por ejemplo, 31 de marzo menos 1 mes cae en el último día de febrero).
 */
export function subtractMonths(base: Date, months: number): Date {
  const year = base.getFullYear();
  const month = base.getMonth();
  const day = base.getDate();

  const targetMonthIndex = month - months;
  const result = new Date(base.getTime());
  result.setDate(1);
  result.setFullYear(
    year + Math.floor(targetMonthIndex / 12),
    ((targetMonthIndex % 12) + 12) % 12,
    1,
  );

  const lastDayOfTarget = new Date(
    result.getFullYear(),
    result.getMonth() + 1,
    0,
  ).getDate();
  result.setDate(Math.min(day, lastDayOfTarget));
  return result;
}

/** Convierte un Date a string ISO local (YYYY-MM-DD). */
export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Resta días a una fecha. */
export function subtractDays(base: Date, days: number): Date {
  const result = new Date(base.getTime());
  result.setDate(result.getDate() - days);
  return result;
}

/** Formatea una fecha de manera legible en español (ej: "12 de marzo de 2026"). */
export function formatLongDate(date: Date): string {
  return new Intl.DateTimeFormat("es-UY", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/** Formato corto (ej: "12 mar 2026"). */
export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat("es-UY", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
