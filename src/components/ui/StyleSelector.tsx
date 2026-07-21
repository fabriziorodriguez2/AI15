"use client";

import { PARTY_STYLE_LABELS, PARTY_STYLE_OPTIONS, type PartyStyle } from "@/types";
import { cn } from "@/lib/utils/cn";
import { Check } from "lucide-react";

interface StyleSelectorProps {
  value: PartyStyle[];
  onChange: (next: PartyStyle[]) => void;
}

/** Selector múltiple de estilos de fiesta con soporte de teclado. */
export function StyleSelector({ value, onChange }: StyleSelectorProps) {
  const toggle = (style: PartyStyle) => {
    if (value.includes(style)) {
      onChange(value.filter((s) => s !== style));
    } else {
      onChange([...value, style]);
    }
  };

  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Estilos de la fiesta"
    >
      {PARTY_STYLE_OPTIONS.map((style) => {
        const active = value.includes(style);
        return (
          <button
            key={style}
            type="button"
            aria-pressed={active}
            onClick={() => toggle(style)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition",
              active
                ? "border-rosa bg-rosa text-white shadow-soft"
                : "border-rosa-claro bg-white text-ciruela hover:border-rosa hover:bg-rosa-claro/40",
            )}
          >
            {active && <Check size={14} aria-hidden="true" />}
            {PARTY_STYLE_LABELS[style]}
          </button>
        );
      })}
    </div>
  );
}
