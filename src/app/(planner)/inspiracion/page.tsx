"use client";

import { useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  Trash2,
  Save,
  ImageIcon,
  LoaderCircle,
  Maximize2,
} from "lucide-react";
import { useEventStore } from "@/store/event-store";
import { useStoreReady } from "@/store/use-hydrated-event";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { FileUpload } from "@/components/inspiration/FileUpload";
import { imageToAnalysisVideoDataUrl } from "@/lib/utils/image-to-analysis-video";
import { imageFileToPreviewDataUrl } from "@/lib/utils/image-preview";
import type { Inspiration, InspirationAnalysis } from "@/types";

export default function InspiracionPage() {
  const ready = useStoreReady();
  const event = useEventStore((s) => s.event);
  const inspirations = useEventStore((s) => s.inspirations);
  const addInspiration = useEventStore((s) => s.addInspiration);
  const deleteInspiration = useEventStore((s) => s.deleteInspiration);

  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState("");
  const [analysis, setAnalysis] = useState<InspirationAnalysis | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadResetKey, setUploadResetKey] = useState(0);
  const [previewInspiration, setPreviewInspiration] =
    useState<Inspiration | null>(null);
  const [inspirationToDelete, setInspirationToDelete] =
    useState<Inspiration | null>(null);

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

  const canSave = !!file && (note.trim().length > 0 || analysis !== null);

  const handleFileReady = (nextFile: File | null) => {
    setFile(nextFile);
    setAnalysis(null);
    setAnalysisError(null);
  };

  const handleAnalyze = async () => {
    if (!file || isAnalyzing) return;
    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysis(null);

    try {
      const inputVideo = await imageToAnalysisVideoDataUrl(file);
      const response = await fetch("/api/ai/inspiration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputVideo,
          note: note.trim(),
          eventStyle: {
            styles: event.styles,
            favoriteColors: event.favoriteColors,
            themeDescription: event.themeDescription,
          },
        }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        analysis?: InspirationAnalysis;
      };
      if (!response.ok || !data.ok || !data.analysis) {
        throw new Error(data.error || "No pudimos analizar la imagen.");
      }
      setAnalysis(data.analysis);
    } catch (error) {
      setAnalysisError(
        error instanceof Error
          ? error.message
          : "No pudimos analizar la imagen.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!canSave || !file || isSaving) return;
    setIsSaving(true);
    setAnalysisError(null);

    try {
      const localPreview = await imageFileToPreviewDataUrl(file);
      addInspiration({
        originalFilename: file.name,
        userDescription:
          note.trim() || `Inspiración de estilo ${analysis?.styles.join(", ")}.`,
        localPreview,
        analysis,
      });
      setFile(null);
      setNote("");
      setAnalysis(null);
      setUploadResetKey((value) => value + 1);
    } catch (error) {
      setAnalysisError(
        error instanceof Error
          ? error.message
          : "No se pudo guardar la imagen.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative -mx-4 -my-5 min-h-[calc(100%+2.5rem)] overflow-hidden bg-gradient-to-b from-white via-[#f3fffd] to-[#fffaf0] px-4 py-5">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <span className="absolute -right-20 top-10 size-56 rounded-full bg-[#48d8cf]/25 blur-3xl" />
        <span className="absolute -left-24 top-[34rem] size-64 rounded-full bg-dorado/20 blur-3xl" />
        <span className="absolute -right-28 top-[65rem] size-72 rounded-full bg-[#62ddd6]/20 blur-3xl" />
        <span className="absolute left-10 top-[92rem] size-52 rounded-full bg-[#e0bd52]/15 blur-3xl" />
      </div>

      <div className="relative z-10">
        <PageHeader
          title="Inspiración"
          subtitle="Subí una imagen y describí qué te gusta."
        />

        <div className="space-y-5">
        <FileUpload
          onFileReady={handleFileReady}
          resetKey={uploadResetKey}
        />

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
            Tu descripción y el análisis guardado ayudan a personalizar el plan.
          </p>
        </div>

        {/* Análisis visual real con Gemini 2.5 Flash. */}
        <div className="rounded-xl border border-[#e2d3a8] bg-white/90 p-5 shadow-card backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-dorado/10 text-[#8f7420]">
              <Sparkles size={20} aria-hidden="true" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-base font-bold text-ciruela">
                  Analizar con IA
                </h2>
                <span className="chip bg-dorado/15 text-[#6f5815]">
                  Gemini 2.5 Flash
                </span>
              </div>
              <p className="mt-1.5 text-sm text-texto/70">
                Detecta estilos, colores y elementos, y propone ideas para
                adaptar la referencia a tu fiesta.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!file || isAnalyzing}
            className="btn-primary mt-4 w-full"
          >
            {isAnalyzing ? (
              <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />
            ) : (
              <Sparkles size={16} aria-hidden="true" />
            )}
            {isAnalyzing ? "Analizando…" : "Analizar imagen"}
          </button>

          {analysisError && (
            <div
              className="mt-3 rounded-xl bg-[#c0392b]/10 p-3 text-xs font-medium text-[#9f2f24]"
              role="alert"
            >
              {analysisError}
            </div>
          )}

          {analysis && (
            <div className="mt-4 space-y-4 border-t border-rosa-claro pt-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wide text-texto/50">
                  Estilos detectados
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {analysis.styles.map((style) => (
                    <span key={style} className="chip">
                      {style}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wide text-texto/50">
                  Paleta
                </h3>
                <div className="mt-2 grid grid-cols-1 gap-2">
                  {analysis.colors.map((color) => (
                    <div
                      key={`${color.name}-${color.hex}`}
                      className="flex items-center gap-2 text-xs text-ciruela"
                    >
                      <span
                        className="size-7 rounded-full border border-black/10"
                        style={{ backgroundColor: color.hex }}
                        aria-hidden="true"
                      />
                      <span className="font-semibold">{color.name}</span>
                      <span className="text-texto/50">{color.hex}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wide text-texto/50">
                  Recomendaciones
                </h3>
                <ul className="mt-2 space-y-2 text-sm text-texto/75">
                  {analysis.recommendations.map((recommendation) => (
                    <li key={recommendation} className="flex gap-2">
                      <span className="text-rosa" aria-hidden="true">
                        •
                      </span>
                      {recommendation}
                    </li>
                  ))}
                </ul>
              </div>
              {analysis.uncertaintyNotes && (
                <p className="text-xs text-texto/55">
                  {analysis.uncertaintyNotes}
                </p>
              )}
            </div>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={!canSave || isSaving}
          className="btn-primary w-full"
        >
          {isSaving ? (
            <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />
          ) : (
            <Save size={16} aria-hidden="true" />
          )}
          {isSaving ? "Guardando…" : "Guardar inspiración"}
        </button>

        <div className="flex items-start gap-3 rounded-xl bg-rosa-fondo px-4 py-3 text-xs text-texto/60">
          <ShieldCheck size={16} className="shrink-0" aria-hidden="true" />
          Al tocar Analizar, la imagen se procesa temporalmente. Guardamos el
          resultado, tu descripción y una copia optimizada de la imagen.
        </div>

        {/* Inspiraciones guardadas */}
        {inspirations.length > 0 && (
          <div>
            <h2 className="mb-3 font-display text-lg font-bold text-ciruela">
              Guardadas ({inspirations.length})
            </h2>
            <ul className="divide-y divide-[#eadfe5] rounded-xl border border-[#eadfe5] bg-white/90 px-4 shadow-card backdrop-blur-sm">
              {inspirations.map((insp) => (
                <li key={insp.id} className="flex items-start gap-3 py-4">
                  {insp.localPreview ? (
                    <button
                      type="button"
                      onClick={() => setPreviewInspiration(insp)}
                      aria-label="Ampliar imagen de inspiración"
                      className="group relative size-20 shrink-0 overflow-hidden rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-rosa"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={insp.localPreview}
                        alt={`Inspiración: ${insp.userDescription}`}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                      <span className="absolute bottom-1.5 right-1.5 grid size-7 place-items-center rounded-full bg-black/55 text-white">
                        <Maximize2 size={13} aria-hidden="true" />
                      </span>
                    </button>
                  ) : (
                    <span className="grid size-20 shrink-0 place-items-center rounded-xl bg-rosa-claro text-rosa">
                      <ImageIcon size={22} aria-hidden="true" />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-ciruela">
                      {insp.userDescription}
                    </p>
                    {insp.analysis && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {insp.analysis.styles.map((style) => (
                          <span key={style} className="chip text-[10px]">
                            {style}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setInspirationToDelete(insp)}
                    aria-label="Eliminar inspiración"
                    className="grid size-11 shrink-0 place-items-center rounded-lg text-texto/50 hover:bg-[#c0392b]/10 hover:text-[#c0392b]"
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

      <Modal
        open={!!previewInspiration?.localPreview}
        title="Vista ampliada"
        onClose={() => setPreviewInspiration(null)}
      >
        {previewInspiration?.localPreview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewInspiration.localPreview}
            alt={`Inspiración ampliada: ${previewInspiration.userDescription}`}
            className="max-h-[65dvh] w-full rounded-2xl bg-rosa-fondo object-contain"
          />
        )}
      </Modal>

      <ConfirmDialog
        open={!!inspirationToDelete}
        title="¿Eliminar inspiración?"
        description="¿Querés borrar esta imagen y su análisis guardado?"
        confirmLabel="Aceptar"
        cancelLabel="Cancelar"
        onCancel={() => setInspirationToDelete(null)}
        onConfirm={() => {
          if (inspirationToDelete) {
            deleteInspiration(inspirationToDelete.id);
          }
          setInspirationToDelete(null);
        }}
      />
    </div>
  );
}
