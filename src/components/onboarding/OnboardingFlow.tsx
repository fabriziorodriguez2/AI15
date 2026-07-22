"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, Check, Wallet } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { DemoButton } from "@/components/brand/DemoButton";
import { cn } from "@/lib/utils/cn";

const SLIDES = [
  {
    eyebrow: "Todo en un solo lugar",
    title: "Organizá tu fiesta sin complicaciones.",
    description:
      "Fecha, invitados, proveedores, ideas y decisiones siempre a mano para vos y tu familia.",
  },
  {
    eyebrow: "Presupuesto claro",
    title: "Cuidá cada parte de tu inversión.",
    description:
      "Registrá gastos, controlá el saldo y entendé cómo se distribuye el presupuesto por categoría.",
  },
  {
    eyebrow: "Un plan a tu medida",
    title: "Recibí una guía pensada para tu fiesta.",
    description:
      "La asistente usa tu fecha, estilo y decisiones para proponerte un plan y un cronograma personalizados.",
  },
] as const;

function SlideVisual({ step }: { step: number }) {
  if (step === 0) {
    return (
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-mist">
        <Image
          src="/images/salon-quince-real.png"
          alt="Salón decorado para una fiesta de quince"
          fill
          priority
          sizes="370px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 rounded-xl bg-white/90 px-3 py-2 backdrop-blur-sm">
          <p className="text-xs font-semibold text-texto">Tu noche, a tu manera</p>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-[#f0eef3] p-6">
        <div className="rounded-2xl bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="grid size-10 place-items-center rounded-xl bg-mist/60 text-texto">
              <Wallet size={20} aria-hidden="true" />
            </span>
            <span className="text-xs font-semibold text-texto/50">Presupuesto</span>
          </div>
          <p className="mt-5 text-2xl font-bold tracking-tight text-texto">$ 350.000</p>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-rosa-claro">
            <div className="h-full w-[62%] rounded-full bg-rosa" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {["Salón", "Vestido", "Música"].map((label, index) => (
              <div key={label} className="rounded-xl bg-rosa-fondo px-2 py-3 text-center">
                <p className="text-[10px] font-semibold text-texto/45">{label}</p>
                <p className="mt-1 text-xs font-bold text-texto">{[38, 18, 12][index]}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-[#dcd3aa] p-6">
      <div className="rounded-2xl bg-white p-5 shadow-card">
        <div className="mb-4 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-rosa-claro text-rosa">
            <CalendarDays size={20} aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-semibold text-texto/45">Próximos pasos</p>
            <p className="text-sm font-bold text-texto">Tu cronograma</p>
          </div>
        </div>
        <div className="space-y-3">
          {["Elegir el salón", "Definir el estilo", "Armar invitados"].map(
            (label, index) => (
              <div key={label} className="flex items-center gap-3">
                <span
                  className={cn(
                    "grid size-6 place-items-center rounded-full border",
                    index === 0
                      ? "border-rosa bg-rosa text-white"
                      : "border-mist bg-white text-transparent",
                  )}
                >
                  <Check size={13} aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold text-texto/75">{label}</span>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

export function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const slide = SLIDES[step]!;
  const isLast = step === SLIDES.length - 1;

  return (
    <div className="flex h-full flex-col bg-white">
      <header className="flex min-h-14 shrink-0 items-center justify-between px-5">
        <Logo size={30} />
        <span className="text-xs font-semibold tabular-nums text-texto/45">
          {step + 1} de {SLIDES.length}
        </span>
      </header>

      <main className="flex-1 overflow-y-auto px-5 pb-4 pt-3">
        <div key={step} className="animate-onboarding-in">
          <SlideVisual step={step} />
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-rosa">
            {slide.eyebrow}
          </p>
          <h1 className="mt-2 text-[30px] font-bold leading-[1.08] tracking-[-0.035em] text-texto">
            {slide.title}
          </h1>
          <p className="mt-3 text-[15px] leading-6 text-texto/65">
            {slide.description}
          </p>
        </div>
      </main>

      <footer className="shrink-0 border-t border-rosa-claro bg-white px-5 pb-6 pt-4">
        <div className="mb-4 flex justify-center gap-2" aria-label="Progreso del onboarding">
          {SLIDES.map((_, index) => (
            <span
              key={index}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                index === step ? "w-8 bg-rosa" : "w-2 bg-mist",
              )}
            />
          ))}
        </div>

        {isLast ? (
          <div className="space-y-2.5">
            <Link href="/crear-evento" className="btn-primary w-full">
              Crear mi fiesta
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <DemoButton className="w-full">Ver demo</DemoButton>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((current) => current - 1)}
                className="btn-secondary px-4"
                aria-label="Volver a la pantalla anterior"
              >
                <ArrowLeft size={17} aria-hidden="true" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setStep((current) => current + 1)}
              className="btn-primary flex-1"
            >
              Continuar
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          </div>
        )}
      </footer>
    </div>
  );
}
