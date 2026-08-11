import { Router } from 'express'
import { requireAuth } from '../auth.js'
import { CATEGORIES, METHODS, isDate, isMonth } from '../categories.js'
import { db, newId } from '../db.js'
import { authenticatedLimits } from '../rateLimit.js'

export const expensesRouter = Router()
expensesRouter.use(requireAuth, ...authenticatedLimits('expenses'))

function validate(body, { partial = false } = {}) {
  const errors = []
  const patch = {}

  if (body.amount !== undefined || !partial) {
    const amount = Number(body.amount)
    if (!Number.isFinite(amount) || amount <= 0) errors.push('amount must be a number greater than 0')
    else patch.amount = Math.round(amount * 100) / 100
  }
  if (body.category !== undefined || !partial) {
    if (!CATEGORIES.includes(body.category)) errors.push(`category must be one of ${CATEGORIES.join(', ')}`)
    else patch.category = body.category
  }
  if (body.description !== undefined || !partial) {
    const description = String(body.description ?? '').trim()
    if (description.length < 2) errors.push('description must be at least 2 characters')
    else patch.description = description
  }
  if (body.date !== undefined || !partial) {
    if (!isDate(body.date)) errors.push('date must be YYYY-MM-DD')
    else patch.date = body.date
  }
  if (body.method !== undefined) {
    if (!METHODS.includes(body.method)) errors.push(`method must be one of ${METHODS.join(', ')}`)
    else patch.method = body.method
  }

  return { errors, patch }
}

expensesRouter.get('/', (req, res) => {
  const { category, month, search, limit } = req.query
  const clauses = ['user_id = ?']
  const params = [req.userId]

  if (category && category !== 'All') {
    if (!CATEGORIES.includes(category)) return res.status(400).json({ error: 'Unknown category' })
    clauses.push('category = ?')
    params.push(category)
  }
  if (month && month !== 'All') {
    if (!isMonth(month)) return res.status(400).json({ error: 'month must be YYYY-MM' })
    clauses.push("strftime('%Y-%m', date) = ?")
    params.push(month)
  }
  if (search) {
    clauses.push('description LIKE ?')
    params.push(`%${search}%`)
  }

  const max = Math.min(Number(limit) || 500, 1000)
  const rows = db
    .prepare(`SELECT * FROM expenses WHERE ${clauses.join(' AND ')} ORDER BY date DESC, created_at DESC LIMIT ?`)
    .all(...params, max)

  return res.json({ expenses: rows })
})

expensesRouter.post('/', (req, res) => {
  const { errors, patch } = validate(req.body ?? {})
  if (errors.length) return res.status(400).json({ error: errors.join('; ') })

  const id = newId()
  db.prepare(
    'INSERT INTO expenses (id, user_id, amount, category, description, date, method) VALUES (?, ?, ?, ?, ?, ?, ?)',
  ).run(id, req.userId, patch.amount, patch.category, patch.description, patch.date, patch.method ?? 'Card')

  return res.status(201).json({ expense: db.prepare('SELECT * FROM expenses WHERE id = ?').get(id) })
})

expensesRouter.patch('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM expenses WHERE id = ? AND user_id = ?').get(req.params.id, req.userId)
  if (!existing) return res.status(404).json({ error: 'Expense not found' })

  const { errors, patch } = validate(req.body ?? {}, { partial: true })
  if (errors.length) return res.status(400).json({ error: errors.join('; ') })
  const fields = Object.keys(patch)
  if (fields.length === 0) return res.status(400).json({ error: 'No updatable fields provided' })

  db.prepare(`UPDATE expenses SET ${fields.map((field) => `${field} = ?`).join(', ')} WHERE id = ? AND user_id = ?`).run(
    ...fields.map((field) => patch[field]),
    req.params.id,
    req.userId,
  )

  return res.json({ expense: db.prepare('SELECT * FROM expenses WHERE id = ?').get(req.params.id) })
})

expensesRouter.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM expenses WHERE id = ? AND user_id = ?').run(req.params.id, req.userId)
  if (result.changes === 0) return res.status(404).json({ error: 'Expense not found' })
  return res.status(204).end()
})
