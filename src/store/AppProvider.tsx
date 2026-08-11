import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api, clearToken, getToken, setToken } from '../lib/api'
import type { Budget, Category, Expense, User } from '../types'
import { AppContext, type AppState } from './appContext'

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])

  const loadData = useCallback(async () => {
    const [nextExpenses, nextBudgets] = await Promise.all([api.listExpenses(), api.listBudgets()])
    setExpenses(nextExpenses)
    setBudgets(nextBudgets)
  }, [])

  useEffect(() => {
    if (!getToken()) {
      setReady(true)
      return
    }

    api
      .me()
      .then(async ({ user: profile }) => {
        setUser(profile)
        await loadData()
      })
      .catch(() => {
        clearToken()
        setUser(null)
      })
      .finally(() => setReady(true))
  }, [loadData])

  const authenticate = useCallback(
    async (result: Promise<{ token: string; user: User }>) => {
      const { token, user: profile } = await result
      setToken(token)
      setUser(profile)
      await loadData()
    },
    [loadData],
  )

  const login = useCallback(
    (email: string, password: string) => authenticate(api.login(email, password)),
    [authenticate],
  )

  const signup = useCallback(
    (name: string, email: string, password: string) => authenticate(api.signup(name, email, password)),
    [authenticate],
  )

  const logout = useCallback(() => {
    clearToken()
    setUser(null)
    setExpenses([])
    setBudgets([])
  }, [])

  const addExpense = useCallback(async (expense: Omit<Expense, 'id'>) => {
    const created = await api.createExpense(expense)
    setExpenses((prev) => [created, ...prev].sort((a, b) => b.date.localeCompare(a.date)))
  }, [])

  const deleteExpense = useCallback(async (id: string) => {
    await api.deleteExpense(id)
    setExpenses((prev) => prev.filter((expense) => expense.id !== id))
  }, [])

  const setBudget = useCallback(async (category: Category, limit: number) => {
    await api.saveBudget(category, limit)
    setBudgets((prev) =>
      prev.some((budget) => budget.category === category)
        ? prev.map((budget) => (budget.category === category ? { ...budget, limit } : budget))
        : [...prev, { category, limit }],
    )
  }, [])

  const value = useMemo<AppState>(
    () => ({
      user,
      ready,
      expenses,
      budgets,
      login,
      signup,
      logout,
      addExpense,
      deleteExpense,
      setBudget,
      refresh: loadData,
    }),
    [user, ready, expenses, budgets, login, signup, logout, addExpense, deleteExpense, setBudget, loadData],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
