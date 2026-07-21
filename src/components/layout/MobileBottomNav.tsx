"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  Images,
  CalendarClock,
  MoreHorizontal,
  Store,
  UserRound,
  Sparkles,
  ListChecks,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

// Cuatro accesos primarios + "Más" (quinto).
const PRIMARY: NavLink[] = [
  { href: "/dashboard", label: "Inicio", icon: LayoutDashboard },
  { href: "/plan", label: "Plan", icon: Sparkles },
  { href: "/presupuesto", label: "Presupuesto", icon: Wallet },
  { href: "/cronograma", label: "Cronograma", icon: CalendarClock },
];

// Rutas secundarias que aparecen en la hoja "Más".
const SECONDARY: NavLink[] = [
  { href: "/proveedores", label: "Proveedores", icon: Store },
  { href: "/inspiracion", label: "Inspiración", icon: Images },
  { href: "/decisiones", label: "Decisiones", icon: ListChecks },
  { href: "/cuenta", label: "Cuenta", icon: UserRound },
];

/** Navegación inferior siempre visible dentro del marco. */
export function MobileBottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const isSecondaryActive = SECONDARY.some(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );

  return (
    <>
      <nav
        className="relative z-20 shrink-0 border-t border-rosa-claro bg-white/95 backdrop-blur"
        aria-label="Navegación principal"
      >
        <ul className="flex items-stretch justify-between px-2 py-1.5">
          {PRIMARY.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 text-[10px] font-medium transition",
                    isActive
                      ? "text-rosa"
                      : "text-texto/60 hover:text-ciruela",
                  )}
                >
                  <Icon size={20} aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
          <li className="flex-1">
            <button
              type="button"
              onClick={() => setMoreOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={moreOpen}
              className={cn(
                "flex w-full flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 text-[10px] font-medium transition",
                isSecondaryActive
                  ? "text-rosa"
                  : "text-texto/60 hover:text-ciruela",
              )}
            >
              <MoreHorizontal size={20} aria-hidden="true" />
              <span>Más</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Hoja "Más" con las rutas secundarias. */}
      {moreOpen && (
        <div
          className="absolute inset-0 z-30 flex flex-col justify-end bg-ciruela/30"
          role="dialog"
          aria-modal="true"
          aria-label="Más opciones"
          onClick={() => setMoreOpen(false)}
        >
          <div
            className="rounded-t-2xl bg-white p-4 shadow-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-ciruela">
                Más opciones
              </h2>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                aria-label="Cerrar"
                className="grid size-8 place-items-center rounded-full text-texto/60 hover:bg-rosa-fondo"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <ul className="space-y-1">
              {SECONDARY.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMoreOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition",
                        isActive
                          ? "bg-rosa-claro text-ciruela"
                          : "text-texto/70 hover:bg-rosa-fondo",
                      )}
                    >
                      <Icon
                        size={19}
                        className={isActive ? "text-rosa" : "text-texto/50"}
                        aria-hidden="true"
                      />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
