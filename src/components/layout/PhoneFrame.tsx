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
    <div className="flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#f0dbe6] via-[#ecd5e0] to-[#e6d4e0] p-0 lg:p-6">
      <div className="relative flex h-[100dvh] w-full max-w-[440px] flex-col overflow-hidden bg-rosa-fondo lg:h-[calc(100dvh-3rem)] lg:rounded-[2.5rem] lg:shadow-2xl lg:ring-1 lg:ring-black/5">
        {children}
      </div>
    </div>
  );
}
