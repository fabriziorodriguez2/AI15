import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { CreateEventForm } from "./CreateEventForm";

export const metadata = {
  title: "Crear mi fiesta · AI15",
};

export default function CrearEventoPage() {
  return (
    <div className="flex h-full flex-col">
      <header className="flex shrink-0 items-center justify-between border-b border-rosa-claro bg-white/90 px-4 py-3 backdrop-blur">
        <Logo size={28} />
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ciruela hover:text-rosa"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Volver
        </Link>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-ciruela">
            Creá tu fiesta
          </h1>
          <p className="mt-1 text-sm text-texto/70">
            Contanos lo esencial. Vas a poder editar todo más adelante.
          </p>
        </div>
        <CreateEventForm />
      </main>
    </div>
  );
}
