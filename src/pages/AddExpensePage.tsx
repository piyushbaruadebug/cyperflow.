import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatMoney } from '../lib/format'
import { useApp } from '../store/appContext'
import { CATEGORIES, type Category, type PaymentMethod } from '../types'

const METHODS: PaymentMethod[] = ['Card', 'Cash', 'UPI', 'Bank Transfer']

export function AddExpensePage() {
  const { addExpense, expenses, setBudget } = useApp()
  const navigate = useNavigate()

  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<Category>('Food')
  const [budgetLimit, setBudgetLimit] = useState('')
  const [method, setMethod] = useState<PaymentMethod>('Card')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [error, setError] = useState('')
  const [saved, setSaved] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const value = Number(amount)

    if (description.trim().length < 2) {
      setError('Add a short description.')
      return
    }
    if (!Number.isFinite(value) || value <= 0) {
      setError('Amount must be greater than zero.')
      return
    }
    const limit = budgetLimit === '' ? null : Number(budgetLimit)
    if (limit !== null && (!Number.isFinite(limit) || limit < 0)) {
      setError('Budget limit must be zero or more.')
      return
    }

    setError('')
    setBusy(true)
    try {
      await addExpense({
        description: description.trim(),
        amount: Math.round(value * 100) / 100,
        category,
        method,
        date,
      })
      if (limit !== null) {
        await setBudget(category, Math.round(limit * 100) / 100)
      }
      setSaved(`${description.trim()} · ${formatMoney(value, true)}${limit !== null ? ` · ${category} budget saved` : ''}`)
      setDescription('')
      setAmount('')
    } catch (cause) {
      setSaved('')
      setError(cause instanceof Error ? cause.message : 'Could not save expense')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Add New Expense</h1>
        <p className="mt-1 text-sm text-slate-500">{expenses.length} transactions recorded in your database.</p>
      </header>

      <form onSubmit={handleSubmit} className="card max-w-2xl space-y-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label" htmlFor="description">
              Description
            </label>
            <input
              id="description"
              className="input text-base"
              placeholder="e.g. Grocery run at Whole Foods"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          <div>
            <label className="label" htmlFor="amount">
              Amount (₹)
            </label>
            <input
              id="amount"
              className="input text-base font-bold text-slate-900"
              type="number"
              min="0"
              step="0.01"
              placeholder="42.50"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </div>

          <div>
            <label className="label" htmlFor="date">
              Transaction Date
            </label>
            <input
              id="date"
              className="input"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>

          <div className="space-y-5">
            <label className="label" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              className="input"
              value={category}
              onChange={(event) => setCategory(event.target.value as Category)}
            >
              {CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <div>
              <label className="label" htmlFor="budget-limit">
                Monthly Budget Limit (₹)
              </label>
              <input
                id="budget-limit"
                className="input"
                type="number"
                min="0"
                step="10"
                placeholder="Optional"
                value={budgetLimit}
                onChange={(event) => setBudgetLimit(event.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="method">
              Payment Method
            </label>
            <select
              id="method"
              className="input"
              value={method}
              onChange={(event) => setMethod(event.target.value as PaymentMethod)}
            >
              {METHODS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-400">{error}</p>}
        {saved && !error && (
          <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm font-semibold text-emerald-400">
            ✓ Successfully saved: {saved}
          </p>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="btn-primary flex-1 sm:flex-none min-w-[140px]" disabled={busy}>
            {busy ? 'Saving…' : 'Save Expense'}
          </button>
          <button type="button" className="btn-ghost" onClick={() => navigate('/history')}>
            View History →
          </button>
        </div>
      </form>
    </div>
  )
}
