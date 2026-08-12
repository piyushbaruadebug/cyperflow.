import { formatMoney } from '../lib/format'

interface SavingsGoalCardProps {
  monthlyBudget: number
  monthlySpent: number
}

export function SavingsGoalCard({ monthlyBudget, monthlySpent }: SavingsGoalCardProps) {
  const target = Math.max(monthlyBudget * 0.2, 1000)
  const available = Math.max(monthlyBudget - monthlySpent, 0)
  const saved = Math.min(available, target)
  const progress = Math.min((saved / target) * 100, 100)
  const circumference = 2 * Math.PI * 42
  const offset = circumference - (progress / 100) * circumference

  return (
    <section className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between gap-6 sm:flex-row sm:items-center" aria-labelledby="savings-goal-title">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-emerald-600">Savings goal</p>
        <h2 id="savings-goal-title" className="mt-1 text-lg font-bold text-slate-900">
          Build a stronger safety net
        </h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
          Set aside 20% of your monthly budget. You have {formatMoney(available)} available after this month’s spending.
        </p>
        <p className="mt-4 text-sm font-semibold text-slate-900">
          {formatMoney(saved)} <span className="font-normal text-slate-500">of {formatMoney(target)} target</span>
        </p>
      </div>
      <div className="relative h-32 w-32 shrink-0" role="img" aria-label={`${Math.round(progress)} percent of monthly savings target achieved`}>
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="9" />
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="#10b981"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black tracking-tight text-slate-900">{Math.round(progress)}%</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">saved</span>
        </div>
      </div>
    </section>
  )
}
