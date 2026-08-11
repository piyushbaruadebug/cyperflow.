interface StatCardProps {
  label: string
  value: string
  hint?: string
  trend?: number
}

export function StatCard({ label, value, hint, trend }: StatCardProps) {
  const isPositive = trend !== undefined && trend >= 0

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-800/90 bg-dark-900/80 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:bg-dark-850 hover:shadow-2xl hover:shadow-blue-500/10">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-500/5 blur-2xl transition-all duration-300 group-hover:bg-blue-500/15" />
      
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-extrabold text-slate-100 tracking-tight">{value}</p>

      {(hint || trend !== undefined) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {trend !== undefined && (
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 font-bold ${
                isPositive
                  ? 'bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'
              }`}
            >
              {isPositive ? '↑ +' : '↓ '}
              {trend.toFixed(1)}%
            </span>
          )}
          <span className="text-slate-400">{hint}</span>
        </div>
      )}
    </div>
  )
}
