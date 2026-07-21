"use client";

import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { useHydratedEvent } from "@/store/use-hydrated-event";

/** Header superior dentro del marco (reemplaza a la sidebar). */
export function AppHeader() {
  const { event } = useHydratedEvent();

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-rosa-claro bg-white/90 px-4 py-3 backdrop-blur">
      <Link href="/" aria-label="Ir al inicio de AI15">
        <Logo size={28} />
      </Link>
      {event && (
        <span className="max-w-[45%] truncate rounded-full bg-rosa-claro px-3 py-1 text-xs font-semibold text-ciruela">
          {event.honoreeName}
        </span>
      )}
    </header>
  );
}
