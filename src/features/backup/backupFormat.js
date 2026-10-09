import { CATEGORIES, HOUSE_CATEGORIES, INVEST_CATEGORIES } from '../../constants/categories';
import { ACCENTS } from '../../theme/palettes';
import { monthKey } from '../../utils/dates';
import { lastEmoji } from '../../utils/emoji';

export const BACKUP_VERSION = 1;
const APP_ID = 'expense-tracker';

// What goes into the backup file. The PIN and app-lock settings are left out on purpose.
// `house`, `invest`, `salary`, `budgets` and `savingsTargets` are optional extras: older backups don't have them.
// salary / budgets / savingsTargets are { 'YYYY-MM': amount }, one amount per month.
export function buildBackup({ expenses, name, icons, theme, house, invest, salary, budgets, savingsTargets }) {
  return {
    app: APP_ID,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    data: { expenses, name, icons, theme, house, invest, salary, budgets, savingsTargets },
  };
}

// Keeps only entries that look like real expenses; returns null for ones that don't.
function cleanExpense(e, categories) {
  if (!e || typeof e !== 'object') return null;
  const id = typeof e.id === 'number' ? String(e.id) : e.id;
  const label = typeof e.label === 'string' ? e.label.trim() : '';
  if (typeof id !== 'string' || !id || !label || typeof e.amount !== 'number' || !isFinite(e.amount)) return null;
  const out = { id, label, amount: e.amount };
  if (typeof e.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(e.date)) out.date = e.date; // missing/invalid dates are worked out from the id
  out.category = typeof e.category === 'string' && e.category in categories ? e.category : null;
  return out;
}

function cleanIcons(icons, categories) {
  if (!icons || typeof icons !== 'object') return undefined;
  const out = {};
  for (const k of Object.keys(categories)) {
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

// An amount typed in Profile: a number or numeric text, never negative.
function cleanAmount(x) {
  const n = typeof x === 'number' ? x : typeof x === 'string' ? parseFloat(x) : NaN;
  return isFinite(n) && n >= 0 ? n : undefined;
}

// { '2026-10': 80000 } -> keeps only valid months with sensible amounts. Returns undefined if there are none.
function cleanMonthMap(m) {
  if (!m || typeof m !== 'object' || Array.isArray(m)) return undefined;
  const out = {};
  for (const [k, v] of Object.entries(m)) if (/^\d{4}-(0[1-9]|1[0-2])$/.test(k) && cleanAmount(v) !== undefined) out[k] = cleanAmount(v);
  return Object.keys(out).length ? out : undefined;
}

// A per-month amount. Older backups stored a single amount for everything: that goes to the month the backup was made.
function monthlyAmount(value, legacySingle, exportedMonth) {
  const map = cleanMonthMap(value);
  if (map) return map;
  const single = cleanAmount(legacySingle !== undefined ? legacySingle : value);
  return single !== undefined ? { [exportedMonth]: single } : undefined;
}

// Cleans a list of expenses: drops broken entries and repeated ids, and counts what it dropped.
function cleanList(list, categories) {
  const seen = new Set();
  const expenses = [];
  let skipped = 0;
  for (const raw of list) {
    const e = cleanExpense(raw, categories);
    if (!e || seen.has(e.id)) skipped++;
    else {
      seen.add(e.id);
      expenses.push(e);
    }
  }
  return { expenses, skipped };
}

// An optional section of the file (house or invest). Returns null when the file doesn't have one.
function readSection(raw, categories) {
  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.expenses)) return null;
  const { expenses, skipped } = cleanList(raw.expenses, categories);
  return { expenses, skipped, icons: cleanIcons(raw.icons, categories) };
}

// Reads the text of a backup file. Returns { error } or { backup, skipped }.
export function parseBackup(text) {
  let file;
  try {
    file = JSON.parse(text);
  } catch (e) {
    return { error: "That file isn't a valid backup." };
  }
  if (!file || file.app !== APP_ID || !file.data) return { error: "That isn't a Tracker backup." };
  if (typeof file.version === 'number' && file.version > BACKUP_VERSION) {
    return { error: 'This backup was made by a newer version of the app. Please update the app first.' };
  }
  if (!Array.isArray(file.data.expenses)) return { error: 'This backup has no expenses in it.' };

  const d = file.data;
  const daily = cleanList(d.expenses, CATEGORIES);
  const house = readSection(d.house, HOUSE_CATEGORIES);
  const invest = readSection(d.invest, INVEST_CATEGORIES);

  // Backups made before amounts were per month had one salary / budget / target for all months.
  const exportedMonth = typeof file.exportedAt === 'string' && /^\d{4}-\d{2}/.test(file.exportedAt) ? file.exportedAt.slice(0, 7) : monthKey(new Date());

  return {
    skipped: daily.skipped + (house ? house.skipped : 0) + (invest ? invest.skipped : 0),
    backup: {
      expenses: daily.expenses,
      name: typeof d.name === 'string' ? d.name.slice(0, 60) : undefined,
      icons: cleanIcons(d.icons, CATEGORIES),
      theme: cleanTheme(d.theme),
      house: house && { expenses: house.expenses, icons: house.icons },
      invest: invest && { expenses: invest.expenses, icons: invest.icons },
      salary: monthlyAmount(d.salary, undefined, exportedMonth),
      budgets: monthlyAmount(d.budgets, d.budget, exportedMonth),
      savingsTargets: monthlyAmount(d.savingsTargets, d.savingsTarget, exportedMonth),
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
