import type {
  EventDecision,
  EventProfile,
  Expense,
  Inspiration,
  PlanningTask,
  Provider,
  SelectedProvider,
} from "@/types";
import type { AIContext } from "./context-schema";

interface BuildArgs {
  event: EventProfile;
  expenses: Expense[];
  tasks: PlanningTask[];
  decisions: EventDecision[];
  selectedProviders: SelectedProvider[];
  providers: Provider[];
  inspirations: Inspiration[];
}

/** Arma el contexto que se envía a las rutas de IA a partir del estado. */
export function buildAIContext(args: BuildArgs): AIContext {
  const providerById = new Map(args.providers.map((p) => [p.id, p]));

  return {
    event: {
      honoreeName: args.event.honoreeName,
      eventDate: args.event.eventDate,
      department: args.event.department,
      city: args.event.city,
      guestCount: args.event.guestCount,
      confirmedGuestCount: args.event.confirmedGuestCount,
      totalBudget: args.event.totalBudget,
      currency: args.event.currency,
      styles: args.event.styles,
      themeDescription: args.event.themeDescription,
      favoriteColors: args.event.favoriteColors,
    },
    expenses: args.expenses.map((e) => ({
      category: e.category,
      description: e.description,
      amount: e.amount,
      status: e.status,
    })),
    tasks: args.tasks.map((t) => ({
      title: t.title,
      dueDate: t.dueDate,
      status: t.status,
      priority: t.priority,
    })),
    decisions: args.decisions.map((d) => ({
      category: d.category,
      title: d.title,
      value: d.value,
      confirmed: d.confirmed,
    })),
    selectedProviders: args.selectedProviders
      .filter((s) => s.status !== "discarded")
      .map((s) => {
        const provider = providerById.get(s.providerId);
        return {
          name: provider?.name ?? "Proveedor",
          category: s.category,
          city: provider?.city ?? "",
          status: s.status,
        };
      }),
    inspirations: args.inspirations
      .filter(
        (i) => i.userDescription.trim().length > 0 || i.analysis !== null,
      )
      .map((i) => {
        const analysis = i.analysis;
        const visualSummary = analysis
          ? `Estilos: ${analysis.styles.join(", ")}. Colores: ${analysis.colors
              .map((color) => color.name)
              .join(", ")}. Recomendaciones: ${analysis.recommendations.join("; ")}.`
          : "";
        return {
          description: [i.userDescription.trim(), visualSummary]
            .filter(Boolean)
            .join(" ")
            .slice(0, 400),
        };
      }),
  };
}
