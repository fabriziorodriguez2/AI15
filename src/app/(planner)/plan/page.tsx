"use client";

import { useEventStore } from "@/store/event-store";
import { useStoreReady } from "@/store/use-hydrated-event";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { AIStatusCard } from "@/components/ui/AIStatusCard";
import { PlanView } from "@/components/ai/PlanView";

export default function PlanPage() {
  const ready = useStoreReady();
  const event = useEventStore((s) => s.event);
  const aiPlan = useEventStore((s) => s.aiPlan);

  if (!ready) return <div className="h-40" aria-hidden="true" />;

  if (!event) {
    return (
      <EmptyState
        title="Sin plan todavía"
        description="Creá tu fiesta para generar un plan personalizado con IA."
        ctaLabel="Crear mi fiesta"
        ctaHref="/crear-evento"
      />
    );
  }

  return (
    <div>
      <PageHeader
        title="Mi plan"
        subtitle="Un plan personalizado generado con IA a partir de tus datos."
      />

      <div className="mb-5">
        <AIStatusCard variant="full" />
      </div>

      {aiPlan ? (
        <PlanView plan={aiPlan} currency={event.currency} />
      ) : (
        <div className="card py-8 text-center text-sm text-texto/60">
          Todavía no generaste tu plan. Usá el botón de arriba cuando tengas tu
          presupuesto y estilo definidos.
        </div>
      )}
    </div>
  );
}
