import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CategoryPie, MonthlyBar } from '../components/charts'
import { ProgressBar } from '../components/ProgressBar'
import { StatCard } from '../components/StatCard'
import { api, type DashboardResponse } from '../lib/api'
import { formatDate, formatMoney, monthLabel } from '../lib/format'
import { useApp } from '../store/appContext'
import { CATEGORIES, type Category } from '../types'

export function DashboardPage() {
  const { user, expenses } = useApp()
  const [category, setCategory] = useState<Category | 'All'>('All')
  const [data, setData] = useState<DashboardResponse | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .dashboard()
      .then(setData)
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'Failed to load dashboard'))
  }, [expenses])

  const pieData = useMemo(() => {
    if (!data) return []
    return data.byCategory.filter((row) => category === 'All' || row.category === category)
  }, [data, category])

  if (error) {
    return <p className="card text-sm text-rose-400 border-rose-500/30 bg-rose-500/10">{error}</p>
  }
  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <span className="h-4 w-4 rounded-full bg-accent-cyan animate-ping" />
          <span className="text-sm font-medium">Loading dashboard telemetry…</span>
        </div>
      </div>
    )
  }

  const filteredTotal = pieData.reduce((sum, row) => sum + row.total, 0)
  const trend =
    data.previousMonthTotal > 0
      ? ((data.monthlyTotal - data.previousMonthTotal) / data.previousMonthTotal) * 100
      : undefined
  const overallRatio = data.totalBudget > 0 ? data.monthlyTotal / data.totalBudget : 0
  const months = data.monthly.map((row) => ({ label: monthLabel(row.month), total: row.total }))

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">
            Welcome back, <span className="bg-gradient-to-r from-blue-400 to-accent-cyan bg-clip-text text-transparent">{user?.name}</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="dashboard-category">
            Filter Category
          </label>
          <select
            id="dashboard-category"
            className="input w-48 border-slate-800 bg-dark-900"
            value={category}
            onChange={(event) => setCategory(event.target.value as Category | 'All')}
          >
            <option value="All">All categories</option>
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Top Stat Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Monthly spending"
          value={formatMoney(category === 'All' ? data.monthlyTotal : filteredTotal, true)}
          hint="vs. last month"
          trend={trend}
        />
        <StatCard label="Transactions" value={String(data.transactionCount)} hint="this month" />
        <StatCard label="Average expense" value={formatMoney(data.averageExpense, true)} hint="per transaction" />
        <StatCard
          label="Budget used"
          value={`${Math.round(overallRatio * 100)}%`}
          hint={`of ${formatMoney(data.totalBudget)} limit`}
        />
      </section>

      {/* Overall Progress Banner */}
      <section className="card">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-100">Overall Budget Progress</h2>
          <span className="text-sm font-semibold text-slate-400">
            <span className="text-accent-cyan font-bold">{formatMoney(data.monthlyTotal)}</span> / {formatMoney(data.totalBudget)}
          </span>
        </div>
        <ProgressBar ratio={overallRatio} />
      </section>

      {/* Visual Analytics Charts */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="mb-4 text-base font-bold text-slate-100">Spending by Category</h2>
          <CategoryPie data={pieData} />
        </div>
        <div className="card">
          <h2 className="mb-4 text-base font-bold text-slate-100">Monthly Spending Trend</h2>
          <MonthlyBar data={months} />
        </div>
      </section>

      {/* Recent Activity & Budget Overview */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100">Recent Transactions</h2>
            <Link to="/history" className="text-xs font-bold text-accent-cyan hover:underline">
              View All →
            </Link>
          </div>
          <ul className="divide-y divide-slate-800/60">
            {data.recent.map((expense) => (
              <li key={expense.id} className="flex items-center justify-between py-3 transition-colors hover:bg-dark-800/30 px-2 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-slate-200">{expense.description}</p>
                  <p className="text-xs text-slate-400">
                    <span className="inline-block rounded-md bg-dark-950 px-2 py-0.5 text-[11px] font-medium text-slate-300 mr-2 border border-slate-800">
                      {expense.category}
                    </span>
                    {formatDate(expense.date)}
                  </p>
                </div>
                <span className="text-sm font-bold text-slate-100">{formatMoney(expense.amount, true)}</span>
              </li>
            ))}
            {data.recent.length === 0 && <li className="py-8 text-center text-sm text-slate-400">No expenses recorded yet.</li>}
          </ul>
        </div>

        <div className="card">
          <h2 className="mb-4 text-base font-bold text-slate-100">Category Budgets</h2>
          <ul className="space-y-4">
            {data.budgetProgress.slice(0, 5).map((row) => (
              <li key={row.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-200">{row.category}</span>
                  <span className="text-xs font-semibold text-slate-400">
                    {formatMoney(row.spent)} / {formatMoney(row.limit)}
                  </span>
                </div>
                <ProgressBar ratio={row.ratio} />
              </li>
            ))}
            {data.budgetProgress.length === 0 && (
              <li className="py-8 text-center text-sm text-slate-400">No budgets configured for this month.</li>
            )}
          </ul>
        </div>
      </section>
    </div>
  )
}
