export const CATEGORIES = [
  'Food',
  'Transport',
  'Housing',
  'Shopping',
  'Entertainment',
  'Health',
  'Bills',
  'Other',
]

export const METHODS = ['Card', 'Cash', 'UPI', 'Bank Transfer']

export const isMonth = (value) => /^\d{4}-\d{2}$/.test(String(value))
export const isDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value))
export const currentMonth = () => new Date().toISOString().slice(0, 7)
