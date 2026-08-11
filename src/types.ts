export const CATEGORIES = [
  'Food',
  'Transport',
  'Housing',
  'Shopping',
  'Entertainment',
  'Health',
  'Bills',
  'Other',
] as const

export type Category = (typeof CATEGORIES)[number]

export type PaymentMethod = 'Card' | 'Cash' | 'UPI' | 'Bank Transfer'

export interface Expense {
  id: string
  date: string
  description: string
  category: Category
  amount: number
  method: PaymentMethod
}

export interface Budget {
  category: Category
  limit: number
}

export interface User {
  name: string
  email: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}
