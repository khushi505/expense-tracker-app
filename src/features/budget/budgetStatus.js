// How a month's `total` compares with its budget (budget is a number, or null when none is set for the month).
export function budgetStatus(budget, total) {
  const budgetNum = budget == null ? NaN : budget;
  const hasBudget = budgetNum > 0;
  const left = Math.round((budgetNum - total) * 100) / 100;
  return { budgetNum, hasBudget, left, over: hasBudget && left < 0 };
}
