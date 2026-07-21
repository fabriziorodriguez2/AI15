"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Lock } from "lucide-react";
import { useEventStore } from "@/store/event-store";
import { useStoreReady } from "@/store/use-hydrated-event";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { DecisionForm } from "@/components/decisions/DecisionForm";
import { DECISION_CATEGORY_LABELS, type EventDecision } from "@/types";

export default function DecisionesPage() {
  const ready = useStoreReady();
  const event = useEventStore((s) => s.event);
  const decisions = useEventStore((s) => s.decisions);
  const addDecision = useEventStore((s) => s.addDecision);
  const updateDecision = useEventStore((s) => s.updateDecision);
  const deleteDecision = useEventStore((s) => s.deleteDecision);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<EventDecision | null>(null);
  const [toDelete, setToDelete] = useState<EventDecision | null>(null);

  if (!ready) return <div className="h-40" aria-hidden="true" />;

  if (!event) {
    return (
      <EmptyState
        title="Sin decisiones todavía"
        description="Creá tu fiesta para empezar a registrar tus decisiones."
        ctaLabel="Crear mi fiesta"
        ctaHref="/crear-evento"
      />
    );
  }

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  return (
    <div>
      <PageHeader
        title="Decisiones"
        subtitle="Guardá lo que ya elegiste. Las decisiones confirmadas guían a la IA."
        action={
          <button onClick={openNew} className="btn-primary px-4 py-2 text-xs">
            <Plus size={15} aria-hidden="true" />
            Decisión
          </button>
        }
      />

      {decisions.length === 0 ? (
        <div className="surface-section px-5 text-center">
          <p className="text-sm text-texto/60">
            Todavía no registraste decisiones. Anotá el salón, el vestido, la
            paleta o cualquier elección para mantener la coherencia.
          </p>
          <button onClick={openNew} className="btn-primary mt-4">
            <Plus size={16} aria-hidden="true" />
            Agregar decisión
          </button>
        </div>
      ) : (
        <ul className="divide-y divide-[#eadfe5] rounded-xl border border-[#eadfe5] bg-white px-4 shadow-card">
          {decisions.map((decision) => (
            <li key={decision.id} className="py-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="chip">
                      {DECISION_CATEGORY_LABELS[decision.category]}
                    </span>
                    {decision.confirmed && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-dorado/10 px-2 py-0.5 text-[10px] font-semibold text-[#8f7420]">
                        <Lock size={10} aria-hidden="true" />
                        Confirmada
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-sm font-semibold text-ciruela">
                    {decision.title}
                  </p>
                  <p className="text-sm text-texto/70">{decision.value}</p>
                  {decision.notes && (
                    <p className="mt-1 text-xs text-texto/50">
                      {decision.notes}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => {
                      setEditing(decision);
                      setFormOpen(true);
                    }}
                    aria-label="Editar decisión"
                    className="grid size-11 place-items-center rounded-lg text-texto/50 hover:bg-rosa-fondo hover:text-ciruela"
                  >
                    <Pencil size={15} aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => setToDelete(decision)}
                    aria-label="Eliminar decisión"
                    className="grid size-11 place-items-center rounded-lg text-texto/50 hover:bg-[#c0392b]/10 hover:text-[#c0392b]"
                  >
                    <Trash2 size={15} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={formOpen}
        title={editing ? "Editar decisión" : "Nueva decisión"}
        onClose={() => setFormOpen(false)}
      >
        <DecisionForm
          initial={editing ?? undefined}
          onCancel={() => setFormOpen(false)}
          onSubmit={(input) => {
            if (editing) updateDecision(editing.id, input);
            else addDecision(input);
            setFormOpen(false);
          }}
        />
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        title="¿Eliminar decisión?"
        description="Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) deleteDecision(toDelete.id);
          setToDelete(null);
        }}
      />
    </div>
  );
}
