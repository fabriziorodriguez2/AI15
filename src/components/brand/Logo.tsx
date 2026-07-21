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
        className="grid shrink-0 place-items-center rounded-full bg-[#f9e3ed] shadow-[inset_0_0_0_1px_rgba(255,107,145,0.06)]"
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <svg
          width={size * 0.68}
          height={size * 0.68}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="ai15-crown" x1="5" y1="6" x2="18" y2="18">
              <stop stopColor="#F2CF55" />
              <stop offset="1" stopColor="#C99516" />
            </linearGradient>
          </defs>
          <path
            d="M4.25 8.5 8 11.85 12 5.4l4 6.45 3.75-3.35-1.35 8.25a1.1 1.1 0 0 1-1.08.92H6.68a1.1 1.1 0 0 1-1.08-.92L4.25 8.5Z"
            fill="url(#ai15-crown)"
            stroke="#B98513"
            strokeWidth="0.65"
            strokeLinejoin="round"
          />
          <path
            d="M5.8 14.65h12.4l-.34 2.05a.55.55 0 0 1-.54.46H6.68a.55.55 0 0 1-.54-.46l-.34-2.05Z"
            fill="#E5B72D"
          />
          <circle cx="8.25" cy="14.8" r="0.9" fill="#FF6B91" />
          <path
            d="M12 13.55c.75-.8 2.05.18 1.35 1.08L12 16l-1.35-1.37c-.7-.9.6-1.88 1.35-1.08Z"
            fill="#F44F7C"
          />
          <circle cx="15.75" cy="14.8" r="0.9" fill="#FF6B91" />
          <circle cx="4.25" cy="8.45" r="1.15" fill="#F2C94C" />
          <circle cx="12" cy="5.25" r="1.15" fill="#F2C94C" />
          <circle cx="19.75" cy="8.45" r="1.15" fill="#F2C94C" />
          <path
            d="M7.1 12.4 8 11.85l.72-1.15M16.9 12.4l-.9-.55-.72-1.15"
            stroke="#FFF4C7"
            strokeWidth="0.55"
            strokeLinecap="round"
          />
        </svg>
      </span>
      {withText && (
        <span className="font-display text-[19px] font-bold leading-none tracking-[-0.035em] text-ciruela">
          AI<span className="text-rosa">15</span>
        </span>
      )}
    </span>
  );
}
