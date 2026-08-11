import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { authRouter } from './routes/auth.js'
import { budgetsRouter } from './routes/budgets.js'
import { chatRouter } from './routes/chat.js'
import { dashboardRouter } from './routes/dashboard.js'
import { expensesRouter } from './routes/expenses.js'
import { getLlmConfig, llmEnabled } from './llm.js'
import { publicIpLimit } from './rateLimit.js'

const app = express()
app.set('trust proxy', process.env.TRUST_PROXY === 'true')
app.use(cors())
app.use(express.json())

app.get('/api/health', publicIpLimit, (_req, res) => res.json({ ok: true, llm: llmEnabled() }))
app.use('/api/auth', authRouter)
app.use('/api/expenses', expensesRouter)
app.use('/api/budgets', budgetsRouter)
app.use('/api/dashboard', dashboardRouter)
app.use('/api/chat', chatRouter)

app.use((_req, res) => res.status(404).json({ error: 'Not found' }))

app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(500).json({ error: 'Internal server error' })
})

const port = Number(process.env.PORT) || 4000
app.listen(port, () => {
  const config = getLlmConfig()
  console.log(`API listening on http://localhost:${port}`)
  console.log(config ? `Chat: ${config.provider} LLM enabled (${config.model})` : 'Chat: rule-based (set GROQ_API_KEY, GEMINI_API_KEY, or OPENAI_API_KEY for LLM replies)')
})
