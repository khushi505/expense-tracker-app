// What is left of the salary after daily spending, house bills and investments.
export function overview({ salary, daily, house, invest }) {
  const spent = daily + house + invest;
  const hasSalary = salary != null;
  const left = hasSalary ? Math.round((salary - spent) * 100) / 100 : null;
  const pct = x => (hasSalary && salary > 0 ? Math.round((x / salary) * 100) : null);
  return { spent, hasSalary, left, over: hasSalary && left < 0, pct, base: Math.max(hasSalary ? salary : 0, spent) };
}
