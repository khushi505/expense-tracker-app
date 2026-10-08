import { useState } from 'react';

// The add / edit form: its fields, and turning them into a saved expense.
export function useExpenseForm() {
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const reset = () => {
    setEditingId(null);
    setCategory(null);
    setLabel('');
    setAmount('');
  };

  // Fill the form with an existing expense so it can be edited.
  const load = e => {
    setEditingId(e.id);
    setLabel(e.label);
    setCategory(e.category || null);
    setAmount(String(e.amount));
  };

  const canSave = !!label.trim() && parseFloat(amount) >= 0;

  // Saves a new expense (or the edit) on `date`. Returns false if the form isn't valid yet.
  const submit = (date, { add, update }) => {
    const value = parseFloat(amount);
    if (!label.trim() || isNaN(value)) return false;
    if (editingId) update(editingId, { label: label.trim(), amount: value, date, category });
    else add({ id: Date.now().toString(), label: label.trim(), amount: value, date, category });
    reset();
    return true;
  };

  return { label, setLabel, amount, setAmount, category, setCategory, editingId, canSave, reset, load, submit };
}
