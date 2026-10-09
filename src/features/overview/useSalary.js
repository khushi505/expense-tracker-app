import { useEffect, useState } from 'react';
import { KEYS } from '../../constants/storageKeys';
import { load, save } from '../../utils/storage';

// In-hand salary, one value per month ({ '2026-10': 80000 }). A month with no value uses the latest earlier one.
export function useSalary() {
  const [salaries, setSalaries] = useState({});

  useEffect(() => {
    load(KEYS.salary).then(v => v && setSalaries(v));
  }, []);

  const persist = next => {
    setSalaries(next);
    save(KEYS.salary, next);
  };

  // { value, from } where `from` is the earlier month it was carried over from (null if set for this month).
  const salaryFor = month => {
    if (month in salaries) return { value: salaries[month], from: null };
    const earlier = Object.keys(salaries).filter(k => k < month).sort();
    const last = earlier[earlier.length - 1];
    return last ? { value: salaries[last], from: last } : null;
  };

  // Text typed for a month. Empty clears it (so the month goes back to using the earlier salary).
  const setSalary = (month, text) => {
    const next = { ...salaries };
    if (!text.trim()) delete next[month];
    else {
      const n = parseFloat(text);
      if (isNaN(n) || n < 0) return;
      next[month] = n;
    }
    persist(next);
  };

  const replaceAll = map => persist(map);
  const mergeMissing = map => persist({ ...map, ...salaries }); // keep what is already here
  return { salaries, salaryFor, setSalary, replaceAll, mergeMissing };
}
