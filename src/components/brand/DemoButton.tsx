"use client";

import { useRouter } from "next/navigation";
import { useEventStore } from "@/store/event-store";
import { cn } from "@/lib/utils/cn";

interface DemoButtonProps {
  className?: string;
  children: React.ReactNode;
}

/** Carga un evento de demostración en el store y navega al dashboard. */
export function DemoButton({ className, children }: DemoButtonProps) {
  const router = useRouter();
  const loadDemoEvent = useEventStore((state) => state.loadDemoEvent);

  const handleClick = () => {
    loadDemoEvent();
    router.push("/dashboard");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn("btn-secondary", className)}
    >
      {children}
    </button>
  );
}
