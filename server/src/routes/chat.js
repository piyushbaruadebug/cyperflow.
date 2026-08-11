import { Router } from 'express'
import { requireAuth } from '../auth.js'
import { currentMonth } from '../categories.js'
import { db, newId } from '../db.js'
import { generateReply } from '../chatbot.js'
import { generateLlmReply } from '../llm.js'
import { authenticatedLimits } from '../rateLimit.js'

export const chatRouter = Router()
// AI calls are more expensive than normal authenticated actions, so this is intentionally lower.
chatRouter.use(requireAuth, ...authenticatedLimits('chat', { userMax: 30, ipMax: 80 }))

chatRouter.get('/', (req, res) => {
  const messages = db
    .prepare('SELECT id, role, message, created_at FROM chat_messages WHERE user_id = ? ORDER BY created_at, rowid')
    .all(req.userId)

  return res.json({ messages })
})

chatRouter.post('/', async (req, res) => {
  const message = String(req.body?.message ?? '').trim()
  if (message.length === 0) return res.status(400).json({ error: 'message is required' })

  const month = currentMonth()
  const insert = db.prepare('INSERT INTO chat_messages (id, user_id, role, message) VALUES (?, ?, ?, ?)')

  const byCategory = db
    .prepare(
      `SELECT category, SUM(amount) AS total FROM expenses
       WHERE user_id = ? AND strftime('%Y-%m', date) = ? GROUP BY category ORDER BY total DESC`,
    )
    .all(req.userId, month)
  const budgets = db.prepare('SELECT category, amount FROM budgets WHERE user_id = ? AND month = ?').all(req.userId, month)
  const recent = db
    .prepare('SELECT description, amount, category FROM expenses WHERE user_id = ? ORDER BY date DESC LIMIT 3')
    .all(req.userId)
  const monthlyRows = db
    .prepare(
      `SELECT strftime('%Y-%m', date) AS month, SUM(amount) AS total FROM expenses
       WHERE user_id = ? GROUP BY month ORDER BY month DESC LIMIT 2`,
    )
    .all(req.userId)

  const summary = { month, byCategory, budgets, recent, monthlyRows }
  const history = db
    .prepare('SELECT role, message FROM chat_messages WHERE user_id = ? ORDER BY created_at DESC, rowid DESC LIMIT 10')
    .all(req.userId)
    .reverse()

  const reply = (await generateLlmReply(message, summary, history)) ?? generateReply(message, summary)

  const userId = newId()
  const assistantId = newId()
  db.transaction(() => {
    insert.run(userId, req.userId, 'user', message)
    insert.run(assistantId, req.userId, 'assistant', reply)
  })()

  return res.status(201).json({
    userMessage: db.prepare('SELECT id, role, message, created_at FROM chat_messages WHERE id = ?').get(userId),
    reply: db.prepare('SELECT id, role, message, created_at FROM chat_messages WHERE id = ?').get(assistantId),
  })
})
