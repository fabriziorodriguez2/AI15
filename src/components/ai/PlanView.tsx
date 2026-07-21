"use client";

import { useState } from "react";
import {
  CalendarPlus,
  Wallet,
  Palette,
  Lightbulb,
  AlertTriangle,
  Check,
} from "lucide-react";
import type { AIPlan, Currency } from "@/types";
import { useEventStore } from "@/store/event-store";
import { formatCurrency } from "@/lib/utils/currency";
import { formatShortDate } from "@/lib/utils/date";

const PRIORITY_LABEL: Record<string, string> = {
  high: "Alta",
  medium: "Media",
  low: "Baja",
};

export function PlanView({
  plan,
  currency,
}: {
  plan: AIPlan;
  currency: Currency;
}) {
  const importPlanTasks = useEventStore((s) => s.importPlanTasks);
  const [imported, setImported] = useState<number | null>(null);

  const handleImport = () => {
    const count = importPlanTasks(
      plan.content.timeline.map((t) => ({
        title: t.title,
        description: t.description,
        dueDate: t.dueDate,
        priority: t.priority,
      })),
    );
    setImported(count);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between text-[11px] text-texto/50">
        <span>
          {plan.model} · {formatShortDate(new Date(plan.generatedAt))}
        </span>
        {plan.isOutdated && (
          <span className="font-semibold text-dorado">Desactualizado</span>
        )}
      </div>

      {/* Resumen */}
      <section className="card">
        <h2 className="font-display text-lg font-bold text-ciruela">Resumen</h2>
        <p className="mt-2 whitespace-pre-line text-sm text-texto/80">
          {plan.content.summary}
        </p>
      </section>

      {/* Presupuesto */}
      <section className="card">
        <div className="flex items-center gap-2">
          <Wallet size={18} className="text-rosa" aria-hidden="true" />
          <h2 className="font-display text-lg font-bold text-ciruela">
            Distribución del presupuesto
          </h2>
        </div>
        <ul className="mt-3 divide-y divide-rosa-claro">
          {plan.budgetAllocation.map((a) => (
            <li key={a.category} className="py-2.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium capitalize text-ciruela">
                  {a.category}
                </span>
                <span className="text-sm font-semibold text-ciruela">
                  {a.percentage}% · {formatCurrency(a.amount, currency)}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-texto/60">{a.reasoning}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Estética */}
      <section className="card">
        <div className="flex items-center gap-2">
          <Palette size={18} className="text-rosa" aria-hidden="true" />
          <h2 className="font-display text-lg font-bold text-ciruela">
            Propuesta estética
          </h2>
        </div>
        <p className="mt-2 text-sm font-semibold text-ciruela">
          {plan.content.styleProposal.name}
        </p>
        <p className="mt-1 text-sm text-texto/80">
          {plan.content.styleProposal.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {plan.content.styleProposal.palette.map((c, i) => (
            <span
              key={`${c}-${i}`}
              className="rounded-full bg-rosa-fondo px-2.5 py-1 text-[11px] text-ciruela"
            >
              {c}
            </span>
          ))}
        </div>
        <dl className="mt-4 space-y-2 text-sm">
          {(
            [
              ["Decoración", plan.content.styleProposal.decoration],
              ["Torta", plan.content.styleProposal.cake],
              ["Centros de mesa", plan.content.styleProposal.centerpieces],
              ["Invitaciones", plan.content.styleProposal.invitations],
              ["Peinado y maquillaje", plan.content.styleProposal.hairAndMakeup],
              ["Iluminación", plan.content.styleProposal.lighting],
            ] as const
          )
            .filter(([, value]) => value)
            .map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs font-semibold text-ciruela">{label}</dt>
                <dd className="text-texto/70">{value}</dd>
              </div>
            ))}
        </dl>
      </section>

      {/* Cronograma */}
      <section className="card">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CalendarPlus size={18} className="text-rosa" aria-hidden="true" />
            <h2 className="font-display text-lg font-bold text-ciruela">
              Cronograma sugerido
            </h2>
          </div>
        </div>
        <ol className="space-y-2">
          {plan.content.timeline.map((t, i) => (
            <li key={`${t.title}-${i}`} className="rounded-xl bg-rosa-fondo p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-ciruela">{t.title}</p>
                <time className="shrink-0 text-[11px] text-texto/50">
                  {t.dueDate}
                </time>
              </div>
              {t.description && (
                <p className="mt-0.5 text-xs text-texto/60">{t.description}</p>
              )}
            </li>
          ))}
        </ol>
        <button onClick={handleImport} className="btn-secondary mt-3 w-full">
          {imported !== null ? (
            <>
              <Check size={16} aria-hidden="true" />
              {imported > 0
                ? `${imported} tarea(s) agregada(s) al cronograma`
                : "Ya estaban en tu cronograma"}
            </>
          ) : (
            <>
              <CalendarPlus size={16} aria-hidden="true" />
              Agregar estas tareas a mi cronograma
            </>
          )}
        </button>
      </section>

      {/* Recomendaciones */}
      {plan.content.recommendations.length > 0 && (
        <section className="card">
          <div className="flex items-center gap-2">
            <Lightbulb size={18} className="text-rosa" aria-hidden="true" />
            <h2 className="font-display text-lg font-bold text-ciruela">
              Recomendaciones
            </h2>
          </div>
          <ul className="mt-3 space-y-2">
            {plan.content.recommendations.map((r, i) => (
              <li key={`${r.title}-${i}`} className="rounded-xl border border-rosa-claro p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-ciruela">{r.title}</p>
                  <span className="shrink-0 rounded-full bg-rosa-claro px-2 py-0.5 text-[10px] font-semibold text-rosa">
                    {PRIORITY_LABEL[r.priority] ?? r.priority}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-texto/70">{r.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Advertencias */}
      {plan.content.warnings.length > 0 && (
        <section className="card border-dorado/40">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-dorado" aria-hidden="true" />
            <h2 className="font-display text-lg font-bold text-ciruela">
              Advertencias
            </h2>
          </div>
          <ul className="mt-3 space-y-2">
            {plan.content.warnings.map((w, i) => (
              <li key={`${w.title}-${i}`} className="text-sm">
                <p className="font-semibold text-ciruela">{w.title}</p>
                <p className="text-texto/70">{w.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
