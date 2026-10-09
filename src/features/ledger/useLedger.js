import { useBudget } from '../budget/useBudget';
import { useExpenses } from '../expenses/useExpenses';
import { useCategoryIcons } from '../settings/useCategoryIcons';
import { LEDGERS } from './ledgers';

// Everything saved for one ledger: its expenses, budget and category icons.
export function useLedger(id) {
  const def = LEDGERS[id];
  const store = useExpenses(def.keys.expenses);
  const budget = useBudget(def.keys.budget);
  const icons = useCategoryIcons(def.keys.icons, def.categories);
  return { def, store, budget, icons };
}
