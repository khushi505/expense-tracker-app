import { useEffect, useRef, useState } from 'react';
import { KEYS } from '../../constants/storageKeys';
import { load, save } from '../../utils/storage';

// A list of expenses, saved on the phone under `storageKey`, plus "undo" for the last deleted one.
export function useExpenses(storageKey = KEYS.expenses) {
  const [expenses, setExpenses] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [undo, setUndo] = useState(null); // { item, index } of the last deleted expense
  const undoTimer = useRef(null);

  useEffect(() => {
    load(storageKey).then(v => {
      if (v) setExpenses(v);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) save(storageKey, expenses);
  }, [expenses, loaded]);

  useEffect(() => () => clearTimeout(undoTimer.current), []);

  const add = item => setExpenses([item, ...expenses]);
  const update = (id, patch) => setExpenses(expenses.map(e => (e.id === id ? { ...e, ...patch } : e)));

  // Used by restore: swap in a whole new list.
  const replaceAll = list => {
    clearTimeout(undoTimer.current);
    setUndo(null);
    setExpenses(list);
  };

  const remove = id => {
    const index = expenses.findIndex(e => e.id === id);
    if (index < 0) return;
    setUndo({ item: expenses[index], index });
    setExpenses(expenses.filter(e => e.id !== id));
    clearTimeout(undoTimer.current);
    undoTimer.current = setTimeout(() => setUndo(null), 5000);
  };

  const restore = () => {
    if (!undo) return;
    clearTimeout(undoTimer.current);
    const next = [...expenses];
    next.splice(Math.min(undo.index, next.length), 0, undo.item);
    setExpenses(next);
    setUndo(null);
  };

  return { expenses, add, update, remove, replaceAll, undo, restore };
}
