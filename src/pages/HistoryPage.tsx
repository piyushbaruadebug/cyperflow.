import { useMemo, useState } from 'react'
import { totalOf } from '../lib/analytics'
import { formatDate, formatMoney, monthKey } from '../lib/format'
import { useApp } from '../store/appContext'
import { CATEGORIES, type Category } from '../types'

type SortKey = 'date' | 'amount'

export function HistoryPage() {
  const { expenses, deleteExpense } = useApp()
  const [category, setCategory] = useState<Category | 'All'>('All')
  const [month, setMonth] = useState<'All' | string>('All')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('date')

  const months = useMemo(
    () => Array.from(new Set(expenses.map((expense) => monthKey(expense.date)))).sort().reverse(),
    [expenses],
  )

  const rows = useMemo(() => {
    const term = query.trim().toLowerCase()
    return expenses
      .filter((expense) => category === 'All' || expense.category === category)
      .filter((expense) => month === 'All' || monthKey(expense.date) === month)
      .filter((expense) => !term || expense.description.toLowerCase().includes(term))
      .sort((a, b) => (sort === 'amount' ? b.amount - a.amount : b.date.localeCompare(a.date)))
  }, [expenses, category, month, query, sort])

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Transaction History</h1>
          <p className="mt-1 text-sm text-slate-500">
            {rows.length} transactions · <span className="font-bold text-blue-600">{formatMoney(totalOf(rows), true)}</span> total spent
          </p>
        </div>
      </header>

      {/* Filter Controls Bar */}
      <div className="card grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="label" htmlFor="search">
            Search
          </label>
          <input
            id="search"
            className="input"
            placeholder="Search description..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="filter-category">
            Category
          </label>
          <select
            id="filter-category"
            className="input"
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
        <div>
          <label className="label" htmlFor="filter-month">
            Month
          </label>
          <select
            id="filter-month"
            className="input"
            value={month}
            onChange={(event) => setMonth(event.target.value)}
          >
            <option value="All">All months</option>
            {months.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="sort">
            Sort Order
          </label>
          <select
            id="sort"
            className="input"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortKey)}
          >
            <option value="date">Newest first</option>
            <option value="amount">Highest amount</option>
          </select>
        </div>
      </div>

      {/* History Data Table */}
      <div className="card-static overflow-hidden p-0 border border-slate-200 bg-white shadow-sm rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((expense) => (
                <tr key={expense.id} className="transition-colors duration-150 hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4 text-slate-500 font-mono text-xs">{formatDate(expense.date)}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{expense.description}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs">{expense.method}</td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900">
                    {formatMoney(expense.amount, true)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      type="button"
                      className="rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100"
                      onClick={() => void deleteExpense(expense.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No transactions match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
