import { cn } from "@/lib/utils/cn";

interface LogoProps {
  /** Alto de referencia del logo en px. */
  size?: number;
  className?: string;
}

/** Logo oficial entregado en formato SVG. */
export function Logo({ size = 32, className }: LogoProps) {
  return (
    <span
      className={cn("inline-flex items-center", className)}
      aria-label="AI15"
    >
      {/* SVG oficial entregado por la autora del proyecto. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-ai15.svg"
        alt="AI15"
        width={Math.round(size * 2.45)}
        height={Math.round(size * 1.28)}
        className="block object-contain"
      />
    </span>
  );
}
