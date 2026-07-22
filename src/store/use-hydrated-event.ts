"use client";

import { useEventStore } from "./event-store";

/** Lee el evento del usuario fijo. El store ya no depende de localStorage. */
export function useHydratedEvent() {
  const event = useEventStore((state) => state.event);
  const hasHydrated = useEventStore((state) => state.hasHydrated);
  return { event: hasHydrated ? event : null, ready: hasHydrated };
}

/** El store de sesión está disponible desde el primer render. */
export function useStoreReady(): boolean {
  return useEventStore((state) => state.hasHydrated);
}
