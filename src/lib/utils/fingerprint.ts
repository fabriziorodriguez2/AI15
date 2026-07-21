import type {
  EventDecision,
  EventProfile,
  Expense,
  SelectedProvider,
} from "@/types";

/** Hash estable y determinístico (djb2) de una cadena. */
function djb2(input: string): string {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  // >>> 0 para obtener un entero sin signo.
  return (hash >>> 0).toString(36);
}

export interface FingerprintInput {
  event: EventProfile | null;
  decisions: EventDecision[];
  selectedProviders: SelectedProvider[];
  expenses: Expense[];
}

/**
 * Huella de las entradas que, al cambiar, invalidan un plan de IA.
 * Incluye los datos del evento que afectan las recomendaciones, las
 * decisiones (con su estado de confirmación) y un resumen de gastos.
 */
export function computeInputFingerprint(input: FingerprintInput): string {
  const { event, decisions, selectedProviders, expenses } = input;
  if (!event) return djb2("no-event");

  const eventPart = [
    event.eventDate,
    event.city,
    event.department,
    event.guestCount,
    event.confirmedGuestCount,
    event.totalBudget,
    event.currency,
    [...event.styles].sort().join("|"),
    event.themeDescription,
    [...event.favoriteColors].sort().join("|"),
  ].join("~");

  const decisionsPart = [...decisions]
    .map((d) => `${d.category}:${d.title}:${d.value}:${d.confirmed ? 1 : 0}`)
    .sort()
    .join("|");

  const providersPart = [...selectedProviders]
    .map((p) => `${p.providerId}:${p.status}`)
    .sort()
    .join("|");

  const expensesPart = [...expenses]
    .map((e) => `${e.category}:${e.amount}:${e.status}`)
    .sort()
    .join("|");

  return djb2(
    `${eventPart}##${decisionsPart}##${providersPart}##${expensesPart}`,
  );
}
