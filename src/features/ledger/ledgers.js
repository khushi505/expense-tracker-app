import { CATEGORIES, CATEGORY_NAMES, HOUSE_CATEGORIES, HOUSE_CATEGORY_NAMES, INVEST_CATEGORIES, INVEST_CATEGORY_NAMES } from '../../constants/categories';
import { KEYS } from '../../constants/storageKeys';

// The sets of entries (daily spending, house bills, investments). Each has its own entries, budget and category icons, saved under its own keys.
export const LEDGERS = {
  daily: {
    id: 'daily',
    label: 'Daily',
    iconsTitle: 'Category icons',
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
    iconsTitle: 'House icons',
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
  invest: {
    id: 'invest',
    label: 'Invest',
    iconsTitle: 'Investment icons',
    listTitle: 'Investments',
    addTitle: 'Add investment',
    editTitle: 'Edit investment',
    totalLabel: 'Invested',
    viewLabel: 'View investments',
    reportName: 'Investment report',
    filePrefix: 'investment-report',
    categories: INVEST_CATEGORIES,
    names: INVEST_CATEGORY_NAMES,
    keys: { expenses: KEYS.investExpenses, budget: KEYS.investBudget, icons: KEYS.investIcons },
  },
};

export const LEDGER_OPTIONS = [['Daily', 'daily'], ['House', 'house'], ['Invest', 'invest']];
