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
export function useBackup({ store, profile, budget, icons }) {
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
        expenses: store.expenses,
        name: profile.name,
        budget: budget.budget,
        icons: icons.custom,
        theme: { mode, accent },
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
    store.replaceAll(backup.expenses);
    if (backup.name !== undefined) profile.saveName(backup.name);
    if (backup.budget !== undefined) budget.saveBudget(backup.budget);
    if (backup.icons) icons.saveIcons(backup.icons);
    if (backup.theme) saveTheme(backup.theme.mode, backup.theme.accent);
    setMessage({ text: `Restored ${plural(backup.expenses.length, 'expense')} and your settings.` });
  };

  const applyMerge = backup => {
    const { list, added } = mergeExpenses(store.expenses, backup.expenses);
    store.replaceAll(list);
    setMessage({ text: added ? `Added ${plural(added, 'expense')} that weren't here.` : 'Nothing new to add: all of these expenses are already here.' });
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
        `This file has ${plural(backup.expenses.length, 'expense')}. You have ${store.expenses.length} now.${note}`,
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
