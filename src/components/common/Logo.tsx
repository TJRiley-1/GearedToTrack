interface LogoProps {
  variant?: 'horizontal' | 'icon'
  className?: string
}

function GearIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Gear outer teeth - golden yellow */}
      <path
        d="M44 8 L48 8 L50 2 L54 2 L56 8 L60 9 L64 4 L67 6 L65 12 L69 15 L74 11 L76 14 L72 19 L74 23 L80 21 L81 25 L76 28 L76 32 L82 34 L82 38 L76 38 L74 42 L80 46 L78 49 L72 46 L69 50 L72 56 L69 58 L65 52 L60 54 L60 60 L56 60 L54 54 L50 54 L48 60 L44 60 L44 54 L40 52 L35 58 L32 56 L35 50 L31 46 L26 49 L24 46 L30 42 L28 38 L22 38 L22 34 L28 32 L28 28 L22 25 L24 21 L30 23 L32 19 L28 14 L31 11 L35 15 L40 12 L38 6 L40 4 L44 9"
        fill="#e5a819"
      />
      {/* Gear inner ring */}
      <circle cx="52" cy="34" r="18" fill="#e5a819" />
      <circle cx="52" cy="34" r="12" fill="#0a0f1a" />

      {/* Stopwatch body - blue */}
      <circle cx="66" cy="30" r="20" fill="#0a0f1a" />
      <circle cx="66" cy="30" r="18" fill="none" stroke="#2196F3" strokeWidth="3.5" />
      <circle cx="66" cy="30" r="14" fill="#0a0f1a" />

      {/* Stopwatch crown/button */}
      <rect x="63" y="9" width="6" height="5" rx="1.5" fill="#2196F3" />

      {/* Stopwatch side button */}
      <line x1="80" y1="18" x2="84" y2="14" stroke="#2196F3" strokeWidth="2.5" strokeLinecap="round" />

      {/* G letter inside stopwatch */}
      <text x="66" y="36" textAnchor="middle" fill="#e5a819" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="20">
        G
      </text>

      {/* Stopwatch hand */}
      <line x1="66" y1="30" x2="66" y2="19" stroke="#e5a819" strokeWidth="2" strokeLinecap="round" />

      {/* Swoosh accent */}
      <path
        d="M30 58 Q42 48, 56 56 Q64 60, 72 54"
        fill="none"
        stroke="#2196F3"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function Logo({ variant = 'horizontal', className = '' }: LogoProps) {
  if (variant === 'icon') {
    return (
      <span role="img" aria-label="Geared to Track" className={className}>
        <GearIcon />
      </span>
    )
  }

  return (
    <span role="img" aria-label="Geared to Track" className={`inline-flex items-center gap-3 ${className}`}>
      <GearIcon size={72} />
      <span className="flex flex-col leading-tight">
        <span className="text-white font-bold text-2xl tracking-tight">Geared</span>
        <span className="text-white font-bold text-2xl tracking-tight">to Track</span>
      </span>
    </span>
  )
}
