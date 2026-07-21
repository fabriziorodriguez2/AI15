"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Diálogo de confirmación sencillo, accesible con teclado.
 * Cierra con Escape y atrapa el foco inicial en el botón de cancelar.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[#2f202f]/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-[#eadfe5] bg-white p-6 shadow-soft"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="grid size-11 place-items-center rounded-xl bg-[#c0392b]/10 text-[#c0392b]">
          <AlertTriangle size={20} aria-hidden="true" />
        </span>
        <h2
          id="confirm-title"
          className="mt-4 font-display text-lg font-bold text-ciruela"
        >
          {title}
        </h2>
        <p className="mt-1.5 text-sm text-texto/70">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            ref={cancelRef}
            type="button"
            className="btn-secondary"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#c0392b] px-5 py-2.5 text-[15px] font-semibold text-white transition hover:bg-[#a93226]"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
