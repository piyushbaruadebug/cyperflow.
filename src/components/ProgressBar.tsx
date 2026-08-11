interface ProgressBarProps {
  ratio: number
  className?: string
}

export function ProgressBar({ ratio, className = '' }: ProgressBarProps) {
  const pct = Math.min(Math.max(ratio, 0), 1) * 100
  const color =
    ratio >= 1
      ? 'bg-gradient-to-r from-rose-600 to-pink-500 shadow-lg shadow-rose-500/30'
      : ratio >= 0.8
        ? 'bg-gradient-to-r from-amber-500 to-yellow-400 shadow-lg shadow-amber-500/30'
        : 'bg-gradient-to-r from-emerald-500 to-cyan-400 shadow-lg shadow-emerald-500/30'

  return (
    <div className={`h-3 w-full overflow-hidden rounded-full bg-dark-950 p-0.5 ring-1 ring-slate-800 ${className}`}>
      <div
        className={`h-full rounded-full ${color} transition-all duration-500 ease-out`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
