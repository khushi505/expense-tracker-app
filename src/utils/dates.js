export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const pad = n => String(n).padStart(2, '0');
export const dateKey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const monthKey = d => dateKey(d).slice(0, 7);
export const monthLabel = k => `${MONTHS[+k.slice(5) - 1]} ${k.slice(0, 4)}`;
export const dateLabel = k => `${+k.slice(8)} ${monthLabel(k.slice(0, 7))}`;
export const shiftMonth = (k, n) => monthKey(new Date(+k.slice(0, 4), +k.slice(5) - 1 + n, 1));
export const daysIn = k => new Date(+k.slice(0, 4), +k.slice(5), 0).getDate();

// Expenses saved before dates existed have no date field; derive it from their id (a timestamp).
export const dateOf = e => e.date || dateKey(new Date(+e.id));

// Landing date for a month: today if it's the current month, else the 1st.
export const defaultDate = m => (m === monthKey(new Date()) ? dateKey(new Date()) : `${m}-01`);
