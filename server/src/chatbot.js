const money = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(value ?? 0)

/** Rule-based stand-in for an LLM: answers from the caller's own aggregated data. */
export function generateReply(question, { month, byCategory, budgets, recent, monthlyRows }) {
  const text = question.toLowerCase()
  const monthTotal = byCategory.reduce((sum, row) => sum + row.total, 0)

  if (/budget|over ?spend|limit/.test(text)) {
    if (budgets.length === 0) {
      return 'You have not set any budgets for this month yet — add them on the Budget page and I can track them for you.'
    }
    const progress = budgets.map((budget) => ({
      category: budget.category,
      limit: budget.amount,
      spent: byCategory.find((row) => row.category === budget.category)?.total ?? 0,
    }))
    const over = progress.filter((row) => row.limit > 0 && row.spent >= row.limit)
    const close = progress.filter((row) => row.limit > 0 && row.spent / row.limit >= 0.8 && row.spent < row.limit)

    if (over.length === 0 && close.length === 0) {
      const totalLimit = progress.reduce((sum, row) => sum + row.limit, 0)
      return `You are on track everywhere this month: ${money(monthTotal)} spent against a ${money(totalLimit)} budget.`
    }

    return [
      over.length
        ? `Over budget: ${over.map((row) => `${row.category} (${money(row.spent)} of ${money(row.limit)})`).join(', ')}.`
        : '',
      close.length
        ? `Getting close: ${close.map((row) => `${row.category} at ${Math.round((row.spent / row.limit) * 100)}%`).join(', ')}.`
        : '',
      'Consider shifting some spend to next month or raising those limits.',
    ]
      .filter(Boolean)
      .join(' ')
  }

  if (/biggest|top|most|largest|highest/.test(text)) {
    if (byCategory.length === 0) return `No expenses recorded for ${month} yet.`
    const [top, runnerUp] = byCategory
    const share = Math.round((top.total / monthTotal) * 100)
    return `${top.category} is your biggest category this month at ${money(top.total)} (${share}% of spend)${
      runnerUp ? `, followed by ${runnerUp.category} at ${money(runnerUp.total)}` : ''
    }.`
  }

  if (/save|reduce|cut|advice|tip/.test(text)) {
    const target = byCategory.find((row) => ['Shopping', 'Entertainment', 'Food', 'Other'].includes(row.category))
    if (!target) return 'Your spend is mostly fixed costs this month, so savings will come from renegotiating bills.'
    const saving = target.total * 0.15
    return `Trimming ${target.category} by 15% would save about ${money(saving)} a month, or ${money(
      saving * 12,
    )} a year. A weekly cap for that category is the easiest way to get there.`
  }

  if (/trend|compare|last month|history/.test(text)) {
    const [current, previous] = monthlyRows
    if (!current) return 'There is nothing recorded yet — add an expense and I can compare months for you.'
    if (!previous) return `You have ${money(current.total)} of spend recorded in ${current.month}.`
    const delta = current.total - previous.total
    return `${current.month} is ${delta >= 0 ? 'up' : 'down'} ${money(Math.abs(delta))} versus ${previous.month} (${money(
      current.total,
    )} vs ${money(previous.total)}).`
  }

  if (/recent|latest|last few|show me/.test(text)) {
    if (recent.length === 0) return 'No expenses recorded yet — add one from the Add Expense page.'
    return `Your latest expenses: ${recent
      .map((expense) => `${expense.description} ${money(expense.amount)} (${expense.category})`)
      .join('; ')}.`
  }

  if (/spend|spent|total|how much/.test(text)) {
    return `You have spent ${money(monthTotal)} in ${month}${
      byCategory[0] ? `, led by ${byCategory[0].category} at ${money(byCategory[0].total)}` : ''
    }.`
  }

  return `I can break down spending by category, compare months, check budgets, or suggest savings. This month you are at ${money(
    monthTotal,
  )} — ask me about any of those.`
}
