interface LogoProps {
  variant?: 'horizontal' | 'icon'
  className?: string
}

function GearIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Gear/cog shape */}
      <path
        d="M50 18 L54 18 L56 10 L60 9 L64 16 L68 14 L68 6 L72 6 L74 14 L78 13 L80 6 L84 8 L82 16 L86 18 L90 12 L93 15 L88 20 L90 24 L98 22 L99 26 L92 30 L92 34 L100 36 L99 40 L92 40 L90 44 L96 48 L94 52 L86 50 L84 54 L88 60 L85 63 L80 56 L76 58 L78 66 L74 67 L72 60 L68 60 L66 68 L62 67 L62 60 L58 58 L54 64 L50 62"
        fill="#1a365d"
      />
      <path
        d="M50 62 L46 64 L42 58 L38 60 L38 67 L34 68 L32 60 L28 60 L26 67 L22 66 L24 58 L20 56 L15 63 L12 60 L16 54 L14 50 L6 52 L4 48 L10 44 L8 40 L0 40 L1 36 L8 34 L8 30 L1 26 L2 22 L10 24 L14 18 L8 15 L12 12 L18 18 L22 14 L20 6 L24 4 L28 12 L32 10 L32 2 L36 2 L38 10 L42 10 L44 2 L48 4 L46 12 L50 14 L50 18"
        fill="#1a365d"
      />
      {/* Inner gear ring */}
      <circle cx="50" cy="40" r="22" fill="#1a365d" />
      <circle cx="50" cy="40" r="16" fill="#0a0f1a" />

      {/* Stopwatch body */}
      <circle cx="62" cy="32" r="18" fill="none" stroke="#22d3ee" strokeWidth="3" />
      <circle cx="62" cy="32" r="15" fill="#0a0f1a" />

      {/* Stopwatch button/crown */}
      <rect x="59" y="12" width="6" height="5" rx="1" fill="#22d3ee" />
      <line x1="56" y1="16" x2="59" y2="14" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
      <line x1="65" y1="14" x2="68" y2="16" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />

      {/* G letter */}
      <text x="62" y="37" textAnchor="middle" fill="#f59e0b" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="20">
        G
      </text>

      {/* Stopwatch hand */}
      <line x1="62" y1="32" x2="62" y2="22" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
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
