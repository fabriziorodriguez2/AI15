/**
 * Marco tipo teléfono: centra toda la app en un contenedor angosto con
 * scroll interno (como una app de celular). En desktop se ve el "teléfono"
 * flotando sobre un fondo decorativo; en mobile ocupa toda la pantalla.
 *
 * Cada ruta debe renderizar un contenido que llene la altura (h-full) y
 * gestione su propio scroll, o un layout flex-col con un <main> desplazable.
 */
export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#dceaf2] p-2">
      <div className="relative flex h-[calc(100dvh-1rem)] w-full max-w-[430px] flex-col overflow-hidden rounded-[2.8rem] border-[6px] border-[#171717] bg-rosa-fondo shadow-[0_22px_55px_rgba(32,43,54,0.28)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-50 flex h-8 items-center justify-between px-6 text-[10px] font-bold text-[#171717]"
        >
          <span>9:41</span>
          <span className="tracking-[0.12em]">●●●</span>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1.5 z-50 h-[22px] w-[88px] -translate-x-1/2 rounded-full bg-[#111111]"
        />
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden pt-8">
          {children}
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-1.5 left-1/2 z-50 h-1 w-28 -translate-x-1/2 rounded-full bg-[#171717]"
        />
      </div>
    </div>
  );
}
