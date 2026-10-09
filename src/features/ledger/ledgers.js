import { CATEGORIES, CATEGORY_NAMES, HOUSE_CATEGORIES, HOUSE_CATEGORY_NAMES } from '../../constants/categories';
import { KEYS } from '../../constants/storageKeys';

// The two sets of expenses. Each has its own entries, budget and category icons, saved under its own keys.
export const LEDGERS = {
  daily: {
    id: 'daily',
    label: 'Daily',
    listTitle: 'Expenses',
    addTitle: 'Add expense',
    editTitle: 'Edit expense',
    totalLabel: 'Total spent',
    viewLabel: 'View expenses',
    reportName: 'Expense report',
    filePrefix: 'expense-report',
    categories: CATEGORIES,
    names: CATEGORY_NAMES,
    keys: { expenses: KEYS.expenses, budget: KEYS.budget, icons: KEYS.icons },
  },
  house: {
    id: 'house',
    label: 'House',
    listTitle: 'House expenses',
    addTitle: 'Add house expense',
    editTitle: 'Edit house expense',
    totalLabel: 'House total',
    viewLabel: 'View house expenses',
    reportName: 'House expense report',
    filePrefix: 'house-report',
    categories: HOUSE_CATEGORIES,
    names: HOUSE_CATEGORY_NAMES,
    keys: { expenses: KEYS.houseExpenses, budget: KEYS.houseBudget, icons: KEYS.houseIcons },
  },
};

export const LEDGER_OPTIONS = [['Daily', 'daily'], ['House', 'house']];
