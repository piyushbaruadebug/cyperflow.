import { Router } from 'express'
import { requireAuth } from '../auth.js'
import { currentMonth, isMonth } from '../categories.js'
import { db } from '../db.js'
import { authenticatedLimits } from '../rateLimit.js'

export const dashboardRouter = Router()
dashboardRouter.use(requireAuth, ...authenticatedLimits('dashboard', { userMax: 120, ipMax: 300 }))

function shiftMonth(month, offset) {
  const [year, index] = month.split('-').map(Number)
  const date = new Date(Date.UTC(year, index - 1 + offset, 1))
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
}

dashboardRouter.get('/', (req, res) => {
  const month = req.query.month ?? currentMonth()
  if (!isMonth(month)) return res.status(400).json({ error: 'month must be YYYY-MM' })

  const totals = db
    .prepare(
      `SELECT COALESCE(SUM(amount), 0) AS total, COUNT(*) AS count
       FROM expenses WHERE user_id = ? AND strftime('%Y-%m', date) = ?`,
    )
    .get(req.userId, month)

  const previousMonth = shiftMonth(month, -1)
  const previous = db
    .prepare(
      `SELECT COALESCE(SUM(amount), 0) AS total
       FROM expenses WHERE user_id = ? AND strftime('%Y-%m', date) = ?`,
    )
    .get(req.userId, previousMonth)

  const byCategory = db
    .prepare(
      `SELECT category, SUM(amount) AS total
       FROM expenses WHERE user_id = ? AND strftime('%Y-%m', date) = ?
       GROUP BY category ORDER BY total DESC`,
    )
    .all(req.userId, month)

  const monthKeys = Array.from({ length: 6 }, (_, index) => shiftMonth(month, index - 5))
  const monthlyRows = db
    .prepare(
      `SELECT strftime('%Y-%m', date) AS month, SUM(amount) AS total
       FROM expenses WHERE user_id = ? AND strftime('%Y-%m', date) >= ? AND strftime('%Y-%m', date) <= ?
       GROUP BY month`,
    )
    .all(req.userId, monthKeys[0], month)

  const monthly = monthKeys.map((key) => ({
    month: key,
    total: monthlyRows.find((row) => row.month === key)?.total ?? 0,
  }))

  const budgets = db
    .prepare('SELECT category, amount FROM budgets WHERE user_id = ? AND month = ? ORDER BY category')
    .all(req.userId, month)

  const budgetProgress = budgets.map((budget) => {
    const spent = byCategory.find((row) => row.category === budget.category)?.total ?? 0
    return {
      category: budget.category,
      limit: budget.amount,
      spent,
      ratio: budget.amount > 0 ? spent / budget.amount : 0,
    }
  })

  const recent = db
    .prepare('SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC, created_at DESC LIMIT 6')
    .all(req.userId)

  return res.json({
    month,
    monthlyTotal: totals.total,
    transactionCount: totals.count,
    averageExpense: totals.count ? totals.total / totals.count : 0,
    previousMonthTotal: previous.total,
    byCategory,
    monthly,
    budgetProgress,
    totalBudget: budgets.reduce((sum, budget) => sum + budget.amount, 0),
    recent,
  })
})
