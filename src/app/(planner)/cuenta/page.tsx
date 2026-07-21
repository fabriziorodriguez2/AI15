"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Cloud, HardDrive } from "lucide-react";
import { useHydratedEvent } from "@/store/use-hydrated-event";
import { useEventStore } from "@/store/event-store";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PARTY_STYLE_LABELS } from "@/types";
import { formatCurrency } from "@/lib/utils/currency";
import { formatLongDate, parseEventDate } from "@/lib/utils/date";

export default function CuentaPage() {
  const router = useRouter();
  const { event, ready } = useHydratedEvent();
  const clearEvent = useEventStore((state) => state.clearEvent);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!ready) return <div className="h-40" aria-hidden="true" />;

  if (!event) {
    return (
      <EmptyState
        title="Sin datos todavía"
        description="Creá tu fiesta para ver y administrar tus datos."
        ctaLabel="Crear mi fiesta"
        ctaHref="/crear-evento"
      />
    );
  }

  const eventDate = parseEventDate(event.eventDate);

  const handleDelete = () => {
    clearEvent();
    setConfirmOpen(false);
    router.push("/");
  };

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
      value: event.styles.map((s) => PARTY_STYLE_LABELS[s]).join(", "),
    },
  ];

  return (
    <div>
      <PageHeader title="Cuenta" subtitle="Tus datos y preferencias." />

      <div className="space-y-6">
        <div className="surface-section">
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
                <dd className="text-sm font-medium text-ciruela">
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

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/crear-evento" className="btn-secondary">
              <Pencil size={16} aria-hidden="true" />
              Editar evento
            </Link>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#c0392b]/30 px-5 py-2.5 text-[15px] font-semibold text-[#c0392b] transition hover:bg-[#c0392b]/5"
            >
              <Trash2 size={16} aria-hidden="true" />
              Borrar datos locales
            </button>
          </div>
        </div>

        <div className="surface-section">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-rosa-fondo text-rosa">
              <HardDrive size={20} aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-display text-base font-bold text-ciruela">
                Tus datos están en este navegador
              </h2>
              <p className="mt-1.5 text-sm text-texto/70">
                Por ahora, la información de tu fiesta se guarda localmente en
                este dispositivo. Si borrás los datos del navegador, se
                perderán.
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-rosa-fondo px-4 py-3 text-xs text-texto/60">
            <Cloud size={14} aria-hidden="true" />
            Todavía no existe una cuenta en la nube. La sincronización entre
            dispositivos llegará en una próxima etapa.
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="¿Borrar los datos locales?"
        description="Se eliminará tu fiesta y todo lo asociado (gastos, tareas, decisiones, proveedores, inspiraciones y plan) guardado en este navegador. Esta acción no se puede deshacer."
        confirmLabel="Borrar"
        cancelLabel="Cancelar"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
