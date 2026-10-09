// Keys used in AsyncStorage. Changing one would orphan data already saved on people's phones.
export const KEYS = {
  expenses: 'expenses',
  theme: 'theme',
  profile: 'profile',
  budget: 'budget',
  icons: 'icons',
  lock: 'lock',
  lastBackup: 'lastbackup',
  houseExpenses: 'house_expenses',
  houseIcons: 'house_icons',
  investExpenses: 'invest_expenses',
  investIcons: 'invest_icons',
  // Per-month amounts, entered in Profile ({ '2026-10': '80000' }).
  salary: 'salary',
  budgetByMonth: 'budget_by_month',
  savingsByMonth: 'savings_by_month',
  // Older single amounts. Read once, moved to the current month, then cleared.
  salaryAmount: 'salary_amount',
  savingsTarget: 'savings_target',
};
