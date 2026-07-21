"use client";

import { useRef, useState } from "react";
import { ImagePlus, X, RefreshCw } from "lucide-react";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 5;

interface FileUploadProps {
  /** Notifica cuándo hay una imagen previsualizable seleccionada. */
  onFileReady?: (file: File | null) => void;
}

/**
 * Selector de imagen con previsualización local.
 * Valida tipo (JPG/PNG/WEBP) y tamaño máximo (5 MB).
 * No envía la imagen a ningún servicio externo en esta etapa.
 */
export function FileUpload({ onFileReady }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = (fileList: FileList | null) => {
    setError(null);
    const file = fileList?.[0];
    if (!file) return;

    if (!ACCEPTED.includes(file.type)) {
      setError("El formato debe ser JPG, PNG o WEBP.");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`La imagen no puede superar los ${MAX_SIZE_MB} MB.`);
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onFileReady?.(file);
  };

  const clear = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
    onFileReady?.(null);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        className="sr-only"
        aria-label="Seleccionar imagen de inspiración"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {!previewUrl ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex min-h-52 w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-rosa/35 bg-white px-6 py-10 text-center transition hover:border-rosa hover:bg-rosa-fondo"
        >
          <span className="grid size-14 place-items-center rounded-xl bg-rosa-fondo text-rosa">
            <ImagePlus size={26} aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold text-ciruela">
            Seleccionar una imagen
          </span>
          <span className="text-xs text-texto/60">
            JPG, PNG o WEBP · hasta {MAX_SIZE_MB} MB
          </span>
        </button>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#eadfe5] bg-white">
          {/* Previsualización local; no se sube a ningún servidor. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Previsualización de la inspiración seleccionada"
            className="max-h-80 w-full object-contain bg-rosa-fondo"
          />
          <div className="flex items-center justify-end gap-2 border-t border-rosa-claro p-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="btn-secondary px-4 py-2 text-xs"
            >
              <RefreshCw size={14} aria-hidden="true" />
              Cambiar
            </button>
            <button
              type="button"
              onClick={clear}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-[#c0392b]/30 px-4 py-2 text-xs font-semibold text-[#c0392b] transition hover:bg-[#c0392b]/5"
            >
              <X size={14} aria-hidden="true" />
              Eliminar
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-2 text-xs font-medium text-[#c0392b]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
