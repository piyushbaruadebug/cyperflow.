import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string
  hint?: string
  trend?: number
  icon?: ReactNode
}

export function StatCard({ label, value, hint, trend, icon }: StatCardProps) {
  const isIncrease = trend !== undefined && trend >= 0

  return (
    <div className="flex flex-col justify-between bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-blue-200">
      <div>
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
          {icon && (
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              {icon}
            </div>
          )}
        </div>
        <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">{value}</p>
      </div>

      {(hint || trend !== undefined) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {trend !== undefined && (
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-bold ${
                isIncrease
                  ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
              }`}
            >
              {isIncrease ? '↑ +' : '↓ '}
              {trend.toFixed(1)}%
            </span>
          )}
          <span className="text-slate-500">{hint}</span>
        </div>
      )}
    </div>
  )
}

