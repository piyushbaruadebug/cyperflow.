import type { Budget, Category, ChatMessage, Expense, PaymentMethod, User } from '../types'

const TOKEN_KEY = 'ft.token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken()
  const response = await fetch(`/api${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  })

  if (response.status === 204) return undefined as T

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new ApiError((payload as { error?: string }).error ?? response.statusText, response.status)
  }
  return payload as T
}

export interface ExpenseRow {
  id: string
  user_id: string
  amount: number
  category: Category
  description: string
  date: string
  method: PaymentMethod
  created_at: string
}

export interface DashboardResponse {
  month: string
  monthlyTotal: number
  transactionCount: number
  averageExpense: number
  previousMonthTotal: number
  byCategory: { category: Category; total: number }[]
  monthly: { month: string; total: number }[]
  budgetProgress: { category: Category; limit: number; spent: number; ratio: number }[]
  totalBudget: number
  recent: ExpenseRow[]
}

const toExpense = (row: ExpenseRow): Expense => ({
  id: row.id,
  amount: row.amount,
  category: row.category,
  description: row.description,
  date: row.date,
  method: row.method,
})

export const api = {
  signup: (name: string, email: string, password: string) =>
    request<{ token: string; user: User }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  forgotPassword: (email: string) =>
    request<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, password: string) =>
    request<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),

  me: () => request<{ user: User }>('/auth/me'),

  listExpenses: async (params: { category?: string; month?: string; search?: string } = {}): Promise<Expense[]> => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, value]) => value && value !== 'All') as [string, string][],
    ).toString()
    const { expenses } = await request<{ expenses: ExpenseRow[] }>(`/expenses${query ? `?${query}` : ''}`)
    return expenses.map(toExpense)
  },

  createExpense: async (expense: Omit<Expense, 'id'>): Promise<Expense> => {
    const { expense: row } = await request<{ expense: ExpenseRow }>('/expenses', {
      method: 'POST',
      body: JSON.stringify(expense),
    })
    return toExpense(row)
  },

  updateExpense: async (id: string, patch: Partial<Omit<Expense, 'id'>>): Promise<Expense> => {
    const { expense } = await request<{ expense: ExpenseRow }>(`/expenses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    })
    return toExpense(expense)
  },

  deleteExpense: (id: string) => request<void>(`/expenses/${id}`, { method: 'DELETE' }),

  listBudgets: async (month?: string): Promise<Budget[]> => {
    const { budgets } = await request<{ budgets: { category: Category; amount: number }[] }>(
      `/budgets${month ? `?month=${month}` : ''}`,
    )
    return budgets.map((budget) => ({ category: budget.category, limit: budget.amount }))
  },

  saveBudget: (category: Category, amount: number, month?: string) =>
    request<{ budget: unknown }>('/budgets', {
      method: 'POST',
      body: JSON.stringify({ category, amount, month }),
    }),

  dashboard: (month?: string) => request<DashboardResponse>(`/dashboard${month ? `?month=${month}` : ''}`),

  listChat: async (): Promise<ChatMessage[]> => {
    const { messages } = await request<{ messages: { id: string; role: ChatMessage['role']; message: string }[] }>(
      '/chat',
    )
    return messages.map((message) => ({ id: message.id, role: message.role, content: message.message }))
  },

  sendChat: async (message: string): Promise<ChatMessage> => {
    const { reply } = await request<{ reply: { id: string; role: ChatMessage['role']; message: string } }>('/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    })
    return { id: reply.id, role: reply.role, content: reply.message }
  },
}
