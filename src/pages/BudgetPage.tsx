import { useMemo, useState } from 'react'
import { CategoryPie, MonthlyBar } from '../components/charts'
import { ProgressBar } from '../components/ProgressBar'
import { StatCard } from '../components/StatCard'
import { expensesInMonth, monthlyTotals, totalOf, totalsByCategory } from '../lib/analytics'
import { formatMoney } from '../lib/format'
import { useApp } from '../store/appContext'
import { CATEGORIES, type Category } from '../types'

export function BudgetPage() {
  const { expenses, budgets, setBudget } = useApp()
  const [error, setError] = useState('')

  const monthExpenses = useMemo(() => expensesInMonth(expenses), [expenses])
  const spentByCategory = useMemo(() => totalsByCategory(monthExpenses), [monthExpenses])

  const rows = CATEGORIES.map((category) => {
    const limit = budgets.find((budget) => budget.category === category)?.limit ?? 0
    const spent = spentByCategory.find((row) => row.category === category)?.total ?? 0
    return { category, limit, spent, ratio: limit > 0 ? spent / limit : 0 }
  })

  const spent = totalOf(monthExpenses)
  const totalBudget = rows.reduce((sum, row) => sum + row.limit, 0)
  const overBudget = rows.filter((row) => row.limit > 0 && row.ratio >= 1)

  const save = async (category: Category, limit: number) => {
    try {
      setError('')
      await setBudget(category, limit)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save budget')
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">Monthly Budget Targets</h1>
        <p className="mt-1 text-sm text-slate-400">Configure target limits per category and track remaining balances.</p>
      </header>

      {error && <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-400">{error}</p>}

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total monthly budget" value={formatMoney(totalBudget)} hint="configured limit" />
        <StatCard
          label="Spent this month"
          value={formatMoney(spent, true)}
          hint={`${Math.round((spent / (totalBudget || 1)) * 100)}% used`}
        />
        <StatCard
          label="Remaining balance"
          value={formatMoney(Math.max(totalBudget - spent, 0))}
          hint={
            overBudget.length
              ? `${overBudget.length} ${overBudget.length === 1 ? 'category' : 'categories'} over limit`
              : 'All categories on track'
          }
        />
      </section>

      <section className="card">
        <h2 className="mb-5 text-base font-bold text-slate-100">Category Budget Management</h2>
        <ul className="space-y-6">
          {rows.map((row) => (
            <li key={row.category} className="rounded-xl border border-slate-800/60 bg-dark-950/40 p-4 transition-all duration-200 hover:border-slate-700/80">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-slate-100">{row.category}</p>
                  <p className="text-xs text-slate-400">
                    <span className="font-semibold text-slate-200">{formatMoney(row.spent, true)}</span> of {formatMoney(row.limit)} ·{' '}
                    {row.limit > 0 && row.ratio >= 1 ? (
                      <span className="font-bold text-rose-400">
                        {formatMoney(row.spent - row.limit, true)} over limit
                      </span>
                    ) : (
                      <span className="text-emerald-400">{formatMoney(Math.max(row.limit - row.spent, 0), true)} remaining</span>
                    )}
                  </p>
                </div>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  Monthly Limit (₹)
                  <input
                    className="input w-32 py-1.5 text-right font-bold text-slate-100"
                    type="number"
                    min="0"
                    step="10"
                    defaultValue={row.limit}
                    aria-label={`${row.category} budget limit`}
                    onBlur={(event) => save(row.category, Math.max(0, Number(event.target.value) || 0))}
                  />
                </label>
              </div>
              <ProgressBar ratio={row.ratio} />
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="mb-4 text-base font-bold text-slate-100">Category Breakdown</h2>
          <CategoryPie data={spentByCategory} />
        </div>
        <div className="card">
          <h2 className="mb-4 text-base font-bold text-slate-100">Monthly Spending Trend</h2>
          <MonthlyBar data={monthlyTotals(expenses)} />
        </div>
      </section>
    </div>
  )
}
