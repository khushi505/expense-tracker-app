import { Pressable, StyleSheet, Text, View } from 'react-native';
import MonthBar from '../../components/MonthBar';
import { useTheme, useThemedStyles } from '../../theme/ThemeContext';
import BudgetBar from '../budget/BudgetBar';
import LedgerSwitch from '../ledger/LedgerSwitch';

// Summary only: the month's total and budget. The list of expenses is one tap away.
export default function HomeScreen({ ledger, onLedgerChange, month, onMonthChange, total, count, budgetStatus, hide, onViewExpenses }) {
  const { c } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const { hidden, setHidden } = hide;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginTop: 14 }}>
        <LedgerSwitch value={ledger.id} onChange={onLedgerChange} />
      </View>
      <View style={{ marginTop: 10 }}>{/* + the bar's own 6 = 16 above the month bar */}
        <MonthBar month={month} onChange={onMonthChange} />
      </View>
      <View style={{ height: 16 }} />{/* 16 below the month bar, same as above */}
      <Pressable style={styles.summary} onPress={() => setHidden(!hidden)}>
        <View style={styles.top}>
          <Text style={styles.label}>{ledger.totalLabel}</Text>
          <Text style={styles.hint}>{hidden ? 'Tap to show' : 'Tap to hide'}</Text>
        </View>
        <Text style={[styles.amount, hidden && { color: c.muted, letterSpacing: 4 }]}>{hidden ? '• • • •' : `${total} Rs`}</Text>
        <BudgetBar total={total} status={budgetStatus} hidden={hidden} />
      </Pressable>
      <Pressable style={styles.viewBtn} onPress={onViewExpenses}>
        <Text style={styles.viewBtnText}>{ledger.viewLabel} ({count})</Text>
      </Pressable>
    </View>
  );
}

const makeStyles = c =>
  StyleSheet.create({
    summary: { backgroundColor: c.card, borderRadius: 14, padding: 18 },
    top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    label: { color: c.muted, fontSize: 13 },
    hint: { color: c.muted, fontSize: 12 },
    amount: { color: c.text, fontSize: 34, fontWeight: '700', marginTop: 2, marginBottom: 4 },
    viewBtn: { borderWidth: 1.5, borderColor: c.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 16 },
    viewBtnText: { color: c.accent, fontSize: 16, fontWeight: '600' },
  });
