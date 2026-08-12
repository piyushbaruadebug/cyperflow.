interface ProgressBarProps {
  ratio: number
  className?: string
}

export function ProgressBar({ ratio, className = '' }: ProgressBarProps) {
  const pct = Math.min(Math.max(ratio, 0), 1) * 100
  const color =
    ratio >= 1
      ? 'bg-rose-500'
      : ratio >= 0.8
        ? 'bg-apex-amber'
        : 'bg-apex-green'

  return (
    <div className={`h-2.5 w-full overflow-hidden rounded-full bg-apex-canvas ${className}`}>
      <div
        className={`h-full rounded-full ${color} transition-all duration-500 ease-out`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
