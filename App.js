import { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import Fab from './src/components/Fab';
import Header from './src/components/Header';
import MenuDrawer from './src/components/MenuDrawer';
import UndoSnackbar from './src/components/UndoSnackbar';
import { KEYS } from './src/constants/storageKeys';
import { ThemeProvider, useTheme, useThemedStyles } from './src/theme/ThemeContext';
import { dateOf, defaultDate } from './src/utils/dates';
import { useBackup } from './src/features/backup/useBackup';
import { budgetStatus } from './src/features/budget/budgetStatus';
import AddExpenseScreen from './src/features/expenses/AddExpenseScreen';
import ExpenseListScreen from './src/features/expenses/ExpenseListScreen';
import { summarize } from './src/features/expenses/expenseStats';
import { useExpenseForm } from './src/features/expenses/useExpenseForm';
import { useMonth } from './src/features/expenses/useMonth';
import HomeScreen from './src/features/home/HomeScreen';
import { useLedger } from './src/features/ledger/useLedger';
import OverviewScreen from './src/features/overview/OverviewScreen';
import LockScreen from './src/features/lock/LockScreen';
import { useAppLock } from './src/features/lock/useAppLock';
import { useHiddenTotal } from './src/features/privacy/useHiddenTotal';
import AppearanceScreen from './src/features/settings/AppearanceScreen';
import SecurityBackupScreen from './src/features/settings/SecurityBackupScreen';
import ProfileScreen from './src/features/settings/ProfileScreen';
import { useMonthlyAmount } from './src/features/settings/useMonthlyAmount';
import { useProfile } from './src/features/settings/useProfile';

export default function App() {
  return (
    <ThemeProvider>
      <Root />
    </ThemeProvider>
  );
}

// Wires the features together and decides which screen is showing.
function Root() {
  const { c, isDark } = useTheme();
  const styles = useThemedStyles(makeStyles);

  const [screen, setScreen] = useState('home'); // 'home' | 'overview' | 'list' | 'add' | 'profile' | 'appearance' | 'security'
  const [from, setFrom] = useState('home'); // screen to return to after the add/edit screen
  const [listFrom, setListFrom] = useState('home'); // where the list was opened from (home or the month overview)
  const [menuOpen, setMenuOpen] = useState(false);

  // Separate sets of entries (daily, house, investments), each with its own icons. One is shown at a time.
  const daily = useLedger('daily');
  const house = useLedger('house');
  const invest = useLedger('invest');
  const [ledgerId, setLedgerId] = useState('daily');
  const { def: ledger, store, icons } = { daily, house, invest }[ledgerId];
  // Entered in Profile, separately for each month. Only the daily section has a budget.
  const salary = useMonthlyAmount(KEYS.salary, KEYS.salaryAmount);
  const budgets = useMonthlyAmount(KEYS.budgetByMonth, KEYS.budget);
  const savings = useMonthlyAmount(KEYS.savingsByMonth, KEYS.savingsTarget);

  const { month, setMonth, date, setDate, changeMonth } = useMonth();
  const form = useExpenseForm();
  const profile = useProfile();
  const hide = useHiddenTotal();
  const appLock = useAppLock();
  const backup = useBackup({ daily, house, invest, salary, budgets, savings, profile });

  const { visible, total, byDate, sections } = summarize(store.expenses, month);
  const dailyMonth = summarize(daily.store.expenses, month);
  const houseMonth = summarize(house.store.expenses, month);
  const investMonth = summarize(invest.store.expenses, month);
  const status = budgetStatus(ledgerId === 'daily' ? budgets.valueFor(month) : null, total);
  const loggedThisMonth = dailyMonth.visible.length + houseMonth.visible.length + investMonth.visible.length;

  const go = sc => {
    form.reset();
    setScreen(sc);
    setMenuOpen(false);
  };
  const goBack = () => {
    form.reset();
    setScreen(screen === 'add' ? from : screen === 'list' ? listFrom : 'home');
  };
  const openList = (id, origin) => {
    if (id) setLedgerId(id);
    setListFrom(origin);
    setScreen('list');
  };
  const openAdd = () => {
    form.reset();
    setFrom(screen === 'list' ? 'list' : 'home');
    setDate(defaultDate(month));
    setScreen('add');
  };
  const startEdit = e => {
    const d = dateOf(e);
    form.load(e);
    setMonth(d.slice(0, 7));
    setDate(d);
    setFrom('list');
    setScreen('add');
  };
  const saveExpense = () => {
    if (form.submit(date, store)) setScreen(from);
  };
  // Delete the expense being edited, then go back to the list (the undo bar offers to bring it back).
  const deleteEditing = () => {
    store.remove(form.editingId);
    form.reset();
    setScreen(from);
  };

  if (!appLock.ready) return <View style={{ flex: 1, backgroundColor: c.bg }} />;
  if (appLock.locked) return <LockScreen bio={appLock.lock.bio} onUnlock={appLock.unlock} />;
  if (appLock.cover) return <View style={{ flex: 1, backgroundColor: c.bg }} />;

  const titles = {
    home: 'Tracker',
    overview: 'Month overview',
    list: ledger.listTitle,
    add: form.editingId ? ledger.editTitle : ledger.addTitle,
    profile: 'Profile',
    appearance: 'Appearance',
    security: 'Security & backup',
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <Header title={titles[screen]} showBack={screen !== 'home'} onBack={goBack} onMenu={() => setMenuOpen(true)} />

      {screen === 'home' && (
        <HomeScreen
          ledger={ledger}
          onLedgerChange={setLedgerId}
          month={month}
          onMonthChange={changeMonth}
          total={total}
          count={visible.length}
          budgetStatus={status}
          hide={hide}
          onViewExpenses={() => openList(null, 'home')}
        />
      )}

      {screen === 'overview' && (
        <OverviewScreen
          month={month}
          onMonthChange={changeMonth}
          salary={salary.valueFor(month)}
          savingsTarget={savings.valueFor(month)}
          daily={dailyMonth.total}
          house={houseMonth.total}
          invest={investMonth.total}
          hide={hide}
          onOpen={id => openList(id, 'overview')}
        />
      )}

      {screen === 'list' && (
        <ExpenseListScreen
          ledger={ledger}
          month={month}
          name={profile.name}
          total={total}
          count={visible.length}
          sections={sections}
          budgetStatus={status}
          cats={icons.cats}
          onEdit={startEdit}
        />
      )}

      {(screen === 'home' || screen === 'list') && <Fab onPress={openAdd} />}

      {screen === 'add' && (
        <AddExpenseScreen
          month={month}
          date={date}
          onSelectDate={setDate}
          onMonthChange={changeMonth}
          markedDays={byDate}
          cats={icons.cats}
          form={form}
          onSave={saveExpense}
          onDelete={deleteEditing}
        />
      )}

      {screen === 'profile' && (
        <ProfileScreen
          name={profile.name}
          saveName={profile.saveName}
          month={month}
          onMonthChange={changeMonth}
          salary={salary}
          dailyBudget={budgets}
          savingsTarget={savings}
          count={loggedThisMonth}
        />
      )}

      {screen === 'appearance' && <AppearanceScreen ledgers={[daily, house, invest]} />}
      {screen === 'security' && (
        <SecurityBackupScreen
          lock={appLock.lock}
          saveLock={appLock.saveLock}
          bioAvailable={appLock.bioAvailable}
          backup={backup}
          count={daily.store.expenses.length + house.store.expenses.length + invest.store.expenses.length}
        />
      )}

      <UndoSnackbar undo={store.undo} onUndo={store.restore} />
      <MenuDrawer visible={menuOpen} onClose={() => setMenuOpen(false)} name={profile.name} screen={screen} onSelect={go} />
    </SafeAreaView>
  );
}

const makeStyles = c =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg, padding: 16, paddingTop: 48 },
  });
