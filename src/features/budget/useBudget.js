import { useEffect, useState } from 'react';
import { KEYS } from '../../constants/storageKeys';
import { asText, load, save } from '../../utils/storage';

// A monthly budget, kept as the text typed in Profile.
export function useBudget(storageKey = KEYS.budget) {
  const [budget, setBudget] = useState('');

  useEffect(() => {
    load(storageKey, asText).then(v => v && setBudget(v));
  }, []);

  const saveBudget = v => {
    setBudget(v);
    save(storageKey, v, asText);
  };

  // How a month's `total` compares with the budget.
  const statusFor = total => {
    const budgetNum = parseFloat(budget);
    const hasBudget = budgetNum > 0;
    const left = Math.round((budgetNum - total) * 100) / 100;
    return { budgetNum, hasBudget, left, over: hasBudget && left < 0 };
  };

  return { budget, saveBudget, statusFor };
}
