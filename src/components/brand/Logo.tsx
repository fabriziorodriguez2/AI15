import { cn } from "@/lib/utils/cn";

interface LogoProps {
  /** Tamaño del isotipo en px. */
  size?: number;
  /** Muestra el texto "AI15" junto al icono. */
  withText?: boolean;
  className?: string;
}

/**
 * Logo tipográfico de AI15: corona SVG + texto de marca.
 * No depende de ningún archivo de imagen externo.
 */
export function Logo({ size = 32, withText = true, className }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        className="grid place-items-center rounded-xl bg-rosa-claro"
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <svg
          width={size * 0.62}
          height={size * 0.62}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 8l4 4 5-7 5 7 4-4-1.6 10.2a1 1 0 0 1-1 .8H5.6a1 1 0 0 1-1-.8L3 8Z"
            fill="#D4AF37"
            stroke="#6B486B"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
          <circle cx="3" cy="8" r="1.4" fill="#FF6B91" />
          <circle cx="21" cy="8" r="1.4" fill="#FF6B91" />
          <circle cx="12" cy="5" r="1.4" fill="#FF6B91" />
        </svg>
      </span>
      {withText && (
        <span className="font-display text-xl font-bold leading-none tracking-tight text-ciruela">
          AI<span className="text-rosa">15</span>
        </span>
      )}
    </span>
  );
}
