"use client";

import { FormEvent, useState } from "react";
import { Check, Trash2, UserPlus, UsersRound } from "lucide-react";
import { useEventStore } from "@/store/event-store";
import { useStoreReady } from "@/store/use-hydrated-event";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils/cn";

export default function InvitadosPage() {
  const ready = useStoreReady();
  const event = useEventStore((state) => state.event);
  const guests = useEventStore((state) => state.guests);
  const addGuest = useEventStore((state) => state.addGuest);
  const toggleGuest = useEventStore((state) => state.toggleGuest);
  const deleteGuest = useEventStore((state) => state.deleteGuest);
  const [name, setName] = useState("");

  if (!ready) return <div className="h-40" aria-hidden="true" />;

  if (!event) {
    return (
      <EmptyState
        title="Sin lista de invitados"
        description="Creá tu fiesta para empezar a armar la lista."
        ctaLabel="Crear mi fiesta"
        ctaHref="/crear-evento"
      />
    );
  }

  const confirmed = guests.filter((guest) => guest.confirmed).length;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addGuest(name);
    setName("");
  };

  return (
    <div>
      <PageHeader
        title="Invitados"
        subtitle="Anotá cada nombre y marcá quién confirmó. Nada más."
      />

      <section className="mb-5 rounded-2xl bg-mist/60 p-4">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-white text-texto">
            <UsersRound size={20} aria-hidden="true" />
          </span>
          <div>
            <p className="text-2xl font-bold tabular-nums text-texto">
              {confirmed} <span className="text-texto/35">/ {guests.length}</span>
            </p>
            <p className="text-xs font-semibold text-texto/55">
              confirmados · estimación inicial {event.guestCount}
            </p>
          </div>
        </div>
      </section>

      <form onSubmit={submit} className="mb-5 flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="field-input min-w-0 flex-1"
          placeholder="Nombre del invitado"
          aria-label="Nombre del invitado"
          maxLength={80}
        />
        <button type="submit" className="btn-primary shrink-0 px-4" disabled={!name.trim()}>
          <UserPlus size={18} aria-hidden="true" />
          <span className="sr-only">Agregar</span>
        </button>
      </form>

      {guests.length === 0 ? (
        <div className="surface-section text-center">
          <p className="text-sm text-texto/55">
            Tu lista todavía está vacía. Agregá el primer nombre arriba.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-rosa-claro overflow-hidden rounded-2xl border border-rosa-claro bg-white px-4 shadow-card">
          {guests.map((guest) => (
            <li key={guest.id} className="flex min-h-16 items-center gap-3 py-2">
              <button
                type="button"
                onClick={() => toggleGuest(guest.id)}
                aria-label={guest.confirmed ? `Quitar confirmación de ${guest.name}` : `Confirmar a ${guest.name}`}
                aria-pressed={guest.confirmed}
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-full border-2 transition-colors",
                  guest.confirmed
                    ? "border-rosa bg-rosa text-white"
                    : "border-mist text-transparent",
                )}
              >
                <Check size={15} aria-hidden="true" />
              </button>
              <span
                className={cn(
                  "min-w-0 flex-1 truncate text-sm font-semibold text-texto",
                  guest.confirmed && "text-texto/50",
                )}
              >
                {guest.name}
              </span>
              <button
                type="button"
                onClick={() => deleteGuest(guest.id)}
                aria-label={`Eliminar a ${guest.name}`}
                className="grid size-11 place-items-center rounded-xl text-texto/35 hover:bg-[#c0392b]/5 hover:text-[#c0392b]"
              >
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
