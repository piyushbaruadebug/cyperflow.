const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const currencyPrecise = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
})

export function formatMoney(value: number, precise = false): string {
  return precise ? currencyPrecise.format(value) : currency.format(value)
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function monthKey(iso: string): string {
  return iso.slice(0, 7)
}

export function monthLabel(key: string): string {
  return new Date(`${key}-01T00:00:00`).toLocaleDateString('en-IN', {
    month: 'short',
    year: '2-digit',
  })
}

export function currentMonthKey(): string {
  return new Date().toISOString().slice(0, 7)
}
