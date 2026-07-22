import type { AIContext } from "./context-schema";
import { daysUntil } from "@/lib/utils/date";

/** Reglas comunes para toda generación de la organizadora AI15. */
const SYSTEM_RULES = `Sos la organizadora de fiestas de 15 de AI15. Respondé SIEMPRE en español rioplatense, con tono cercano, claro y elegante, sin infantilizar a la quinceañera.

Reglas estrictas:
- No inventes proveedores, negocios, precios concretos, direcciones ni disponibilidad.
- No superes el presupuesto total indicado.
- Mantené coherencia estética entre vestido, salón, torta, invitaciones, decoración, iluminación, peinado y maquillaje.
- Priorizá según el tiempo restante hasta la fiesta.
- Generá fechas válidas en formato YYYY-MM-DD, anteriores o iguales a la fecha de la fiesta.
- Respetá SIEMPRE las decisiones confirmadas: son restricciones que no se pueden contradecir.
- Señalá la incertidumbre cuando corresponda mediante "warnings".
- Los porcentajes de budgetAllocation deben sumar exactamente 100.
- Devolvé EXCLUSIVAMENTE JSON válido según el esquema. No agregues texto fuera del JSON.`;

function formatContext(ctx: AIContext, today: string): string {
  const e = ctx.event;
  const remaining = daysUntil(e.eventDate);
  const lines: string[] = [];

  lines.push(`Fecha actual: ${today}`);
  lines.push(`Fecha de la fiesta: ${e.eventDate}`);
  lines.push(
    `Días restantes: ${remaining !== null ? remaining : "desconocido"}`,
  );
  lines.push(`Quinceañera: ${e.honoreeName}`);
  lines.push(`Ciudad: ${e.city} (${e.department})`);
  lines.push(`Invitados estimados: ${e.guestCount}`);
  lines.push(`Invitados confirmados: ${e.confirmedGuestCount}`);
  lines.push(`Presupuesto total: ${e.totalBudget} ${e.currency}`);
  lines.push(
    `Estilos elegidos: ${e.styles.length ? e.styles.join(", ") : "sin definir"}`,
  );
  lines.push(`Temática: ${e.themeDescription || "sin definir"}`);
  lines.push(
    `Colores favoritos: ${e.favoriteColors.length ? e.favoriteColors.join(", ") : "sin definir"}`,
  );

  if (ctx.expenses.length) {
    lines.push("");
    lines.push("Gastos registrados:");
    for (const x of ctx.expenses) {
      lines.push(`- ${x.category}: ${x.description} — ${x.amount} (${x.status})`);
    }
  }

  if (ctx.decisions.length) {
    lines.push("");
    lines.push("Decisiones tomadas:");
    for (const d of ctx.decisions) {
      lines.push(
        `- [${d.category}] ${d.title}: ${d.value}${d.confirmed ? " (CONFIRMADA — restricción)" : ""}`,
      );
    }
  }

  if (ctx.selectedProviders.length) {
    lines.push("");
    lines.push("Proveedores seleccionados por la usuaria:");
    for (const p of ctx.selectedProviders) {
      lines.push(`- ${p.name} (${p.category}, ${p.city}) — ${p.status}`);
    }
  }

  if (ctx.inspirations.length) {
    lines.push("");
    lines.push("Inspiraciones descriptas:");
    for (const i of ctx.inspirations) {
      if (i.description) lines.push(`- ${i.description}`);
    }
  }

  return lines.join("\n");
}

export function buildPlanPrompt(ctx: AIContext, today: string): string {
  return [
    "### INSTRUCCIONES",
    SYSTEM_RULES,
    "",
    "### CONTEXTO Y DATOS DEL EVENTO",
    formatContext(ctx, today),
    "",
    "### RESTRICCIONES",
    "- Respetá el presupuesto y las decisiones confirmadas.",
    "- El cronograma debe tener fechas coherentes con los días restantes.",
    "- La propuesta estética debe respetar los estilos y colores elegidos.",
    "",
    "### TAREA",
    "Generá un plan personalizado y coherente para esta fiesta de 15 con: resumen, distribución de presupuesto (con justificación por categoría y suma 100), cronograma priorizado, propuesta estética integral (paleta, decoración, torta, centros de mesa, invitaciones, peinado y maquillaje, iluminación), recomendaciones accionables y advertencias sobre riesgos o datos faltantes.",
    "",
    "### FORMATO DE SALIDA",
    "Respondé únicamente con el JSON que cumple el esquema provisto. Sin texto adicional.",
  ].join("\n");
}

export function buildPlanLogisticsPrompt(
  ctx: AIContext,
  today: string,
): string {
  return [
    "### INSTRUCCIONES",
    SYSTEM_RULES,
    "",
    "### CONTEXTO Y DATOS DEL EVENTO",
    formatContext(ctx, today),
    "",
    "### TAREA",
    "Generá una versión MUY CONCISA de la parte logística del plan.",
    "Incluí exactamente 4 categorías de presupuesto, con justificaciones de máximo 8 palabras y porcentajes que sumen 100.",
    "Incluí exactamente 3 próximas tareas prioritarias. Título de máximo 6 palabras, descripción de máximo 8 palabras y fecha YYYY-MM-DD.",
    "No agregues introducciones ni campos no solicitados.",
    "",
    "### FORMATO DE SALIDA",
    "Respondé solo con el JSON del esquema provisto.",
  ].join("\n");
}

export function buildPlanCreativePrompt(
  ctx: AIContext,
  today: string,
): string {
  return [
    "### INSTRUCCIONES",
    SYSTEM_RULES,
    "",
    "### CONTEXTO Y DATOS DEL EVENTO",
    formatContext(ctx, today),
    "",
    "### TAREA",
    "Generá una versión MUY CONCISA del resumen y la propuesta estética.",
    "El resumen debe tener máximo 30 palabras. Cada campo de estilo debe tener máximo 8 palabras. Incluí 3 colores, exactamente 2 recomendaciones breves y como máximo una advertencia breve.",
    "No incluyas presupuesto ni cronograma. No agregues campos no solicitados.",
    "",
    "### FORMATO DE SALIDA",
    "Respondé solo con el JSON del esquema provisto.",
  ].join("\n");
}

export function buildBudgetPrompt(ctx: AIContext, today: string): string {
  return [
    "### INSTRUCCIONES",
    SYSTEM_RULES,
    "",
    "### CONTEXTO Y DATOS DEL EVENTO",
    formatContext(ctx, today),
    "",
    "### TAREA",
    "Proponé una distribución del presupuesto adaptada a esta fiesta. Incluí entre 4 y 5 categorías, con una justificación de máximo 8 palabras para cada una. Los porcentajes deben sumar exactamente 100. No calcules importes en dinero.",
    "",
    "### FORMATO DE SALIDA",
    "Respondé únicamente con el JSON { allocations: [...] } que cumple el esquema. Sin texto adicional.",
  ].join("\n");
}
