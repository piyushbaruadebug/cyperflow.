const money = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(value ?? 0)

export function getLlmConfig() {
  if (process.env.GROQ_API_KEY) {
    return {
      provider: 'Groq',
      url: 'https://api.groq.com/openai/v1/chat/completions',
      apiKey: process.env.GROQ_API_KEY,
      model: process.env.GROQ_MODEL || process.env.OPENAI_MODEL || 'llama-3.3-70b-versatile',
    }
  }
  if (process.env.GEMINI_API_KEY) {
    return {
      provider: 'Gemini',
      url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
      apiKey: process.env.GEMINI_API_KEY,
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    }
  }
  if (process.env.OPENAI_API_KEY) {
    return {
      provider: 'OpenAI',
      url: 'https://api.openai.com/v1/chat/completions',
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    }
  }
  return null
}

export const llmEnabled = () => Boolean(getLlmConfig())

function buildContext({ month, byCategory, budgets, recent, monthlyRows }) {
  const monthTotal = byCategory.reduce((sum, row) => sum + row.total, 0)
  const lines = [
    `Current month: ${month}. Total spent: ${money(monthTotal)}.`,
    byCategory.length
      ? `Spend by category: ${byCategory.map((row) => `${row.category} ${money(row.total)}`).join(', ')}.`
      : 'No expenses recorded this month.',
    budgets.length
      ? `Budgets: ${budgets.map((budget) => `${budget.category} ${money(budget.amount)}`).join(', ')}.`
      : 'No budgets set for this month.',
    monthlyRows.length
      ? `Recent monthly totals: ${monthlyRows.map((row) => `${row.month} ${money(row.total)}`).join(', ')}.`
      : '',
    recent.length
      ? `Latest expenses: ${recent
          .map((expense) => `${expense.description} ${money(expense.amount)} (${expense.category})`)
          .join('; ')}.`
      : '',
  ]
  return lines.filter(Boolean).join('\n')
}

/**
 * Answers a question with LLM provider (Groq, Gemini, or OpenAI), grounded in user's aggregated finance data.
 * Returns null when no API key is configured or the call fails, falling back to the built-in rule engine.
 */
export async function generateLlmReply(question, summary, history = []) {
  const config = getLlmConfig()
  if (!config) return null

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 20000)

  try {
    const response = await fetch(config.url, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        temperature: 0.3,
        max_tokens: 300,
        messages: [
          {
            role: 'system',
            content: [
              'You are PennyWise AI, a concise personal finance assistant.',
              'Answer only from the data below; if something is not in it, say so instead of inventing numbers.',
              'Keep replies under 80 words, use INR (₹) amounts, and give one concrete suggestion when relevant.',
              '',
              buildContext(summary),
            ].join('\n'),
          },
          ...history.map((entry) => ({ role: entry.role, content: entry.message })),
          { role: 'user', content: question },
        ],
      }),
    })

    if (!response.ok) {
      console.error(`${config.provider} request failed:`, response.status, await response.text())
      return null
    }

    const payload = await response.json()
    const reply = payload.choices?.[0]?.message?.content?.trim()
    return reply || null
  } catch (error) {
    console.error(`${config?.provider || 'LLM'} request error:`, error.message)
    return null
  } finally {
    clearTimeout(timeout)
  }
}
