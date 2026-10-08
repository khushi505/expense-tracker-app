import { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import Fab from './src/components/Fab';
import Header from './src/components/Header';
import MenuDrawer from './src/components/MenuDrawer';
import UndoSnackbar from './src/components/UndoSnackbar';
import { ThemeProvider, useTheme, useThemedStyles } from './src/theme/ThemeContext';
import { dateOf, defaultDate } from './src/utils/dates';
import { useBackup } from './src/features/backup/useBackup';
import { useBudget } from './src/features/budget/useBudget';
import AddExpenseScreen from './src/features/expenses/AddExpenseScreen';
import ExpenseListScreen from './src/features/expenses/ExpenseListScreen';
import { summarize, sumAll } from './src/features/expenses/expenseStats';
import { useExpenseForm } from './src/features/expenses/useExpenseForm';
import { useExpenses } from './src/features/expenses/useExpenses';
import { useMonth } from './src/features/expenses/useMonth';
import ReportScreen from './src/features/report/ReportScreen';
import HomeScreen from './src/features/home/HomeScreen';
import LockScreen from './src/features/lock/LockScreen';
import { useAppLock } from './src/features/lock/useAppLock';
import { useHiddenTotal } from './src/features/privacy/useHiddenTotal';
import AppearanceScreen from './src/features/settings/AppearanceScreen';
import SecurityBackupScreen from './src/features/settings/SecurityBackupScreen';
import ProfileScreen from './src/features/settings/ProfileScreen';
import { useCategoryIcons } from './src/features/settings/useCategoryIcons';
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

  const [screen, setScreen] = useState('home'); // 'home' | 'list' | 'add' | 'report' | 'profile' | 'appearance' | 'security'
  const [from, setFrom] = useState('home'); // screen to return to after the add/edit screen
  const [menuOpen, setMenuOpen] = useState(false);

  const store = useExpenses();
  const { month, setMonth, date, setDate, changeMonth } = useMonth();
  const form = useExpenseForm();
  const profile = useProfile();
  const budget = useBudget();
  const icons = useCategoryIcons();
  const hide = useHiddenTotal();
  const appLock = useAppLock();
  const backup = useBackup({ store, profile, budget, icons });

  const { visible, total, byDate, sections } = summarize(store.expenses, month);

  const go = sc => {
    form.reset();
    setScreen(sc);
    setMenuOpen(false);
  };
  const goBack = () => {
    form.reset();
    setScreen(screen === 'add' ? from : 'home');
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
    home: 'Expense Tracker',
    list: 'Expenses',
    add: form.editingId ? 'Edit expense' : 'Add expense',
    profile: 'Profile',
    report: 'Monthly report',
    appearance: 'Appearance',
    security: 'Security & backup',
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <Header title={titles[screen]} showBack={screen !== 'home'} onBack={goBack} onMenu={() => setMenuOpen(true)} />

      {screen === 'home' && (
        <HomeScreen
          month={month}
          onMonthChange={changeMonth}
          total={total}
          count={visible.length}
          budgetStatus={budget.statusFor(total)}
          hide={hide}
          onViewExpenses={() => setScreen('list')}
        />
      )}

      {screen === 'list' && (
        <ExpenseListScreen
          month={month}
          total={total}
          sections={sections}
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
          budget={budget.budget}
          saveBudget={budget.saveBudget}
          monthTotal={total}
          allTotal={sumAll(store.expenses)}
          count={store.expenses.length}
        />
      )}

      {screen === 'appearance' && <AppearanceScreen cats={icons.cats} setIcon={icons.setIcon} resetIcons={icons.resetIcons} />}
      {screen === 'security' && (
        <SecurityBackupScreen
          lock={appLock.lock}
          saveLock={appLock.saveLock}
          bioAvailable={appLock.bioAvailable}
          backup={backup}
          count={store.expenses.length}
        />
      )}

      {screen === 'report' && (
        <ReportScreen
          month={month}
          onMonthChange={changeMonth}
          total={total}
          count={visible.length}
          sections={sections}
          budgetStatus={budget.statusFor(total)}
          cats={icons.cats}
          name={profile.name}
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
