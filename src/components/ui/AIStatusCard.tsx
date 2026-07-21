"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, RefreshCw, AlertTriangle, Eye, ArrowRight } from "lucide-react";
import { useEventStore } from "@/store/event-store";
import { Modal } from "@/components/ui/Modal";
import { buildAIContext } from "@/lib/ai/build-context";
import { requestPlan } from "@/lib/ai/request";

type Phase = "idle" | "loading" | "error";

interface AIStatusCardProps {
  /** compact: para el dashboard (con enlace a /plan). full: en la página del plan. */
  variant?: "compact" | "full";
}

export function AIStatusCard({ variant = "compact" }: AIStatusCardProps) {
  const event = useEventStore((s) => s.event);
  const expenses = useEventStore((s) => s.expenses);
  const tasks = useEventStore((s) => s.tasks);
  const decisions = useEventStore((s) => s.decisions);
  const selectedProviders = useEventStore((s) => s.selectedProviders);
  const providers = useEventStore((s) => s.providers);
  const inspirations = useEventStore((s) => s.inspirations);
  const aiPlan = useEventStore((s) => s.aiPlan);
  const saveAIPlan = useEventStore((s) => s.saveAIPlan);

  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!event) return null;

  const missingInfo = event.totalBudget <= 0 || event.styles.length === 0;

  const runGeneration = async () => {
    setConfirmOpen(false);
    setPhase("loading");
    setError(null);
    const context = buildAIContext({
      event,
      expenses,
      tasks,
      decisions,
      selectedProviders,
      providers,
      inspirations,
    });
    const res = await requestPlan(context);
    if (res.ok) {
      saveAIPlan({
        content: res.content,
        budgetAllocation: res.budgetAllocation,
        model: res.model,
      });
      setPhase("idle");
    } else {
      setError(res.error);
      setPhase("error");
    }
  };

  // Determinar estado visible.
  let statusLabel: string;
  let description: string;
  if (missingInfo) {
    statusLabel = "Falta información";
    description =
      "Completá tu presupuesto y al menos un estilo para generar un plan personalizado.";
  } else if (phase === "loading") {
    statusLabel = "Generando";
    description = "Estamos armando tu plan con IA. Puede tardar unos segundos.";
  } else if (phase === "error") {
    statusLabel = "Error";
    description = error ?? "No pudimos generar el plan.";
  } else if (aiPlan && aiPlan.isOutdated) {
    statusLabel = "Plan desactualizado";
    description =
      "Cambiaron datos importantes desde que se generó tu plan. Podés regenerarlo cuando quieras.";
  } else if (aiPlan) {
    statusLabel = "Plan generado";
    description = "Tu plan personalizado está listo.";
  } else {
    statusLabel = "Listo para generar";
    description =
      "AI15 puede crear un plan completo: presupuesto, cronograma, estética y recomendaciones.";
  }

  return (
    <div className="rounded-xl border border-[#e2d3a8] bg-white p-5 shadow-card">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-dorado/10 text-[#9a7b19]">
          {aiPlan?.isOutdated ? (
            <AlertTriangle size={20} aria-hidden="true" />
          ) : (
            <Sparkles size={20} aria-hidden="true" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-bold text-ciruela">
              Asistente AI15
            </h3>
            <span className="rounded-md bg-dorado/10 px-2 py-1 text-[11px] font-semibold text-[#806816]">
              {statusLabel}
            </span>
          </div>
          <p className="mt-1.5 text-sm text-texto/70">{description}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {missingInfo ? (
          <Link href="/crear-evento" className="btn-primary">
            Completar datos
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        ) : (
          <>
            <button
              onClick={() => setConfirmOpen(true)}
              disabled={phase === "loading"}
              className="btn-primary"
            >
              {phase === "loading" ? (
                <>
                  <RefreshCw size={16} className="animate-spin" aria-hidden="true" />
                  Generando…
                </>
              ) : aiPlan ? (
                <>
                  <RefreshCw size={16} aria-hidden="true" />
                  Regenerar plan
                </>
              ) : (
                <>
                  <Sparkles size={16} aria-hidden="true" />
                  Generar mi plan con AI15
                </>
              )}
            </button>

            {phase === "error" && (
              <button onClick={runGeneration} className="btn-secondary">
                Reintentar
              </button>
            )}

            {aiPlan && variant === "compact" && (
              <Link href="/plan" className="btn-secondary">
                <Eye size={16} aria-hidden="true" />
                Ver plan
              </Link>
            )}
          </>
        )}
      </div>

      {/* Confirmación previa: qué datos se envían + aviso de uso de IA. */}
      <Modal
        open={confirmOpen}
        title="Generar plan con IA"
        onClose={() => setConfirmOpen(false)}
      >
        <div className="space-y-3 text-sm text-texto/70">
          <p>
            Vamos a enviar estos datos a un servicio de IA (Gemini) para armar
            tu plan. No se comparten datos de contacto ni imágenes.
          </p>
          <ul className="space-y-1 border-y border-[#eadfe5] py-3 text-xs">
            <li>• Fiesta de {event.honoreeName} · {event.city}</li>
            <li>• {event.guestCount} invitados · {event.currency} {event.totalBudget}</li>
            <li>• {event.styles.length} estilo(s), temática y colores</li>
            <li>• {expenses.length} gasto(s)</li>
            <li>• {decisions.length} decisión(es)</li>
            <li>• {selectedProviders.length} proveedor(es) seleccionado(s)</li>
          </ul>
          <div className="flex justify-end gap-3 pt-1">
            <button
              onClick={() => setConfirmOpen(false)}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button onClick={runGeneration} className="btn-primary">
              <Sparkles size={16} aria-hidden="true" />
              Generar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
