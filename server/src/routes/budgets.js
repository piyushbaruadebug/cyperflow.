import { Router } from 'express'
import { requireAuth } from '../auth.js'
import { CATEGORIES, currentMonth, isMonth } from '../categories.js'
import { db, newId } from '../db.js'
import { authenticatedLimits } from '../rateLimit.js'

export const budgetsRouter = Router()
budgetsRouter.use(requireAuth, ...authenticatedLimits('budgets', { userMax: 120, ipMax: 300 }))

budgetsRouter.get('/', (req, res) => {
  const month = req.query.month ?? currentMonth()
  if (!isMonth(month)) return res.status(400).json({ error: 'month must be YYYY-MM' })

  const budgets = db
    .prepare('SELECT * FROM budgets WHERE user_id = ? AND month = ? ORDER BY category')
    .all(req.userId, month)

  return res.json({ month, budgets })
})

/** Upsert: posting the same category twice in a month updates the limit instead of duplicating it. */
budgetsRouter.post('/', (req, res) => {
  const { category, month = currentMonth() } = req.body ?? {}
  const amount = Number(req.body?.amount)

  if (!CATEGORIES.includes(category)) {
    return res.status(400).json({ error: `category must be one of ${CATEGORIES.join(', ')}` })
  }
  if (!isMonth(month)) return res.status(400).json({ error: 'month must be YYYY-MM' })
  if (!Number.isFinite(amount) || amount < 0) return res.status(400).json({ error: 'amount must be 0 or more' })

  db.prepare(
    `INSERT INTO budgets (id, user_id, month, category, amount) VALUES (?, ?, ?, ?, ?)
     ON CONFLICT (user_id, month, category) DO UPDATE SET amount = excluded.amount`,
  ).run(newId(), req.userId, month, category, amount)

  const budget = db
    .prepare('SELECT * FROM budgets WHERE user_id = ? AND month = ? AND category = ?')
    .get(req.userId, month, category)

  return res.status(201).json({ budget })
})
