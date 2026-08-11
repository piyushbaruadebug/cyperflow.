import { CATEGORIES, type Budget, type Category, type Expense } from '../types'
import { currentMonthKey, monthKey, monthLabel } from './format'

export function totalOf(expenses: Expense[]): number {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0)
}

export function expensesInMonth(expenses: Expense[], key = currentMonthKey()): Expense[] {
  return expenses.filter((expense) => monthKey(expense.date) === key)
}

export function totalsByCategory(expenses: Expense[]): { category: Category; total: number }[] {
  return CATEGORIES.map((category) => ({
    category,
    total: totalOf(expenses.filter((expense) => expense.category === category)),
  })).filter((row) => row.total > 0)
}

export function monthlyTotals(expenses: Expense[], months = 6): { key: string; label: string; total: number }[] {
  const now = new Date()
  const rows: { key: string; label: string; total: number }[] = []

  for (let offset = months - 1; offset >= 0; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    rows.push({ key, label: monthLabel(key), total: totalOf(expensesInMonth(expenses, key)) })
  }

  return rows
}

export interface BudgetProgress {
  category: Category
  limit: number
  spent: number
  ratio: number
}

export function budgetProgress(expenses: Expense[], budgets: Budget[], key = currentMonthKey()): BudgetProgress[] {
  const monthExpenses = expensesInMonth(expenses, key)
  return budgets.map((budget) => {
    const spent = totalOf(monthExpenses.filter((expense) => expense.category === budget.category))
    return {
      category: budget.category,
      limit: budget.limit,
      spent,
      ratio: budget.limit > 0 ? spent / budget.limit : 0,
    }
  })
}
