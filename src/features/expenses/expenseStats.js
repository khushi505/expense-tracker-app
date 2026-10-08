import { dateOf } from '../../utils/dates';

// Everything the screens need to know about one month's expenses.
export function summarize(expenses, month) {
  const visible = expenses.filter(e => dateOf(e).startsWith(month));
  const total = visible.reduce((s, e) => s + e.amount, 0);
  const byDate = {};
  visible.forEach(e => (byDate[dateOf(e)] ||= []).push(e));
  const sections = Object.keys(byDate).sort().reverse().map(d => ({
    date: d,
    total: byDate[d].reduce((s, e) => s + e.amount, 0),
    data: byDate[d],
  }));
  return { visible, total, byDate, sections };
}

export const sumAll = expenses => expenses.reduce((sum, e) => sum + e.amount, 0);
