import { useExpenses } from '../expenses/useExpenses';
import { useCategoryIcons } from '../settings/useCategoryIcons';
import { LEDGERS } from './ledgers';

// Everything saved for one ledger: its expenses and category icons.
export function useLedger(id) {
  const def = LEDGERS[id];
  const store = useExpenses(def.keys.expenses);
  const icons = useCategoryIcons(def.keys.icons, def.categories);
  return { def, store, icons };
}
