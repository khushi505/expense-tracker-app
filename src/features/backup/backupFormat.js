import { CATEGORIES } from '../../constants/categories';
import { ACCENTS } from '../../theme/palettes';
import { lastEmoji } from '../../utils/emoji';

export const BACKUP_VERSION = 1;
const APP_ID = 'expense-tracker';

// What goes into the backup file. The PIN and app-lock settings are left out on purpose.
export function buildBackup({ expenses, name, budget, icons, theme }) {
  return {
    app: APP_ID,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    data: { expenses, name, budget, icons, theme },
  };
}

// Keeps only entries that look like real expenses; returns null for ones that don't.
function cleanExpense(e) {
  if (!e || typeof e !== 'object') return null;
  const id = typeof e.id === 'number' ? String(e.id) : e.id;
  const label = typeof e.label === 'string' ? e.label.trim() : '';
  if (typeof id !== 'string' || !id || !label || typeof e.amount !== 'number' || !isFinite(e.amount)) return null;
  const out = { id, label, amount: e.amount };
  if (typeof e.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(e.date)) out.date = e.date; // missing/invalid dates are worked out from the id
  out.category = typeof e.category === 'string' && e.category in CATEGORIES ? e.category : null;
  return out;
}

function cleanIcons(icons) {
  if (!icons || typeof icons !== 'object') return undefined;
  const out = {};
  for (const k of Object.keys(CATEGORIES)) {
    const emoji = typeof icons[k] === 'string' ? lastEmoji(icons[k]) : null;
    if (emoji) out[k] = emoji;
  }
  return out;
}

function cleanTheme(t) {
  if (!t || typeof t !== 'object') return undefined;
  const mode = t.mode === 'light' || t.mode === 'dark' ? t.mode : null;
  const accent = ACCENTS.includes(t.accent) ? t.accent : undefined;
  return accent ? { mode, accent } : undefined;
}

// Reads the text of a backup file. Returns { error } or { backup, skipped }.
export function parseBackup(text) {
  let file;
  try {
    file = JSON.parse(text);
  } catch (e) {
    return { error: "That file isn't a valid backup." };
  }
  if (!file || file.app !== APP_ID || !file.data) return { error: "That isn't an Expense Tracker backup." };
  if (typeof file.version === 'number' && file.version > BACKUP_VERSION) {
    return { error: 'This backup was made by a newer version of the app. Please update the app first.' };
  }
  if (!Array.isArray(file.data.expenses)) return { error: 'This backup has no expenses in it.' };

  const seen = new Set();
  const expenses = [];
  let skipped = 0;
  for (const raw of file.data.expenses) {
    const e = cleanExpense(raw);
    if (!e || seen.has(e.id)) skipped++;
    else {
      seen.add(e.id);
      expenses.push(e);
    }
  }

  const d = file.data;
  return {
    skipped,
    backup: {
      expenses,
      name: typeof d.name === 'string' ? d.name.slice(0, 60) : undefined,
      budget: typeof d.budget === 'string' ? d.budget : undefined,
      icons: cleanIcons(d.icons),
      theme: cleanTheme(d.theme),
    },
  };
}

// Adds the backup's expenses that aren't already here (matched by id). Newest first.
export function mergeExpenses(current, incoming) {
  const have = new Set(current.map(e => e.id));
  const added = incoming.filter(e => !have.has(e.id));
  const list = [...current, ...added].sort((a, b) => Number(b.id) - Number(a.id) || 0);
  return { list, added: added.length };
}
