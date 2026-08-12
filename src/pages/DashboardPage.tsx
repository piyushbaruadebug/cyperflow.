import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CategoryPie, MonthlyBar } from '../components/charts'
import { ProgressBar } from '../components/ProgressBar'
import { SavingsGoalCard } from '../components/SavingsGoalCard'
import { StatCard } from '../components/StatCard'
import { api, type DashboardResponse } from '../lib/api'
import { formatDate, formatMoney, monthLabel } from '../lib/format'
import { useApp } from '../store/appContext'
import { CATEGORIES, type Category } from '../types'

export function DashboardPage() {
  const { expenses } = useApp()
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
    return <p className="card border-rose-200 bg-rose-50 text-sm text-rose-700">{error}</p>
  }
  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <span className="h-3 w-3 rounded-full bg-apex-blue animate-pulse" />
          <span className="text-sm font-medium">Preparing your financial overview…</span>
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
    <div className="space-y-10">
      {/* Clideo Hero Banner */}
      <section className="text-center py-6 sm:py-10">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
            Home &gt; Dashboard
          </span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
          Personal Finance
        </h1>
        <p className="mt-3 text-base text-slate-500 max-w-xl mx-auto font-normal">
          Track expenses, set category budgets, and optimize your personal savings online
        </p>

        {/* Clideo-Style Split Action Button */}
        <div className="mt-7 flex items-center justify-center gap-3">
          <div className="inline-flex items-center rounded-2xl bg-blue-600 p-1 text-white shadow-xl shadow-blue-500/25 transition-transform hover:scale-105">
            <Link
              to="/add"
              className="flex items-center gap-2 px-6 py-3 text-sm font-bold tracking-wide"
            >
              <span className="text-lg font-extrabold">+</span> Choose action / Add Expense
            </Link>
            <div className="h-6 w-[1px] bg-white/20" />
            <div className="px-3 py-3 hover:bg-white/10 rounded-xl cursor-pointer">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Clideo Showcase Cards Container */}
      <div className="rounded-3xl bg-slate-100/70 p-6 sm:p-8 border border-slate-200/60 shadow-sm space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
              Overview
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Monthly Analytics</h2>
          </div>

          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
            <label className="text-xs font-semibold text-slate-500" htmlFor="dashboard-category">
              Filter Category:
            </label>
            <select
              id="dashboard-category"
              className="bg-transparent text-xs font-bold text-slate-900 outline-none cursor-pointer"
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
        </div>

        {/* Top Stat Cards */}
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Monthly spending"
            value={formatMoney(category === 'All' ? data.monthlyTotal : filteredTotal, true)}
            hint="vs. last month"
            trend={trend}
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            label="Transactions"
            value={String(data.transactionCount)}
            hint="this month"
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          />
          <StatCard
            label="Average expense"
            value={formatMoney(data.averageExpense, true)}
            hint="per transaction"
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            }
          />
          <StatCard
            label="Budget limit"
            value={`${Math.round(overallRatio * 100)}%`}
            hint={`of ${formatMoney(data.totalBudget)} limit`}
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          />
        </section>

        {/* Overall Progress Banner */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Monthly budget status</p>
              <h3 className="mt-1 text-lg font-bold text-slate-900">Overall Budget Progress</h3>
            </div>
            <span className="text-sm font-semibold text-slate-500">
              <span className="text-slate-900 font-bold">{formatMoney(data.monthlyTotal)}</span> / {formatMoney(data.totalBudget)}
            </span>
          </div>
          <ProgressBar ratio={overallRatio} />
        </section>

        <SavingsGoalCard monthlyBudget={data.totalBudget} monthlySpent={data.monthlyTotal} />
      </div>

      {/* Visual Analytics Charts */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Spending by category</h2>
          <CategoryPie data={pieData} />
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Monthly spending trend</h2>
          <MonthlyBar data={months} />
        </div>
      </section>

      {/* Recent Activity & Budget Overview */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Recent transactions</h2>
            <Link to="/history" className="text-xs font-bold text-blue-600 hover:underline">
              View All →
            </Link>
          </div>
          <ul className="divide-y divide-slate-100">
            {data.recent.map((expense) => (
              <li key={expense.id} className="flex items-center justify-between rounded-xl px-2 py-3 transition-colors hover:bg-slate-50">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{expense.description}</p>
                  <p className="text-xs text-slate-500">
                    <span className="mr-2 inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                      {expense.category}
                    </span>
                    {formatDate(expense.date)}
                  </p>
                </div>
                <span className="text-sm font-bold text-slate-900">{formatMoney(expense.amount, true)}</span>
              </li>
            ))}
            {data.recent.length === 0 && (
              <li className="rounded-xl bg-slate-50 py-8 text-center text-sm text-slate-500">
                No transactions yet. Add your first expense to unlock insights.
              </li>
            )}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Category budgets</h2>
          <ul className="space-y-4">
            {data.budgetProgress.slice(0, 5).map((row) => (
              <li key={row.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-900">{row.category}</span>
                  <span className="text-xs font-semibold text-slate-500">
                    {formatMoney(row.spent)} / {formatMoney(row.limit)}
                  </span>
                </div>
                <ProgressBar ratio={row.ratio} />
              </li>
            ))}
            {data.budgetProgress.length === 0 && (
              <li className="rounded-xl bg-slate-50 py-8 text-center text-sm text-slate-500">
                No category budgets yet. Add a budget to track your monthly plan.
              </li>
            )}
          </ul>
        </div>
      </section>
    </div>
  )
}

