import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Chevron from '../../components/Chevron';
import MonthBar from '../../components/MonthBar';
import { useTheme, useThemedStyles } from '../../theme/ThemeContext';
import { makeSharedStyles } from '../../theme/sharedStyles';
import { monthLabel } from '../../utils/dates';
import { overview } from './overviewMath';

const MASK = '• • • •';
// Fixed colours for the three parts. None of them is one of the five theme colours, so they never blend into the theme.
const DAILY_COLOUR = '#e5484d'; // red
const HOUSE_COLOUR = '#8fcb2b'; // lime
const INVEST_COLOUR = '#b44fd6'; // orchid

// One page for the month: salary, daily spending, house, investments, and what is left.
// Tap daily, house or invested to open that section's entries (and share them as a PDF).
export default function OverviewScreen({ month, onMonthChange, salary, daily, house, invest, hide, onOpen }) {
  const { c } = useTheme();
  const shared = useThemedStyles(makeSharedStyles);
  const styles = useThemedStyles(makeStyles);
  const { hidden, setHidden } = hide;

  const eff = salary.salaryFor(month); // { value, from } | null
  const own = month in salary.salaries;
  const o = overview({ salary: eff ? eff.value : null, daily, house, invest });
  const show = v => (hidden ? MASK : `${v} Rs`);
  const pctText = x => (!hidden && o.pct(x) != null ? ` · ${o.pct(x)}%` : '');
  const share = x => (o.base > 0 ? `${(x / o.base) * 100}%` : '0%');

  const rows = [
    ['Daily spending', daily, DAILY_COLOUR, 'daily'],
    ['House', house, HOUSE_COLOUR, 'house'],
    ['Invested', invest, INVEST_COLOUR, 'invest'],
  ];

  return (
    <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <MonthBar month={month} onChange={onMonthChange} />

      <Pressable style={styles.salaryCard} onPress={hidden ? () => setHidden(false) : undefined}>
        <View style={styles.salaryTop}>
          <Text style={styles.salaryLabel}>In-hand salary</Text>
          <Pressable onPress={() => setHidden(!hidden)} hitSlop={10}>
            <Text style={styles.hint}>{hidden ? 'Tap to show' : 'Tap to hide'}</Text>
          </Pressable>
        </View>
        {hidden ? (
          <Text style={[styles.salaryMasked, { color: c.muted }]}>{MASK}</Text>
        ) : (
          <View style={styles.salaryRow}>
            <TextInput
              style={styles.salaryInput}
              keyboardType="numeric"
              placeholder={eff ? String(eff.value) : 'Enter salary'}
              placeholderTextColor={c.muted}
              value={own ? String(salary.salaries[month]) : ''}
              onChangeText={t => salary.setSalary(month, t)}
            />
            <Text style={styles.rs}>Rs</Text>
          </View>
        )}
        {!hidden && eff && eff.from && <Text style={styles.note}>Using {monthLabel(eff.from)}'s salary. Type a new amount to change it for this month.</Text>}
        {!hidden && !eff && <Text style={styles.note}>Add your salary to see what's left each month.</Text>}
      </Pressable>

      <View style={styles.bar}>
        {rows.map(([name, v, colour]) => (v > 0 ? <View key={name} style={{ width: share(v), backgroundColor: colour }} /> : null))}
        {o.hasSalary && !o.over && o.left > 0 && <View style={{ width: share(o.left), backgroundColor: c.border }} />}
      </View>

      {rows.map(([name, v, colour, id]) => (
        <Pressable key={name} style={[shared.statCard, styles.rowCard]} onPress={() => onOpen(id)}>
          <View style={styles.rowLeft}>
            <View style={[styles.dot, { backgroundColor: colour }]} />
            <Text style={shared.statLabel}>{name}</Text>
          </View>
          <View style={styles.rowRight}>
            <Text style={shared.statValue}>
              {show(v)}
              <Text style={styles.pct}>{pctText(v)}</Text>
            </Text>
            <View style={{ marginLeft: 12 }}>
              <Chevron direction="right" color={c.muted} size={9} thickness={2} />
            </View>
          </View>
        </Pressable>
      ))}

      <View style={[styles.leftCard, o.over && { borderColor: c.danger }]}>
        <Text style={styles.leftLabel}>{o.over ? 'Over your salary by' : 'Left this month'}</Text>
        {o.hasSalary ? (
          <Text style={[styles.leftAmount, o.over && { color: c.danger }]}>{hidden ? MASK : `${Math.abs(o.left)} Rs`}</Text>
        ) : (
          <Text style={styles.leftAmount}>{hidden ? MASK : '—'}</Text>
        )}
        {o.hasSalary && !hidden && o.pct(Math.abs(o.left)) != null && (
          <Text style={styles.note}>{o.over ? `${o.pct(-o.left)}% more than you earned` : `${o.pct(o.left)}% of your salary`}</Text>
        )}
        {!o.hasSalary && !hidden && <Text style={styles.note}>Add your salary above.</Text>}
      </View>
    </ScrollView>
  );
}

const makeStyles = c =>
  StyleSheet.create({
    content: { paddingBottom: 24 },
    salaryCard: { backgroundColor: c.card, borderRadius: 14, padding: 18, marginTop: 16 },
    salaryTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    salaryLabel: { color: c.muted, fontSize: 13 },
    hint: { color: c.muted, fontSize: 12 },
    salaryRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    salaryInput: { flex: 1, color: c.text, fontSize: 30, fontWeight: '700', paddingVertical: 4, paddingHorizontal: 0 },
    rs: { color: c.muted, fontSize: 18, marginLeft: 8 },
    salaryMasked: { fontSize: 30, fontWeight: '700', letterSpacing: 4, marginTop: 8, marginBottom: 4 },
    note: { color: c.muted, fontSize: 12, lineHeight: 17, marginTop: 6 },
    bar: { flexDirection: 'row', height: 10, borderRadius: 5, overflow: 'hidden', backgroundColor: c.border, marginTop: 16 },
    rowCard: { alignItems: 'center' },
    rowLeft: { flexDirection: 'row', alignItems: 'center' },
    rowRight: { flexDirection: 'row', alignItems: 'center' },
    dot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
    pct: { color: c.muted, fontSize: 13, fontWeight: '400' },
    leftCard: { backgroundColor: c.card, borderRadius: 14, padding: 18, marginTop: 20, borderWidth: 1.5, borderColor: c.accent },
    leftLabel: { color: c.muted, fontSize: 13 },
    leftAmount: { color: c.text, fontSize: 34, fontWeight: '700', marginTop: 2 },
  });
