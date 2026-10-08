import { useState } from 'react';
import { dateKey, defaultDate, monthKey } from '../../utils/dates';

// The month being viewed and the day picked for a new expense.
export function useMonth() {
  const [month, setMonth] = useState(monthKey(new Date()));
  const [date, setDate] = useState(dateKey(new Date()));
  const changeMonth = k => {
    setMonth(k);
    setDate(defaultDate(k));
  };
  return { month, setMonth, date, setDate, changeMonth };
}
