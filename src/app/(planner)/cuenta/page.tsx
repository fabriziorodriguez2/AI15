"use client";

import Link from "next/link";
import { Pencil, RotateCcw, UserRound, Database } from "lucide-react";
import { useHydratedEvent } from "@/store/use-hydrated-event";
import { useEventStore } from "@/store/event-store";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { HARDCODED_USER } from "@/data/hardcoded-user";
import { PARTY_STYLE_LABELS } from "@/types";
import { formatCurrency } from "@/lib/utils/currency";
import { formatLongDate, parseEventDate } from "@/lib/utils/date";

export default function CuentaPage() {
  const { event, ready } = useHydratedEvent();
  const loadDemoEvent = useEventStore((state) => state.loadDemoEvent);

  if (!ready) return <div className="h-40" aria-hidden="true" />;

  if (!event) {
    return (
      <EmptyState
        title="Sin datos todavía"
        description="Restaurá el usuario de prueba para continuar."
        ctaLabel="Volver al inicio"
        ctaHref="/"
      />
    );
  }

  const eventDate = parseEventDate(event.eventDate);
  const rows: { label: string; value: string }[] = [
    { label: "Quinceañera", value: event.honoreeName },
    {
      label: "Fecha",
      value: eventDate ? formatLongDate(eventDate) : event.eventDate,
    },
    { label: "Ubicación", value: `${event.city}, ${event.department}` },
    { label: "Invitados estimados", value: `${event.guestCount}` },
    {
      label: "Invitados confirmados",
      value: `${event.confirmedGuestCount}`,
    },
    {
      label: "Presupuesto",
      value: formatCurrency(event.totalBudget, event.currency),
    },
    {
      label: "Estilos",
      value: event.styles.map((style) => PARTY_STYLE_LABELS[style]).join(", "),
    },
  ];

  return (
    <div>
      <PageHeader title="Cuenta" subtitle="Tus datos y preferencias." />

      <div className="space-y-6">
        <section className="rounded-2xl bg-mist/55 p-5">
          <div className="flex items-center gap-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white text-rosa shadow-sm">
              <UserRound size={25} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg font-bold text-ciruela">
                  {HARDCODED_USER.displayName}
                </h2>
                <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-rosa">
                  Demo
                </span>
              </div>
              <p className="truncate text-sm text-texto/65">
                {HARDCODED_USER.email}
              </p>
              <p className="mt-0.5 text-xs font-semibold text-texto/45">
                {HARDCODED_USER.role} · {HARDCODED_USER.id}
              </p>
            </div>
          </div>
        </section>

        <section className="surface-section">
          <h2 className="mb-4 font-display text-lg font-bold text-ciruela">
            Datos del evento
          </h2>
          <dl className="divide-y divide-rosa-claro">
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between gap-3 py-2.5 first:pt-0"
              >
                <dt className="text-sm text-texto/60">{row.label}</dt>
                <dd className="max-w-[58%] text-right text-sm font-medium text-ciruela">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
          {event.themeDescription && (
            <p className="mt-4 rounded-xl bg-rosa-fondo p-3 text-sm text-texto/70">
              {event.themeDescription}
            </p>
          )}

          <Link href="/crear-evento" className="btn-secondary mt-6 w-full">
            <Pencil size={16} aria-hidden="true" />
            Editar durante esta sesión
          </Link>
        </section>

        <section className="surface-section">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-rosa-fondo text-rosa">
              <Database size={20} aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-display text-base font-bold text-ciruela">
                Perfil de demostración
              </h2>
              <p className="mt-1.5 text-sm text-texto/70">
                Podés recorrer y editar toda la aplicación. Al recargar, se
                restauran los datos iniciales para que la experiencia siempre
                esté lista para probar.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={loadDemoEvent}
            className="btn-primary mt-4 w-full"
          >
            <RotateCcw size={16} aria-hidden="true" />
            Restaurar datos iniciales
          </button>
        </section>
      </div>
    </div>
  );
}
