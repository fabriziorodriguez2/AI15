import Link from "next/link";
import { MapPin, Wallet, Sparkles, ArrowRight } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Illustration } from "@/components/brand/Illustration";
import { DemoButton } from "@/components/brand/DemoButton";

const BENEFITS = [
  {
    icon: MapPin,
    title: "Organizá todo en un solo lugar",
    text: "Fecha, invitados, proveedores e ideas siempre a mano.",
  },
  {
    icon: Wallet,
    title: "Cuidá tu presupuesto",
    text: "Visualizá cómo se distribuye tu inversión, categoría por categoría.",
  },
  {
    icon: Sparkles,
    title: "Recibí recomendaciones personalizadas",
    text: "Muy pronto, una asistente de IA especializada en fiestas de 15.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex h-full flex-col">
      <header className="flex shrink-0 items-center justify-between border-b border-rosa-claro bg-white/90 px-4 py-3 backdrop-blur">
        <Logo size={28} />
        <Link
          href="/crear-evento"
          className="text-xs font-semibold text-ciruela hover:text-rosa"
        >
          Crear
        </Link>
      </header>

      <div className="flex-1 overflow-y-auto px-5 pb-8">
        {/* Hero */}
        <section className="pt-8 text-center">
          <span className="chip">Planificador de fiestas de 15</span>
          <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-ciruela">
            Planificá tu fiesta de 15 en un solo lugar.
          </h1>
          <p className="mx-auto mt-3 max-w-xs text-sm text-texto/70">
            AI15 centraliza tu presupuesto, tus invitados, tus proveedores y tus
            inspiraciones para que organizar tu fiesta sea claro y disfrutable.
          </p>

          {/* Ilustración decorativa con SVG locales. */}
          <div className="mx-auto mt-8 grid max-w-xs grid-cols-2 gap-3">
            <Illustration
              variant="vestido"
              className="w-full rounded-2xl shadow-card"
            />
            <Illustration
              variant="salon"
              className="mt-6 w-full rounded-2xl shadow-card"
            />
            <Illustration
              variant="torta"
              className="w-full rounded-2xl shadow-card"
            />
            <Illustration
              variant="flores"
              className="mt-6 w-full rounded-2xl shadow-card"
            />
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Link href="/crear-evento" className="btn-primary w-full">
              Crear mi fiesta
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <DemoButton className="w-full">Ver demo</DemoButton>
          </div>
        </section>

        {/* Beneficios */}
        <section className="mt-10 space-y-3" aria-label="Beneficios de AI15">
          {BENEFITS.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.title} className="card flex items-start gap-3 p-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-rosa-claro text-rosa">
                  <Icon size={19} aria-hidden="true" />
                </span>
                <div>
                  <h2 className="font-display text-base font-bold text-ciruela">
                    {benefit.title}
                  </h2>
                  <p className="mt-0.5 text-sm text-texto/70">{benefit.text}</p>
                </div>
              </div>
            );
          })}
        </section>

        <p className="mt-8 text-center text-xs text-texto/50">
          AI15 · Hecho en Uruguay
        </p>
      </div>
    </div>
  );
}
