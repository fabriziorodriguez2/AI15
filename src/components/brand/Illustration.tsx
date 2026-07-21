interface IllustrationProps {
  variant: "flores" | "salon" | "vestido" | "torta";
  className?: string;
}

/**
 * Ilustraciones decorativas locales (SVG) usadas como placeholders visuales.
 * No dependen de URLs externas.
 */
export function Illustration({ variant, className }: IllustrationProps) {
  const common = {
    viewBox: "0 0 120 120",
    className,
    xmlns: "http://www.w3.org/2000/svg",
    role: "img" as const,
    "aria-hidden": true,
  };

  if (variant === "flores") {
    return (
      <svg {...common}>
        <rect width="120" height="120" rx="16" fill="#F8E1EC" />
        <circle cx="60" cy="55" r="10" fill="#D4AF37" />
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <ellipse
            key={deg}
            cx="60"
            cy="35"
            rx="9"
            ry="16"
            fill="#FF6B91"
            transform={`rotate(${deg} 60 55)`}
          />
        ))}
        <rect x="57" y="70" width="6" height="34" rx="3" fill="#6B486B" />
      </svg>
    );
  }

  if (variant === "salon") {
    return (
      <svg {...common}>
        <rect width="120" height="120" rx="16" fill="#FFF6F9" />
        <path d="M20 90V45l40-22 40 22v45Z" fill="#6B486B" />
        <rect x="34" y="60" width="16" height="30" rx="2" fill="#F8E1EC" />
        <rect x="70" y="60" width="16" height="30" rx="2" fill="#F8E1EC" />
        <circle cx="60" cy="40" r="6" fill="#D4AF37" />
      </svg>
    );
  }

  if (variant === "vestido") {
    return (
      <svg {...common}>
        <rect width="120" height="120" rx="16" fill="#F8E1EC" />
        <path
          d="M52 28h16l-6 12 18 52H40l18-52-6-12Z"
          fill="#FF6B91"
          stroke="#6B486B"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="60" cy="24" r="5" fill="#D4AF37" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <rect width="120" height="120" rx="16" fill="#FFF6F9" />
      <rect x="34" y="66" width="52" height="30" rx="4" fill="#FF6B91" />
      <rect x="40" y="50" width="40" height="18" rx="4" fill="#F8E1EC" />
      <rect x="47" y="38" width="26" height="14" rx="4" fill="#D4AF37" />
      <rect x="58" y="26" width="4" height="12" rx="2" fill="#6B486B" />
      <circle cx="60" cy="24" r="3" fill="#FF6B91" />
    </svg>
  );
}
