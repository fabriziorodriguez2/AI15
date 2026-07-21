import Link from "next/link";
import Image from "next/image";
import { MapPin, Wallet, Sparkles, ArrowRight } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
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
    title: "Armá un plan a tu medida",
    text: "La asistente usa tus datos para proponer un presupuesto y un cronograma.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex h-full flex-col">
      <header className="flex min-h-14 shrink-0 items-center justify-between border-b border-[#eadfe5] bg-white px-4">
        <Logo size={28} />
        <Link
          href="/crear-evento"
          className="inline-flex min-h-11 items-center text-sm font-semibold text-ciruela hover:text-rosa"
        >
          Crear
        </Link>
      </header>

      <div className="flex-1 overflow-y-auto px-5 pb-8">
        {/* Hero */}
        <section className="pt-7">
          <div>
          <span className="chip">Planificador de fiestas de 15</span>
          <h1 className="mt-4 font-display text-[31px] font-bold leading-[1.08] text-ciruela">
            Tu fiesta, organizada con claridad.
          </h1>
          <p className="mt-3 text-[15px] leading-6 text-texto/70">
            Reuní el presupuesto, las tareas, los proveedores y las decisiones
            en un mismo lugar. AI15 te acompaña con un plan hecho para vos.
          </p>

          <div className="mt-5 flex flex-col gap-3">
            <Link href="/crear-evento" className="btn-primary w-full">
              Crear mi fiesta
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <DemoButton className="w-full">Ver demo</DemoButton>
          </div>
          </div>

          <div className="relative mt-6 aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[#eadfe5] bg-white shadow-card">
            <Image
              src="/images/salon-quince-real.png"
              alt="Salón real decorado para una fiesta de quince"
              fill
              priority
              sizes="390px"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-4 pb-4 pt-10">
              <p className="text-sm font-semibold text-white">
                Imaginá tu noche. Organizala a tu manera.
              </p>
            </div>
          </div>
        </section>

        {/* Beneficios */}
        <section className="mt-8 divide-y divide-[#eadfe5] rounded-2xl border border-[#eadfe5] bg-white px-4" aria-label="Beneficios de AI15">
          {BENEFITS.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.title} className="flex items-start gap-3 py-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-rosa-fondo text-rosa">
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
