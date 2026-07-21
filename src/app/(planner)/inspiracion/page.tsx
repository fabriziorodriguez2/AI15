"use client";

import { useState } from "react";
import { Sparkles, ShieldCheck, Trash2, Save, ImageIcon } from "lucide-react";
import { useEventStore } from "@/store/event-store";
import { useStoreReady } from "@/store/use-hydrated-event";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { FileUpload } from "@/components/inspiration/FileUpload";

export default function InspiracionPage() {
  const ready = useStoreReady();
  const event = useEventStore((s) => s.event);
  const inspirations = useEventStore((s) => s.inspirations);
  const addInspiration = useEventStore((s) => s.addInspiration);
  const deleteInspiration = useEventStore((s) => s.deleteInspiration);

  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState("");

  if (!ready) return <div className="h-40" aria-hidden="true" />;

  if (!event) {
    return (
      <EmptyState
        title="Sin inspiración todavía"
        description="Creá tu fiesta para guardar tus inspiraciones."
        ctaLabel="Crear mi fiesta"
        ctaHref="/crear-evento"
      />
    );
  }

  const canSave = !!file && note.trim().length > 0;

  const handleSave = () => {
    if (!canSave || !file) return;
    addInspiration({
      originalFilename: file.name,
      userDescription: note.trim(),
    });
    setFile(null);
    setNote("");
  };

  return (
    <div>
      <PageHeader
        title="Inspiración"
        subtitle="Subí una imagen y describí qué te gusta."
      />

      <div className="space-y-5">
        <FileUpload onFileReady={setFile} />

        <div>
          <label htmlFor="insp-note" className="field-label">
            ¿Qué te gusta de esta inspiración?
          </label>
          <textarea
            id="insp-note"
            rows={3}
            className="field-input resize-none"
            placeholder="Ej: me encantan los tonos dorados y las luces cálidas."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <p className="mt-1 text-xs text-texto/50">
            Guardamos tu descripción (no la imagen) para que AI15 la tenga en
            cuenta al generar tu plan.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={!canSave}
          className="btn-primary w-full"
        >
          <Save size={16} aria-hidden="true" />
          Guardar inspiración
        </button>

        {/* Análisis con IA: honestamente no disponible. */}
        <div className="card border-dorado/40">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-dorado/15 text-dorado">
              <Sparkles size={20} aria-hidden="true" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-base font-bold text-ciruela">
                  Analizar con IA
                </h2>
                <span className="chip bg-texto/10 text-texto/60">
                  No disponible
                </span>
              </div>
              <p className="mt-1.5 text-sm text-texto/70">
                El análisis visual todavía no está disponible: el servicio de IA
                que usamos no admite (por ahora) recibir imágenes para
                analizarlas. No mostramos resultados inventados. Cuando exista un
                método soportado, lo activaremos y te avisaremos que la imagen
                será procesada por IA.
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled
            aria-disabled="true"
            title="No disponible todavía"
            className="btn-primary mt-4 w-full cursor-not-allowed opacity-50"
          >
            <Sparkles size={16} aria-hidden="true" />
            Analizar imagen
          </button>
        </div>

        <div className="flex items-start gap-3 rounded-xl bg-rosa-fondo px-4 py-3 text-xs text-texto/60">
          <ShieldCheck size={16} className="shrink-0" aria-hidden="true" />
          Tu imagen se previsualiza únicamente en este navegador y no se envía a
          ningún servicio.
        </div>

        {/* Inspiraciones guardadas */}
        {inspirations.length > 0 && (
          <div>
            <h2 className="mb-3 font-display text-lg font-bold text-ciruela">
              Guardadas ({inspirations.length})
            </h2>
            <ul className="space-y-2">
              {inspirations.map((insp) => (
                <li key={insp.id} className="card flex items-start gap-3 p-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-rosa-claro text-rosa">
                    <ImageIcon size={16} aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-texto/50">
                      {insp.originalFilename}
                    </p>
                    <p className="text-sm text-ciruela">
                      {insp.userDescription}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteInspiration(insp.id)}
                    aria-label="Eliminar inspiración"
                    className="grid size-8 shrink-0 place-items-center rounded-lg text-texto/50 hover:bg-[#c0392b]/10 hover:text-[#c0392b]"
                  >
                    <Trash2 size={15} aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
