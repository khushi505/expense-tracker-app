import { useEffect, useState } from 'react';
import { asText, load, save } from '../../utils/storage';
import { monthKey } from '../../utils/dates';

// An amount entered separately for each month ({ '2026-10': '80000' }): salary, daily budget, savings target.
// Values are kept as the typed text so decimals can be typed. A month with nothing entered has no value.
export function useMonthlyAmount(storageKey, legacyKey) {
  const [map, setMap] = useState({});
  const persist = next => {
    setMap(next);
    save(storageKey, next);
  };

  useEffect(() => {
    (async () => {
      let m = (await load(storageKey)) || {};
      if (legacyKey) {
        // Older versions kept a single amount for all months. Keep it for the current month, then clear it.
        const old = await load(legacyKey, asText);
        const n = parseFloat(old);
        if (old && n >= 0) {
          const now = monthKey(new Date());
          if (!(now in m)) {
            m = { ...m, [now]: String(n) };
            save(storageKey, m);
          }
        }
        if (old) save(legacyKey, '', asText);
      }
      setMap(m);
    })();
  }, []);

  const valueFor = month => {
    const n = parseFloat(map[month]);
    return n >= 0 ? n : null;
  };
  const textFor = month => (month in map ? String(map[month]) : '');

  // The latest earlier month that has an amount, to offer as "use last month's".
  const previous = month => {
    const earlier = Object.keys(map).filter(k => k < month && parseFloat(map[k]) >= 0).sort();
    const last = earlier[earlier.length - 1];
    return last ? { month: last, value: parseFloat(map[last]) } : null;
  };

  // Empty text clears the month; text that isn't a valid amount is ignored.
  const set = (month, text) => {
    const next = { ...map };
    if (!text.trim()) delete next[month];
    else if (parseFloat(text) >= 0) next[month] = text.trim();
    else return;
    persist(next);
  };

  const toText = amounts => Object.fromEntries(Object.entries(amounts).map(([k, v]) => [k, String(v)]));
  const replaceAll = amounts => persist(toText(amounts)); // used by restore
  const mergeMissing = amounts => persist({ ...toText(amounts), ...map }); // keeps what is already here

  const numbers = Object.fromEntries(Object.keys(map).filter(k => parseFloat(map[k]) >= 0).map(k => [k, parseFloat(map[k])]));
  return { valueFor, textFor, previous, set, replaceAll, mergeMissing, numbers };
}
