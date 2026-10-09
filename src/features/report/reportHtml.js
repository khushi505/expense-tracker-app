import { dateKey, dateLabel, monthLabel } from '../../utils/dates';

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// The page that becomes the PDF: month total, budget, and every expense grouped by date.
export function buildReportHtml({ month, name, reportName = 'Expense report', total, count, sections, budgetStatus, cats, accent }) {
  const { hasBudget, budgetNum, left, over } = budgetStatus;
  const budgetLine = hasBudget
    ? over
      ? `Budget ${budgetNum} Rs &middot; over by ${-left} Rs`
      : `Budget ${budgetNum} Rs &middot; ${left} Rs left`
    : '';

  const days = sections
    .map(
      s => `
    <div class="day">
      <div class="day-head"><span>${esc(dateLabel(s.date))}</span><span>${s.total} Rs</span></div>
      ${s.data
        .map(
          e => `<div class="row"><span class="icon">${e.category && cats[e.category] ? esc(cats[e.category]) : ''}</span><span class="label">${esc(e.label)}</span><span class="amount">${e.amount} Rs</span></div>`
        )
        .join('')}
    </div>`
    )
    .join('');

  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  body { font-family: -apple-system, Roboto, Helvetica, Arial, sans-serif; color: #1c1c28; margin: 0; padding: 32px; }
  h1 { font-size: 22px; margin: 0; color: ${esc(accent)}; }
  .sub { color: #7a7a8c; font-size: 13px; margin-top: 4px; }
  .summary { margin: 22px 0 8px; padding: 16px 18px; border-radius: 12px; background: #f3f2fc; }
  .total { font-size: 30px; font-weight: 700; }
  .meta { color: #7a7a8c; font-size: 13px; margin-top: 4px; }
  .day { margin-top: 18px; page-break-inside: avoid; }
  .day-head { display: flex; justify-content: space-between; font-weight: 600; color: #7a7a8c; font-size: 13px; border-bottom: 1px solid #e3e3ec; padding-bottom: 5px; }
  .row { display: flex; align-items: center; padding: 7px 0; font-size: 15px; border-bottom: 1px solid #f0f0f5; }
  .icon { width: 26px; }
  .label { flex: 1; }
  .amount { font-weight: 600; }
  .empty { color: #7a7a8c; margin-top: 24px; }
  .foot { margin-top: 28px; color: #9a9aad; font-size: 11px; }
</style></head>
<body>
  <h1>${esc(monthLabel(month))}</h1>
  <div class="sub">${name ? `${esc(name)} &middot; ` : ''}${esc(reportName)}</div>
  <div class="summary">
    <div class="meta">Total spent</div>
    <div class="total">${total} Rs</div>
    <div class="meta">${count} ${count === 1 ? 'expense' : 'expenses'}${budgetLine ? ` &middot; ${budgetLine}` : ''}</div>
  </div>
  ${days || '<div class="empty">No expenses this month.</div>'}
  <div class="foot">Created ${esc(dateLabel(dateKey(new Date())))} with Expense Tracker</div>
</body></html>`;
}
