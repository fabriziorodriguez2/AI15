"use client";

import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { useHydratedEvent } from "@/store/use-hydrated-event";

/** Header superior dentro del marco (reemplaza a la sidebar). */
export function AppHeader() {
  const { event } = useHydratedEvent();

  return (
    <header className="flex min-h-14 shrink-0 items-center justify-between border-b border-[#eadfe5] bg-white px-4">
      <Link href="/" aria-label="Ir al inicio de AI15">
        <Logo size={28} />
      </Link>
      {event && (
        <span className="max-w-[45%] truncate text-sm font-semibold text-ciruela">
          {event.honoreeName}
        </span>
      )}
    </header>
  );
}
