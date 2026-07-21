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
      <header className="flex min-h-14 shrink-0 items-center justify-between border-b border-[#eadfe5] bg-white px-4">
        <Logo size={28} />
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-ciruela hover:text-rosa"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Volver
        </Link>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="w-full">
        <div className="mb-7 border-b border-[#eadfe5] pb-5">
          <h1 className="font-display text-[28px] font-bold text-ciruela">
            Creá tu fiesta
          </h1>
          <p className="mt-1 text-sm text-texto/70">
            Contanos lo esencial. Vas a poder editar todo más adelante.
          </p>
        </div>
        <CreateEventForm />
        </div>
      </main>
    </div>
  );
}
