import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { KEYS } from '../../constants/storageKeys';
import { useTheme } from '../../theme/ThemeContext';
import { dateKey } from '../../utils/dates';
import { asText, load, save } from '../../utils/storage';
import { buildBackup, mergeExpenses, parseBackup } from './backupFormat';
import { pickBackupText, shareBackupFile } from './backupFiles';

const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

// Back up everything to a file, and restore from one. Takes the other features' state as inputs.
export function useBackup({ daily, house, invest, salary, profile }) {
  const { mode, accent, saveTheme } = useTheme();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null); // { text, error }
  const [lastBackup, setLastBackup] = useState(null); // 'YYYY-MM-DD'

  useEffect(() => {
    load(KEYS.lastBackup, asText).then(v => v && setLastBackup(v));
  }, []);

  const backUp = async () => {
    setBusy(true);
    setMessage(null);
    try {
      const backup = buildBackup({
        expenses: daily.store.expenses,
        name: profile.name,
        budget: daily.budget.budget,
        icons: daily.icons.custom,
        theme: { mode, accent },
        house: { expenses: house.store.expenses, budget: house.budget.budget, icons: house.icons.custom },
        invest: { expenses: invest.store.expenses, icons: invest.icons.custom },
        salary: salary.salaries,
      });
      await shareBackupFile(backup);
      const today = dateKey(new Date());
      setLastBackup(today);
      save(KEYS.lastBackup, today, asText);
      setMessage({ text: 'Backup file created. Save it somewhere safe, like Google Drive.' });
    } catch (e) {
      setMessage({ text: e.message || 'Could not create the backup.', error: true });
    }
    setBusy(false);
  };

  const applyReplace = backup => {
    daily.store.replaceAll(backup.expenses);
    if (backup.name !== undefined) profile.saveName(backup.name);
    if (backup.budget !== undefined) daily.budget.saveBudget(backup.budget);
    if (backup.icons) daily.icons.saveIcons(backup.icons);
    if (backup.theme) saveTheme(backup.theme.mode, backup.theme.accent);
    // Parts missing from older backups (house, investments, salary) leave what is already here alone.
    const h = backup.house;
    if (h) {
      house.store.replaceAll(h.expenses);
      if (h.budget !== undefined) house.budget.saveBudget(h.budget);
      if (h.icons) house.icons.saveIcons(h.icons);
    }
    const inv = backup.invest;
    if (inv) {
      invest.store.replaceAll(inv.expenses);
      if (inv.icons) invest.icons.saveIcons(inv.icons);
    }
    if (backup.salary) salary.replaceAll(backup.salary);
    const extras = [h && plural(h.expenses.length, 'house expense'), inv && plural(inv.expenses.length, 'investment')].filter(Boolean);
    setMessage({ text: `Restored ${plural(backup.expenses.length, 'expense')}${extras.map(x => `, ${x}`).join('')} and your settings.` });
  };

  const applyMerge = backup => {
    const d = mergeExpenses(daily.store.expenses, backup.expenses);
    daily.store.replaceAll(d.list);
    let houseAdded = 0;
    if (backup.house) {
      const h = mergeExpenses(house.store.expenses, backup.house.expenses);
      house.store.replaceAll(h.list);
      houseAdded = h.added;
    }
    let investAdded = 0;
    if (backup.invest) {
      const v = mergeExpenses(invest.store.expenses, backup.invest.expenses);
      invest.store.replaceAll(v.list);
      investAdded = v.added;
    }
    if (backup.salary) salary.mergeMissing(backup.salary);
    const parts = [d.added && plural(d.added, 'expense'), houseAdded && plural(houseAdded, 'house expense'), investAdded && plural(investAdded, 'investment')].filter(Boolean);
    setMessage({ text: parts.length ? `Added ${parts.join(' and ')} that weren't here.` : 'Nothing new to add: all of these expenses are already here.' });
  };

  const restore = async () => {
    setBusy(true);
    setMessage(null);
    try {
      const text = await pickBackupText();
      if (text === null) return setBusy(false);
      const parsed = parseBackup(text);
      if (parsed.error) {
        setMessage({ text: parsed.error, error: true });
        return setBusy(false);
      }
      const { backup, skipped } = parsed;
      const note = skipped ? `\n(${plural(skipped, 'unreadable entry', 'unreadable entries')} will be skipped.)` : '';
      Alert.alert(
        'Restore backup',
        `This file has ${[plural(backup.expenses.length, 'expense'), backup.house && plural(backup.house.expenses.length, 'house expense'), backup.invest && plural(backup.invest.expenses.length, 'investment')].filter(Boolean).join(' and ')}. You have ${[String(daily.store.expenses.length), backup.house && plural(house.store.expenses.length, 'house expense'), backup.invest && plural(invest.store.expenses.length, 'investment')].filter(Boolean).join(' and ')} now.${note}`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Add to existing', onPress: () => applyMerge(backup) },
          { text: 'Replace everything', style: 'destructive', onPress: () => applyReplace(backup) },
        ]
      );
    } catch (e) {
      setMessage({ text: 'Could not read that file.', error: true });
    }
    setBusy(false);
  };

  return { backUp, restore, busy, message, lastBackup };
}
