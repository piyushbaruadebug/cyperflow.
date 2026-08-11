import { createContext, useContext } from 'react'
import type { Budget, Category, Expense, User } from '../types'

export interface AppState {
  user: User | null
  ready: boolean
  expenses: Expense[]
  budgets: Budget[]
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>
  deleteExpense: (id: string) => Promise<void>
  setBudget: (category: Category, limit: number) => Promise<void>
  refresh: () => Promise<void>
}

export const AppContext = createContext<AppState | null>(null)

export function useApp(): AppState {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
