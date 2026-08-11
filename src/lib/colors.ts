import type { Category } from '../types'

export const CATEGORY_COLORS: Record<Category, string> = {
  Food: '#2f7df6',
  Transport: '#22c55e',
  Housing: '#f97316',
  Shopping: '#a855f7',
  Entertainment: '#ec4899',
  Health: '#14b8a6',
  Bills: '#eab308',
  Other: '#64748b',
}

export const SUGGESTED_PROMPTS = [
  'How much did I spend this month?',
  'What is my biggest category?',
  'Am I over budget anywhere?',
  'How can I save more?',
  'Show my recent expenses',
]
