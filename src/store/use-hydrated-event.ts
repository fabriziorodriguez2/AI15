"use client";

import { useEventStore } from "./event-store";

/**
 * Lee el evento de forma segura para SSR.
 * Mientras el store no terminó de rehidratarse, `ready` es false; así se
 * evita renderizar contenido dependiente de localStorage en el servidor
 * (previene errores de hidratación).
 */
export function useHydratedEvent() {
  const event = useEventStore((state) => state.event);
  const hasHydrated = useEventStore((state) => state.hasHydrated);
  return { event: hasHydrated ? event : null, ready: hasHydrated };
}

/** true cuando el store persistido ya se rehidrató en el cliente. */
export function useStoreReady(): boolean {
  return useEventStore((state) => state.hasHydrated);
}
