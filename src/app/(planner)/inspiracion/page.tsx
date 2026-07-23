"use client";

import { useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  Trash2,
  Save,
  ImageIcon,
  LoaderCircle,
} from "lucide-react";
import { useEventStore } from "@/store/event-store";
import { useStoreReady } from "@/store/use-hydrated-event";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { FileUpload } from "@/components/inspiration/FileUpload";
import { imageToAnalysisVideoDataUrl } from "@/lib/utils/image-to-analysis-video";
import type { InspirationAnalysis } from "@/types";

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
  const [uploadResetKey, setUploadResetKey] = useState(0);

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

  const handleSave = () => {
    if (!canSave || !file) return;
    addInspiration({
      originalFilename: file.name,
      userDescription:
        note.trim() || `Inspiración de estilo ${analysis?.styles.join(", ")}.`,
      analysis,
    });
    setFile(null);
    setNote("");
    setAnalysis(null);
    setAnalysisError(null);
    setUploadResetKey((value) => value + 1);
  };

  return (
    <div>
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
        <div className="rounded-xl border border-[#e2d3a8] bg-white p-5 shadow-card">
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
          disabled={!canSave}
          className="btn-primary w-full"
        >
          <Save size={16} aria-hidden="true" />
          Guardar inspiración
        </button>

        <div className="flex items-start gap-3 rounded-xl bg-rosa-fondo px-4 py-3 text-xs text-texto/60">
          <ShieldCheck size={16} className="shrink-0" aria-hidden="true" />
          Al tocar Analizar, la imagen se procesa temporalmente. Guardamos el
          resultado y tu descripción, no el archivo original.
        </div>

        {/* Inspiraciones guardadas */}
        {inspirations.length > 0 && (
          <div>
            <h2 className="mb-3 font-display text-lg font-bold text-ciruela">
              Guardadas ({inspirations.length})
            </h2>
            <ul className="divide-y divide-[#eadfe5] rounded-xl border border-[#eadfe5] bg-white px-4 shadow-card">
              {inspirations.map((insp) => (
                <li key={insp.id} className="flex items-start gap-3 py-4">
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
                    onClick={() => deleteInspiration(insp.id)}
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
  );
}
